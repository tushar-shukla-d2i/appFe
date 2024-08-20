import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userApis } from "../../apis";
import { USER_DATA, AppRoutes } from "../../constants";
import { LocalStorageHelper } from "../../utils/HttpUtils";

// Helper function to calculate date range
const getDateFromYearsAgo = (years) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split("T")[0];
};

const minDate = getDateFromYearsAgo(55); // 55 years ago
const maxDate = getDateFromYearsAgo(18); // 18 years ago

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
});

const bloodGroupOptions = [
  { value: "", label: "Select your blood group" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const EditUser = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    const response = await userApis.updateUserById({
      user_id: userData?.userId,
      payload: values,
    });
    if (response.success) {
      LocalStorageHelper.store(USER_DATA, JSON.stringify(values));
      alert("Profile updated successfully!");
      navigate(AppRoutes.DASHBOARD);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex items-center">
            <button
              onClick={handleBackClick}
              className="text-xl text-white mr-3"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Edit Profile
            </h1>
          </div>

          <Formik
            initialValues={{
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              bloodGroup: userData.bloodGroup || "",
              officialEmail: userData.officialEmail || "",
              alternateEmail: userData.alternateEmail || "",
              contactNumber: userData.contactNumber || "",
              alternateContactNumber: userData.alternateContactNumber || "",
              birthday: userData.birthday || "",
              password: userData.password || "", // You may want to handle passwords differently, e.g., not pre-populating
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Blood Group
                  </label>
                  <Field
                    as="select"
                    name="bloodGroup"
                    id="bloodGroup"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    {bloodGroupOptions.map((option) => (
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Birthday
                  </label>
                  <Field
                    type="date"
                    name="birthday"
                    id="birthday"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Official Email
                  </label>
                  <Field
                    type="email"
                    name="officialEmail"
                    id="officialEmail"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Alternate Email (Optional)
                  </label>
                  <Field
                    type="email"
                    name="alternateEmail"
                    id="alternateEmail"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    name="contactNumber"
                    id="contactNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter your contact number"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Alternate Contact Number (Optional)
                  </label>
                  <Field
                    type="text"
                    name="alternateContactNumber"
                    id="alternateContactNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter your alternate contact number"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-2"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export { EditUser };
