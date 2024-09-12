/*
 * Login page
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { authApis } from "../../apis";
import { emailRegex } from "../../utils/CommonUtils";
import { AppRoutes, USER_DATA } from "../../constants";
import { Button, ErrorComponent } from "../../components";
import { LocalStorageHelper } from "../../utils/HttpUtils";

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
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?._id) {
      navigate(AppRoutes.DASHBOARD);
    }
  }, []);

  // Formik initialization
  const formik = useFormik({
    initialValues: { officialEmail: "", password: "" },
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      const resp = await authApis.login(values);
      setLoading(false);
      if (resp?.success) {
        navigate(AppRoutes.DASHBOARD);
      } else if (resp?.errors) {
        setApiError(resp?.errors?.global);
      }
    },
  });

  return (
    <>
      <section className="bg-gray-100 h-screen flex justify-center items-center">
        <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-lg border border-gray-300">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl">
              Sign in to your account
            </h1>

            {!!apiError && <ErrorComponent error={apiError} />}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              {/* Official Email */}
              <div>
                <label
                  htmlFor="officialEmail"
                  className="block mb-2 text-sm font-medium text-gray-700"
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
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter your official email"
                  disabled={loading}
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
                  className="block mb-2 text-sm font-medium text-gray-700"
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
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>

              <Button loading={loading} title="Sign in" />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export { Login };
