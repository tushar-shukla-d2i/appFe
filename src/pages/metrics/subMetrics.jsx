/**
 * Sub Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { Loader, MetricCard, ScreenHeader } from "../../components";

const SubMetrics = () => {
  const { metric_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parentMetricData, setParentMetricData] = useState([]);

  useEffect(() => {
    getSubMetricsList();
  }, []);

  const getSubMetricsList = async () => {
    setLoading(true);
    const resp = await metricsApis.getMetricById({ metric_id });
    if (resp?.success) {
      setParentMetricData(resp?.data?.data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <ScreenHeader title={parentMetricData?.label} />

      {loading ? (
        <Loader />
      ) : (
        <MetricCard
          data={parentMetricData?.sub_metrics}
          route={AppRoutes.SUBORDINATES}
        />
      )}
    </div>
  );
};

export { SubMetrics };
