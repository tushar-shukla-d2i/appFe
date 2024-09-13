/*
 * Change Password Screen
 */

import React, { useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { AppRoutes } from "../../constants";
import { authApis, commonApis } from "../../apis";
import {
  Button,
  ErrorComponent,
  Input,
  ScreenHeader,
  ScreenWrapper,
  Toast,
} from "../../components";

const ChangePassword = () => {
  const { user_id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const inviteCode = searchParams.get("inviteCode");

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
    setApiError("");
    const resp = inviteCode
      ? await authApis.resetPassword({ inviteCode, password: values.password })
      : await commonApis.me({
          user_id,
          payload: { password: values.password },
        });
    setLoading(false);
    if (resp?.success) {
      setToastMsg("Password updated successfully!");
    } else if (resp?.errors) {
      setApiError(resp?.errors?.global);
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        {!inviteCode && <ScreenHeader title="Change Password" />}

        <div className="w-[80%] mx-auto mt-16">
          <div className="space-y-8 p-6 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
            {!!apiError && <ErrorComponent error={apiError} />}

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

        <Toast
          message={toastMsg}
          {...(inviteCode && { navigateUrl: AppRoutes.DASHBOARD })}
        />
      </div>
    </ScreenWrapper>
  );
};

export { ChangePassword };
