/*
 * Add/Edit User
 */

import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userApis } from "../../apis";
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

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    let payload = { ...values };

    if (user_id && !values.password) {
      delete payload.password;
    }

    const resp = user_id
      ? await userApis.updateUserById({ user_id, payload })
      : await userApis.createUser(payload);

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
    <section className="bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex items-center mb-8">
            <button onClick={handleBackClick} className="text-xl mr-3">
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {user_id ? "Edit" : "Add New"} {isMyProfile ? "Profile" : "User"}
            </h1>
          </div>

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
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Blood Group
                    </label>
                    <Field
                      as="select"
                      name="bloodGroup"
                      id="bloodGroup"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      {BLOOD_GROUPS?.map?.((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="bloodGroup"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label
                      htmlFor="birthday"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Birthday
                    </label>
                    <Field
                      type="date"
                      name="birthday"
                      id="birthday"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      min={minDate}
                      max={maxDate}
                    />
                    <ErrorMessage
                      name="birthday"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Official Email */}
                  <div>
                    <label
                      htmlFor="officialEmail"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Official Email
                    </label>
                    <Field
                      type="email"
                      name="officialEmail"
                      id="officialEmail"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your official email"
                    />
                    <ErrorMessage
                      name="officialEmail"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Alternate Email */}
                  <div>
                    <label
                      htmlFor="alternateEmail"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Alternate Email (Optional)
                    </label>
                    <Field
                      type="email"
                      name="alternateEmail"
                      id="alternateEmail"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your alternate email"
                    />
                    <ErrorMessage
                      name="alternateEmail"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    <Field
                      type="tel"
                      name="contactNumber"
                      id="contactNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your contact number"
                      maxLength={10}
                      pattern="[0-9]*"
                      onInput={(e) => {
                        e.target.value = e.target.value?.replace?.(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                    />
                    <ErrorMessage
                      name="contactNumber"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Alternate Contact Number */}
                  <div>
                    <label
                      htmlFor="alternateContactNumber"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Alternate Contact Number (Optional)
                    </label>
                    <Field
                      type="tel"
                      name="alternateContactNumber"
                      id="alternateContactNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your alternate contact number"
                      maxLength={10}
                      pattern="[0-9]*"
                      onInput={(e) => {
                        e.target.value = e.target.value?.replace?.(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                    />
                    <ErrorMessage
                      name="alternateContactNumber"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={isSubmitting}
                  >
                    {user_id ? "Update" : "Add"} User
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export { ManageUser };
