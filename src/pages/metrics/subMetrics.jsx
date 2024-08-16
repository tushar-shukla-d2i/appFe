/**
 * Sub Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { MetricCard, ScreenHeader } from "../../components";

const subMetrics = [
  {
    id: 1,
    name: "Clean code",
  },
  {
    id: 2,
    name: "UI designing",
  },
  {
    id: 3,
    name: "Logical Handling",
  },
];

const SubMetrics = () => {
  const { metric_id } = useParams();
  const [subMetricsList, setSubMetricsList] = useState(subMetrics);

  useEffect(() => {
    getSubMetricsList();
  }, []);

  const getSubMetricsList = async () => {
    const resp = await metricsApis.getMetricById({ metric_id });
    if (
      resp?.success &&
      Array.isArray(resp?.data?.data) &&
      resp?.data?.data?.length
    ) {
      setSubMetricsList(resp?.data?.data);
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title="Sub Metrics" />
      <MetricCard data={subMetricsList} route={AppRoutes.SUBORDINATES} />
    </div>
  );
};

export { SubMetrics };
