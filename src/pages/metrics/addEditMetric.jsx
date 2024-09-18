/**
 * Add Metric Screen
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { metricsApis } from "../../apis";
import { MAX_METRIC_POINTS } from "../../constants";
import {
  Button,
  Input,
  ScreenHeader,
  ScreenWrapper,
  Toast,
} from "../../components";

const AddEditMetric = () => {
  const { parent_id, metric_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialMetric, setInitialMetric] = useState({});
  const [parentMetricData, setParentMetricData] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    !!metric_id && fetchMetricDetails();
    !metric_id && !!parent_id && getSubMetricsList();
  }, [metric_id, parent_id]);

  const fetchMetricDetails = async () => {
    setLoading(true);
    const resp = await metricsApis.getMetricById({ metric_id });
    if (resp?.success) {
      setInitialMetric(resp?.data?.data);
    }
    setLoading(false);
  };

  const getSubMetricsList = async () => {
    const resp = await metricsApis.getMetricById({ metric_id: parent_id });
    if (resp?.success) {
      setParentMetricData(resp?.data?.data);
    }
  };

  const validationSchema = Yup.object().shape({
    label: Yup.string().required("Metric name is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    let payload = values;
    payload = { ...payload, maximum_points: MAX_METRIC_POINTS };
    if (!metric_id && parent_id) {
      payload = { ...payload, parent_id };
    }
    const resp = metric_id
      ? await metricsApis.updateMetric({ metric_id, payload })
      : await metricsApis.createMetric(payload);
    setLoading(false);
    if (resp?.success) {
      setToastMsg(`Metric ${metric_id ? "updated" : "created"} successfully!`);
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader
          title={
            metric_id
              ? "Edit Metric"
              : parent_id
              ? parentMetricData?.label
              : "Add Metric"
          }
          toastMsg={toastMsg}
        />

        <div className="w-[80%] mx-auto mt-16">
          <div className="space-y-8 p-6 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
            <Formik
              enableReinitialize
              initialValues={{
                label: initialMetric?.label || "",
                is_active: initialMetric?.is_active ?? true,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-8">
                  <Input
                    id="label"
                    label="Metric Name"
                    placeholder="Enter the metric name"
                    type="text"
                    disabled={loading}
                  />

                  <Input
                    id="is_active"
                    type="checkbox"
                    placeholder="Active"
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
    </ScreenWrapper>
  );
};

export { AddEditMetric };
