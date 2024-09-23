/**
 * Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import {
  Loader,
  MetricCard,
  ScreenHeader,
  ScreenWrapper,
} from "../../components";

const Metrics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metricsList, setMetricsList] = useState([]);

  useEffect(() => {
    getMetricsList();
  }, []);

  const getMetricsList = async () => {
    setLoading(true);
    const resp = await metricsApis.getAllMetrics();
    if (resp?.success && resp?.data?.data?.metrics?.length) {
      setMetricsList(resp?.data?.data?.metrics);
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    navigate(AppRoutes.ADD_EDIT_METRIC);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        <ScreenHeader title="Metrics" handleAddClick={handleAddClick} />

        {loading ? (
          <Loader />
        ) : (
          <MetricCard data={metricsList} route={AppRoutes.METRICS} />
        )}
      </div>
    </ScreenWrapper>
  );
};

export { Metrics };
