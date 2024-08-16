/**
 * Metrics listing screen
 */

import React, { useEffect, useState } from "react";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { MetricCard, ScreenHeader } from "../../components";

const metrics = [
  {
    id: 1,
    name: "Code Quality",
    subMetrics: ["Clean code", "UI designing", "Logical Handling"],
  },
  {
    id: 2,
    name: "Performance",
    subMetrics: ["Attendance", "Prompt Answering"],
  },
];

const Metrics = () => {
  const [metricsList, setMetricsList] = useState(metrics);

  useEffect(() => {
    getMetricsList();
  }, []);

  const getMetricsList = async () => {
    const resp = await metricsApis.getAllMetrics();
    if (resp?.success && resp?.data?.data?.length) {
      setMetricsList(resp?.data?.data);
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title="Metrics" />

      <MetricCard data={metricsList} route={AppRoutes.METRICS} />
    </div>
  );
};

export { Metrics };
