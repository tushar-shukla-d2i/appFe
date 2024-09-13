/**
 * Subordinates and reward assigning screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { MAX_METRIC_POINTS } from "../../constants";
import { metricsApis, rewardsApis, subordinatesApis } from "../../apis";
import { Button, ScreenHeader, ScreenWrapper, Toast } from "../../components";

const minimum_points = -10;

const Subordinates = () => {
  const { metric_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [parentMetricData, setParentMetricData] = useState([]);
  const [metricData, setMetricData] = useState(null);
  const [comment, setComment] = useState("");
  const [subordinatesList, setSubordinatesList] = useState([]);
  const [sliderValue, setSliderValue] = useState(MAX_METRIC_POINTS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const { label, maximum_points } = metricData ?? {};

  useEffect(() => {
    getSubordinatesList();
    getMetricData();
  }, []);

  const getSubordinatesList = async () => {
    const resp = await subordinatesApis.getSubordinates();
    setSubordinatesList(resp);
  };

  const getMetricData = async () => {
    const resp = await metricsApis.getMetricById({ metric_id });
    if (resp?.success) {
      setMetricData(resp?.data?.data);
      getParentMetricData(resp?.data?.data?.parent_id);
    }
  };

  const getParentMetricData = async (parent_id) => {
    const resp = await metricsApis.getMetricById({ metric_id: parent_id });
    if (resp?.success) {
      setParentMetricData(resp?.data?.data);
    }
  };

  const onSubmitFeedback = async () => {
    setLoading(true);
    const payload = {
      metric_id,
      user_id: selectedUser,
      points: sliderValue,
      comment,
    };
    const response = await rewardsApis.assignReward(payload);
    setLoading(false);
    if (response.success) {
      setToastMsg("Reward assigned successfully!");
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader
          title={
            <>
              {parentMetricData?.label}
              <span className="mx-3"> &gt; </span>
              {label}
            </>
          }
          toastMsg={toastMsg}
        />
        <div className="p-6 w-[85%] mx-auto mt-8 shadow-lg rounded-lg">
          <select
            className="w-full p-2 bg-gray-200 rounded"
            onChange={(e) => setSelectedUser(e.target.value)}
            defaultValue=""
            disabled={loading}
          >
            <option value="" disabled>
              Select User
            </option>
            {subordinatesList?.map?.((user, index) => {
              const { _id, firstName, lastName } = user ?? {};
              return (
                <option key={index} value={_id}>
                  {`${firstName || ""} ${lastName || ""}`}
                </option>
              );
            })}
          </select>

          <div className="mt-12 space-y-6">
            <div className="w-full items-center mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                {Array.from(
                  { length: Math.abs(minimum_points) + 1 + maximum_points },
                  (_, i) => minimum_points + i
                ).map((value) => (
                  <span key={value} className="text-center flex-1">
                    {value}
                  </span>
                ))}
              </div>
              <input
                type="range"
                min={minimum_points}
                max={maximum_points}
                disabled={!selectedUser || loading}
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                className="w-full"
              />
            </div>
            <textarea
              className="w-full p-2 bg-gray-100 border-2"
              placeholder="Comment"
              disabled={!selectedUser || loading}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button
              title="Save"
              disabled={!selectedUser || loading}
              loading={loading}
              onClick={onSubmitFeedback}
            />
          </div>
        </div>

        <Toast message={toastMsg} />
      </div>
    </ScreenWrapper>
  );
};

export { Subordinates };
