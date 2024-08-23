/**
 * Sub Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { MetricCard, ScreenHeader } from "../../components";

const SubMetrics = () => {
  const { metric_id } = useParams();
  const [parentMetricData, setParentMetricData] = useState([]);

  useEffect(() => {
    getSubMetricsList();
  }, []);

  const getSubMetricsList = async () => {
    const resp = await metricsApis.getMetricById({ metric_id });
    if (resp?.success) {
      setParentMetricData(resp?.data?.data);
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title={parentMetricData?.label} />

      <MetricCard
        data={parentMetricData?.sub_metrics}
        route={AppRoutes.SUBORDINATES}
      />
    </div>
  );
};

export { SubMetrics };
