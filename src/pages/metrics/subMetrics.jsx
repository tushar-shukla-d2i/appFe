/**
 * Sub Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";

import { metricsApis } from "../../apis";
import { AppRoutes } from "../../constants";
import {
  Loader,
  MetricCard,
  ScreenHeader,
  ScreenWrapper,
} from "../../components";

const SubMetrics = () => {
  const navigate = useNavigate();
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

  const handleAddClick = () => {
    navigate(`${AppRoutes.ADD_EDIT_METRIC}/${metric_id}`);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        <ScreenHeader
          title={parentMetricData?.parentMetric?.label}
          handleAddClick={handleAddClick}
        />

        {loading ? (
          <Loader />
        ) : (
          <MetricCard
            data={parentMetricData?.sub_metrics}
            route={AppRoutes.SUBORDINATES}
          />
        )}
      </div>
    </ScreenWrapper>
  );
};

export { SubMetrics };
