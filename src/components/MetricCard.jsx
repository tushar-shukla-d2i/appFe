/**
 * Metric Card Component
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const MetricCard = ({ data, route }) => {
  const navigate = useNavigate();

  const handleMetricClick = (metric) => {
    navigate(`${route}/${metric.id}`);
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4 my-8">
      {data?.map?.((metric) => (
        <div
          key={metric.id}
          className="bg-gray-200 p-6 text-center text-sm font-semibold cursor-pointer"
          onClick={() => handleMetricClick(metric)}
        >
          {metric.name}
        </div>
      ))}
    </div>
  );
};

export { MetricCard };
