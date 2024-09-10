/*
 * Change Password Screen
 */

import React, { useState } from "react";
import { useParams } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { commonApis } from "../../apis";
import { Button, Input, ScreenHeader, Toast } from "../../components";

const ChangePassword = () => {
  const { user_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Validation Schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirmation Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const resp = await commonApis.me({
      user_id,
      payload: { password: values.password },
    });
    setLoading(false);
    if (resp?.success) {
      setToastMsg("Password updated successfully!");
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title="Change Password" />

      <div className="w-[60%] mx-auto mt-20">
        <div className="space-y-8 p-8 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
          <Formik
            enableReinitialize
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">
                <Input
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  disabled={loading}
                />

                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  disabled={loading}
                />

                <Button loading={loading || isSubmitting} title="Submit" />
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Toast message={toastMsg} />
    </div>
  );
};

export { ChangePassword };
