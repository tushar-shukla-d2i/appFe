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
import {
  Button,
  ErrorComponent,
  Input,
  ScreenHeader,
  ScreenWrapper,
  Toast,
} from "../../components";

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
  const [apiError, setApiError] = useState("");
  const [usersList, setUsersList] = useState([{ value: "", label: "Select" }]);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};
  const isAdmin = userData?.role === USER_ROLES.ADMIN;
  const isMyProfile = userData?._id === user_id;

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await userApis.getAllUsers({ includeSelf: true, limit: 0 });
      const fetchedUsers = resp?.users
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
    officialEmail: Yup.string()
      .email("Invalid email address")
      .required("Official Email is required"),
    parent_id:
      !!isAdmin && !isMyProfile
        ? Yup.string().required("Please assign the user to someone")
        : Yup.string()?.nullable(),
    joiningDate:
      !!isAdmin && !user_id
        ? Yup.date().required("Joining Date is required")
        : Yup.string(),
    bloodGroup:
      isMyProfile && !userInfo?.bloodGroup
        ? Yup.string().required("Blood Group is required")
        : Yup.string().nullable(),
    contactNumber:
      isMyProfile && !userInfo?.contactNumber
        ? Yup.string()
            .matches(/^[0-9]+$/, "Contact Number must be numeric")
            .required("Contact Number is required")
        : Yup.string()
            .matches(/^[0-9]+$/, "Contact Number must be numeric")
            .nullable(),
    birthday:
      isMyProfile && !userInfo?.birthday
        ? Yup.date()
            .required("Birthday is required")
            .max(new Date(maxDate), "You must be at least 18 years old")
            .min(new Date(minDate), "You must be at most 55 years old")
        : Yup.string(),
    alternateEmail: Yup.string()
      .email("Invalid alternate email address")
      .nullable(),
    alternateContactNumber: Yup.string()
      .matches(/^[0-9]*$/, "Alternate Contact Number must be numeric")
      .nullable(),
    anniversaryDate: Yup.string().nullable(),
  });

  const handleSubmit = async (values) => {
    setApiError("");
    setLoading(true);
    let payload = { ...values };

    if (!values.alternateContactNumber) {
      delete payload.alternateContactNumber;
    }
    if (!values.alternateEmail) {
      delete payload.alternateEmail;
    }
    if (!values.anniversaryDate) {
      delete payload.anniversaryDate;
    }
    payload = UtilFunctions.deleteKeys(payload, [
      "password",
      "userProfile",
      "passwordNeedsReset",
      "userState",
      "createdAt",
      "__v",
      "role",
      "employeeId",
      "isActive",
    ]);
    if (isMyProfile) {
      payload = UtilFunctions.deleteKeys(payload, ["parent_id"]);
    }
    if (isAdmin && !user_id) {
      payload = UtilFunctions.deleteKeys(payload, [
        "birthday",
        "bloodGroup",
        "contactNumber",
        "anniversaryDate",
      ]);
    }
    if (user_id) {
      payload = UtilFunctions.deleteKeys(payload, [
        "_id",
        "firstName",
        "lastName",
        "officialEmail",
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
    } else if (resp?.errors) {
      setApiError(resp?.errors?.global);
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader
          title={`${user_id ? "Edit" : "Add New"} ${
            isMyProfile ? "Profile" : "User"
          }`}
          toastMsg={toastMsg}
        />

        <div className="w-[85%] mx-auto mt-10">
          {!!apiError && <ErrorComponent error={apiError} />}

          <div className="p-6 space-y-4 rounded-lg shadow-lg border border-gray-300">
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
                anniversaryDate: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setValues }) => {
                useEffect(() => {
                  if (user_id) {
                    const getUserData = async () => {
                      const resp = isMyProfile
                        ? await commonApis.getMyData()
                        : await userApis.getUserById({ user_id });
                      if (resp?.data?.data) {
                        setUserInfo(resp?.data?.data);
                        setValues({
                          ...resp?.data?.data,
                          birthday:
                            resp?.data?.data?.birthday?.split?.("T")[0] || "",
                          joiningDate:
                            resp?.data?.data?.joiningDate?.split?.("T")[0] ||
                            "",
                          anniversaryDate:
                            resp?.data?.data?.anniversaryDate?.split?.(
                              "T"
                            )[0] || "",
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
                      placeholder="Enter first name"
                      disabled={!!user_id || loading}
                    />

                    <Input
                      id="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                      disabled={!!user_id || loading}
                    />

                    {!!user_id && (
                      <Input
                        id="bloodGroup"
                        label="Blood Group"
                        type="select"
                        options={BLOOD_GROUPS}
                        disabled={
                          !isMyProfile || userInfo?.bloodGroup || loading
                        }
                      />
                    )}

                    <Input
                      id="joiningDate"
                      label="Joining Date"
                      type="date"
                      disabled={!!user_id || loading}
                    />

                    {!!user_id && (
                      <Input
                        id="birthday"
                        label="Birthday"
                        type="date"
                        min={minDate}
                        max={maxDate}
                        disabled={!isMyProfile || userInfo?.birthday || loading}
                      />
                    )}

                    {!!user_id && (
                      <Input
                        id="anniversaryDate"
                        label="Anniversary (Optional)"
                        type="date"
                        disabled={
                          !isMyProfile || userInfo?.anniversaryDate || loading
                        }
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
                      placeholder="Enter official email"
                      type="email"
                      disabled={!!user_id || loading}
                    />

                    {!!user_id && (
                      <Input
                        id="alternateEmail"
                        label="Alternate Email (Optional)"
                        placeholder="Enter alternate email"
                        type="email"
                        disabled={!isMyProfile || loading}
                      />
                    )}

                    {!!user_id && (
                      <Input
                        id="contactNumber"
                        label="Contact Number"
                        placeholder="Enter contact number"
                        type="tel"
                        disabled={
                          !isMyProfile || userInfo?.contactNumber || loading
                        }
                      />
                    )}

                    {!!user_id && (
                      <Input
                        id="alternateContactNumber"
                        label="Alternate Contact Number (Optional)"
                        placeholder="Enter alternate contact number"
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
    </ScreenWrapper>
  );
};

export { ManageUser };
