/*
 * Change Password Screen
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { commonApis } from "../../apis";

const ChangePassword = () => {
  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    const resp = await commonApis.me({ password: values?.password });

    if (resp?.success) {
      alert("Password updated successfully!");
      navigate(-1);
    }
  };

  return (
    <section className="bg-gray-100 flex justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg h-[40%] shadow-lg border border-gray-300">
        <div className="space-y-8 p-8">
          <div className="flex items-center mb-8">
            <button onClick={handleBackClick} className="text-xl mr-3">
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Change Password
            </h1>
          </div>

          <Formik
            enableReinitialize
            initialValues={{ password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => {
              return (
                <Form className="space-y-8">
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
                    Submit
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

export { ChangePassword };
