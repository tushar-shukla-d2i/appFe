/*
 * Login page
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { authApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { emailRegex } from "../../utils/CommonUtils";
import { ErrorComponent } from "../../components";

const validationSchema = {
  officialEmail: Yup.string()
    .matches(emailRegex, "Invalid email")
    .required("Official Email is required"),
  password: Yup.string()
    .min(8, "Password must have at least 8 characters")
    .required("Password is required"),
};

const Login = () => {
  const navigate = useNavigate();

  // Formik initialization
  const formik = useFormik({
    initialValues: { officialEmail: "", password: "" },
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (values) => {
      const response = await authApis.login(values);
      if (response.success) {
        navigate(AppRoutes.DASHBOARD);
      }
    },
  });

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            {/* <ErrorComponent error="Invalid email or password" /> */}

            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              {/* Official Email */}
              <div>
                <label
                  htmlFor="officialEmail"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Official Email
                </label>
                <input
                  type="email"
                  name="officialEmail"
                  id="officialEmail"
                  value={formik.values.officialEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter your official email"
                />
                {formik.touched.officialEmail && formik.errors.officialEmail ? (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.officialEmail}
                  </div>
                ) : null}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <a
                  href={AppRoutes.SIGNUP}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { Login };
