/**
 * Subordinates and reward assigning screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { metricsApis, rewardsApis, userApis } from "../../apis";
import { ScreenHeader } from "../../components";

const minimum_points = -10;
const maximum_points = 10;

const Subordinates = () => {
  const navigate = useNavigate();
  const { metric_id } = useParams();
  const [metricData, setMetricData] = useState(null);
  const [comment, setComment] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [sliderValue, setSliderValue] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const { label } = metricData ?? {};

  useEffect(() => {
    getUsersList();
    getMetricData();
  }, []);

  const getUsersList = async () => {
    const resp = await userApis.getAllUsers();
    if (resp?.success) {
      setUsersList(resp?.data);
    }
  };

  const getMetricData = async () => {
    const resp = await metricsApis.getMetricById({ metric_id });
    if (resp?.success) {
      setMetricData(resp?.data?.data);
    }
  };

  const onSubmitFeedback = async () => {
    const payload = {
      metric_id,
      user_id: selectedUser,
      points: sliderValue,
      comment,
    };
    const response = await rewardsApis.assignReward(payload);
    console.log(response, "response");

    if (response.success) {
      alert("Reward assigned successfully!");
      navigate(-1);
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title={label} />

      <div className="p-6 w-[80%] mx-auto mt-8 shadow-lg rounded-lg">
        <select
          className="w-full p-2 bg-gray-200 rounded"
          onChange={(e) => setSelectedUser(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select User
          </option>
          {usersList?.map((user, index) => {
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
              disabled={!selectedUser}
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              className="w-full"
            />
          </div>
          <textarea
            className="w-full p-2 bg-gray-100 border-2"
            placeholder="Comment"
            disabled={!selectedUser}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!selectedUser}
            className="w-full bg-blue-500 disabled:bg-slate-400 text-white p-2"
            onClick={onSubmitFeedback}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export { Subordinates };
