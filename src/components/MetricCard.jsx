/**
 * Metric Card Component
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";

import { NoRecordsFound } from "./NoRecordsFound";
import { LocalStorageHelper } from "../utils/HttpUtils";
import { AppRoutes, USER_DATA, USER_ROLES } from "../constants";

const MetricCard = ({ data, route }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const isAdmin = userData?.role === USER_ROLES.ADMIN;

  const handleMetricClick = (metric) => {
    navigate(`${route}/${metric._id}`);
  };

  const toggleMenu = (e, metricId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === metricId ? null : metricId);
  };

  const handleEditClick = (metric) => {
    const { parent_id, _id } = metric ?? {};
    navigate(`${AppRoutes.ADD_EDIT_METRIC}/${parent_id}/${_id}`);
  };

  const getMenuItems = (metric) => {
    const items = [
      {
        label: "Edit",
        onClick: (e) => {
          e.stopPropagation();
          handleEditClick(metric);
        },
      },
    ];
    return items;
  };

  return data?.length ? (
    <div className="p-4 grid grid-cols-3 gap-4 my-8">
      {data?.map?.((metric) => (
        <div
          key={metric._id}
          className="relative bg-gray-200 p-6 text-center text-sm"
          onClick={() => handleMetricClick(metric)}
        >
          {isAdmin && (
            <div
              className="absolute top-2 right-2"
              onClick={(e) => toggleMenu(e, metric._id)}
            >
              <FiMoreVertical className="text-lg cursor-pointer" />
            </div>
          )}

          {activeMenu === metric._id && (
            <div className="absolute right-3 top-6 bg-white border rounded shadow-md z-10">
              {getMenuItems(metric)?.map((item, index, arr) => (
                <React.Fragment key={index}>
                  <div
                    className="px-2.5 py-1 cursor-pointer hover:bg-gray-100"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </div>
                  {index < arr?.length - 1 && (
                    <div className="h-px bg-gray-200" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="font-semibold">{metric?.label || ""}</div>
        </div>
      ))}
    </div>
  ) : (
    <NoRecordsFound />
  );
};

export { MetricCard };
