/*
 * Signup page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { authApis } from "../../apis";
import { AppRoutes, BLOOD_GROUPS } from "../../constants";
import { Button, ErrorComponent } from "../../components";

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
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setApiError("");
    setLoading(true);
    let payload = values;
    !values?.alternateEmail && delete payload["alternateEmail"];
    !values?.alternateContactNumber && delete payload["alternateContactNumber"];
    const resp = await authApis.signup(payload);
    setLoading(false);
    if (resp?.success) {
      navigate(AppRoutes.DASHBOARD);
    } else if (resp?.errors) {
      setApiError(resp?.errors?.global);
    }
  };

  return (
    <section className="bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Create Account
          </h1>

          {!!apiError && <ErrorComponent error={apiError} />}

          <Formik
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
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-6">
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                      e.target.value = e.target.value?.replace?.(/[^0-9]/g, "");
                    }}
                    disabled={loading}
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
                      e.target.value = e.target.value?.replace?.(/[^0-9]/g, "");
                    }}
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-2"
                  />
                </div>

                {/* Submit Button */}
                <Button loading={loading} title="Create Account" />
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <a
                href={AppRoutes.LOGIN}
                className="font-medium text-blue-600 hover:underline"
                style={loading ? { pointerEvents: "none" } : {}}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup };
