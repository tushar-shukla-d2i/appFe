/*
 * Add/Edit User
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { commonApis, userApis } from "../../apis";
import { UtilFunctions } from "../../utils/CommonUtils";
import { BLOOD_GROUPS, USER_DATA, USER_ROLES } from "../../constants";
import { LocalStorageHelper } from "../../utils/HttpUtils";
import { Button, Input, ScreenHeader, Toast } from "../../components";

// Helper function to calculate date range
const getDateFromYearsAgo = (years) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split("T")[0];
};

const minDate = getDateFromYearsAgo(55); // 55 years ago
const maxDate = getDateFromYearsAgo(18); // 18 years ago

const ManageUser = () => {
  const { user_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [usersList, setUsersList] = useState([{ value: "", label: "Select" }]);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};
  const isAdmin = userData?.role === USER_ROLES.ADMIN;
  const isMyProfile = userData?._id === user_id;

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await userApis.getAllUsers({ includeSelf: true });
      const fetchedUsers = resp
        ?.filter?.((u) => u?._id !== user_id)
        ?.map?.((user) => ({
          value: user?._id,
          label: `${user?.firstName} ${user?.lastName}`,
        }));
      setUsersList((prevList) => [...prevList, ...fetchedUsers]);
    };

    !isMyProfile && fetchUsers();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    parent_id: user_id
      ? Yup.string()
      : Yup.string().required("Please assign the user to someone"),
    officialEmail: Yup.string()
      .email("Invalid email address")
      .required("Official Email is required"),
    bloodGroup: isAdmin
      ? Yup.string().nullable()
      : Yup.string().required("Blood Group is required"),
    alternateEmail: Yup.string()
      .email("Invalid alternate email address")
      .nullable(),
    contactNumber: isAdmin
      ? Yup.string()
          .matches(/^[0-9]+$/, "Contact Number must be numeric")
          .nullable()
      : Yup.string()
          .matches(/^[0-9]+$/, "Contact Number must be numeric")
          .required("Contact Number is required"),
    alternateContactNumber: Yup.string()
      .matches(/^[0-9]*$/, "Alternate Contact Number must be numeric")
      .nullable(),
    birthday: isAdmin
      ? Yup.string()
      : Yup.date()
          .required("Birthday is required")
          .max(new Date(maxDate), "You must be at least 18 years old")
          .min(new Date(minDate), "You must be at most 55 years old"),
    joiningDate: isAdmin
      ? Yup.date().required("Joining Date is required")
      : Yup.string(),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    let payload = { ...values };

    if (!values.alternateContactNumber) {
      delete payload.alternateContactNumber;
    }
    if (!values.alternateEmail) {
      delete payload.alternateEmail;
    }
    if (isMyProfile) {
      payload = UtilFunctions.deleteKeys(payload, [
        "parent_id",
        "passwordNeedsReset",
        "userState",
        "createdAt",
        "__v",
      ]);
    }

    if (isAdmin && !user_id) {
      payload = UtilFunctions.deleteKeys(payload, [
        "birthday",
        "bloodGroup",
        "contactNumber",
      ]);
    }

    if (user_id) {
      payload = UtilFunctions.deleteKeys(payload, [
        "_id",
        "firstName",
        "lastName",
        "officialEmail",
        "role",
        "employeeId",
        "isActive",
        "joiningDate",
      ]);
    }

    const resp = isMyProfile
      ? await commonApis.me({ user_id, payload })
      : user_id
      ? await userApis.updateUserById({
          user_id,
          payload: { parent_id: payload.parent_id },
        })
      : await userApis.createUser(payload);
    setLoading(false);
    if (resp?.success) {
      if (isMyProfile) {
        LocalStorageHelper.store(USER_DATA, JSON.stringify(values));
      }
      setToastMsg(
        `${isMyProfile ? "Profile" : "User"} ${
          user_id ? "updated" : "added"
        } successfully!`
      );
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader
        title={`${user_id ? "Edit" : "Add New"} ${
          isMyProfile ? "Profile" : "User"
        }`}
        toastMsg={toastMsg}
      />

      <div className="w-[70%] mx-auto mt-14">
        <div className="p-8 space-y-4 rounded-lg shadow-lg border border-gray-300">
          <Formik
            enableReinitialize
            initialValues={{
              firstName: "",
              lastName: "",
              bloodGroup: "",
              officialEmail: "",
              alternateEmail: "",
              contactNumber: "",
              alternateContactNumber: "",
              birthday: "",
              parent_id: "",
              joiningDate: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setValues }) => {
              useEffect(() => {
                if (user_id) {
                  const getUserData = async () => {
                    const resp = await userApis.getUserById({ user_id });
                    if (resp?.data?.data) {
                      setUserInfo(resp?.data?.data);
                      setValues({
                        ...resp?.data?.data,
                        birthday:
                          resp?.data?.data?.birthday?.split?.("T")[0] || "",
                        joiningDate:
                          resp?.data?.data?.joiningDate?.split?.("T")[0] || "",
                      });
                    }
                  };
                  getUserData();
                }
              }, [user_id, setValues]);

              return (
                <Form className="space-y-5">
                  <Input
                    id="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    disabled={!!user_id || loading}
                  />

                  <Input
                    id="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    disabled={!!user_id || loading}
                  />

                  {(!isAdmin || !!user_id) && (
                    <Input
                      id="bloodGroup"
                      label="Blood Group"
                      type="select"
                      options={BLOOD_GROUPS}
                      disabled={isAdmin || userInfo?.bloodGroup || loading}
                    />
                  )}

                  <Input
                    id="joiningDate"
                    label="Joining Date"
                    type="date"
                    disabled={!!user_id || loading}
                  />

                  {(!isAdmin || !!user_id) && (
                    <Input
                      id="birthday"
                      label="Birthday"
                      type="date"
                      min={minDate}
                      max={maxDate}
                      disabled={isAdmin || userInfo?.birthday || loading}
                    />
                  )}

                  {!isMyProfile && (
                    <Input
                      id="parent_id"
                      label="Assign To"
                      type="select"
                      options={usersList}
                      disabled={loading}
                    />
                  )}

                  <Input
                    id="officialEmail"
                    label="Official Email"
                    placeholder="Enter your official email"
                    type="email"
                    disabled={!!user_id || loading}
                  />

                  {(!isAdmin || !!user_id) && (
                    <Input
                      id="alternateEmail"
                      label="Alternate Email (Optional)"
                      placeholder="Enter your alternate email"
                      type="email"
                      disabled={!isMyProfile || loading}
                    />
                  )}

                  {(!isAdmin || !!user_id) && (
                    <Input
                      id="contactNumber"
                      label="Contact Number"
                      placeholder="Enter your contact number"
                      type="tel"
                      disabled={isAdmin || userInfo?.contactNumber || loading}
                    />
                  )}

                  {(!isAdmin || !!user_id) && (
                    <Input
                      id="alternateContactNumber"
                      label="Alternate Contact Number (Optional)"
                      placeholder="Enter your alternate contact number"
                      type="tel"
                      disabled={!isMyProfile || loading}
                    />
                  )}

                  <Button
                    loading={loading || isSubmitting}
                    title={`${user_id ? "Update" : "Add"} ${
                      isMyProfile ? "Profile" : "User"
                    }`}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      <Toast message={toastMsg} />
    </div>
  );
};

export { ManageUser };
