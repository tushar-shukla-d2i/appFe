/*
 * Add/Edit User
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { userApis } from "../../apis";
import { Button, Input, ScreenHeader } from "../../components";
import { BLOOD_GROUPS, USER_DATA } from "../../constants";
import { LocalStorageHelper } from "../../utils/HttpUtils";

// Helper function to calculate date range
const getDateFromYearsAgo = (years) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split("T")[0];
};

const minDate = getDateFromYearsAgo(55); // 55 years ago
const maxDate = getDateFromYearsAgo(18); // 18 years ago

const ManageUser = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};
  const isMyProfile = userData?._id === user_id;

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
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    let payload = { ...values };

    if (user_id && !values.password) {
      delete payload.password;
    }

    const resp = user_id
      ? await userApis.updateUserById({ user_id, payload })
      : await userApis.createUser(payload);
    setLoading(false);
    if (resp?.success) {
      if (isMyProfile) {
        LocalStorageHelper.store(USER_DATA, JSON.stringify(values));
      }
      alert(
        `${isMyProfile ? "Profile" : "User"} ${
          user_id ? "updated" : "added"
        } successfully!`
      );
      navigate(-1);
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader
        title={`${user_id ? "Edit" : "Add New"} ${
          isMyProfile ? "Profile" : "User"
        }`}
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
                    disabled={loading}
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
                    disabled={loading}
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

                  {/* Password */}
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
    </div>
  );
};

export { ManageUser };
