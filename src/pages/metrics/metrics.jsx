/**
 * Metrics listing screen
 */

import React, { useEffect, useState } from "react";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import { Loader, MetricCard, ScreenHeader } from "../../components";

const Metrics = () => {
  const [loading, setLoading] = useState(true);
  const [metricsList, setMetricsList] = useState([]);

  useEffect(() => {
    getMetricsList();
  }, []);

  const getMetricsList = async () => {
    setLoading(true);
    const resp = await metricsApis.getAllMetrics();
    if (resp?.success && resp?.data?.data?.length) {
      setMetricsList(resp?.data?.data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <ScreenHeader title="Metrics" />

      {loading ? (
        <Loader />
      ) : (
        <MetricCard data={metricsList} route={AppRoutes.METRICS} />
      )}
    </div>
  );
};

export { Metrics };
