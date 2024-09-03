/*
 * Add/Edit User
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { commonApis, userApis } from "../../apis";
import { UtilFunctions } from "../../utils/CommonUtils";
import { BLOOD_GROUPS, USER_DATA } from "../../constants";
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
  const [usersList, setUsersList] = useState([{ value: "", label: "Select" }]);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};
  const isMyProfile = userData?._id === user_id;

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await userApis.getAllUsers();
      if (resp?.success) {
        const fetchedUsers = resp?.data?.map?.((user) => ({
          value: user?._id,
          label: `${user?.firstName} ${user?.lastName}`,
        }));
        setUsersList((prevList) => [...prevList, ...fetchedUsers]);
      }
    };

    fetchUsers();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    bloodGroup: Yup.string().required("Blood Group is required"),
    officialEmail: Yup.string()
      .email("Invalid email address")
      .required("Official Email is required"),
    alternateEmail: Yup.string().email("Invalid alternate email address"),
    contactNumber: Yup.string()
      .matches(/^[0-9]+$/, "Contact Number must be numeric")
      .required("Contact Number is required"),
    alternateContactNumber: Yup.string().matches(
      /^[0-9]*$/,
      "Alternate Contact Number must be numeric"
    ),
    birthday: Yup.date()
      .required("Birthday is required")
      .max(new Date(maxDate), "You must be at least 18 years old")
      .min(new Date(minDate), "You must be at most 55 years old"),
    password: user_id
      ? Yup.string().min(8, "Password must be at least 8 characters long")
      : Yup.string()
          .min(8, "Password must be at least 8 characters long")
          .required("Password is required"),
    parent_id: user_id
      ? Yup.string()
      : Yup.string().required("Please assign the user to someone"),
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

    if (user_id) {
      if (!values.password) {
        delete payload.password;
      }
      payload = UtilFunctions.deleteKeys(payload, [
        "officialEmail",
        "bloodGroup",
        "role",
      ]);
    }

    const resp = isMyProfile
      ? await commonApis.me({ user_id, payload })
      : user_id
      ? await userApis.updateUserById({ user_id, payload })
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
              password: "",
              parent_id: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setValues }) => {
              useEffect(() => {
                if (user_id) {
                  const getUserData = async () => {
                    const resp = await userApis.getUserById({ user_id });
                    if (resp?.data) {
                      setValues({
                        ...resp.data,
                        birthday: resp?.data?.birthday?.split?.("T")[0] || "",
                        password: "",
                        parent_id: resp?.data?.parent_id || "",
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
                    disabled={loading}
                  />

                  <Input
                    id="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    disabled={loading}
                  />

                  <Input
                    id="bloodGroup"
                    label="Blood Group"
                    type="select"
                    options={BLOOD_GROUPS}
                    disabled={!!user_id || loading}
                  />

                  <Input
                    id="birthday"
                    label="Birthday"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    disabled={loading}
                  />

                  <Input
                    id="officialEmail"
                    label="Official Email"
                    placeholder="Enter your official email"
                    type="email"
                    disabled={!!user_id || loading}
                  />

                  <Input
                    id="alternateEmail"
                    label="Alternate Email (Optional)"
                    placeholder="Enter your alternate email"
                    type="email"
                    disabled={loading}
                  />

                  <Input
                    id="contactNumber"
                    label="Contact Number"
                    placeholder="Enter your contact number"
                    type="tel"
                    disabled={loading}
                  />

                  <Input
                    id="alternateContactNumber"
                    label="Alternate Contact Number (Optional)"
                    placeholder="Enter your alternate contact number"
                    type="tel"
                    disabled={loading}
                  />

                  {!isMyProfile && (
                    <Input
                      id="parent_id"
                      label="Assign To"
                      type="select"
                      options={usersList}
                      disabled={loading}
                    />
                  )}

                  {!isMyProfile && (
                    <Input
                      id="password"
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      disabled={loading}
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
