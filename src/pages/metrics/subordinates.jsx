/**
 * Subordinates and reward assigning screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { rewardsApis, userApis } from "../../apis";
import { ScreenHeader } from "../../components";

const Subordinates = () => {
  const navigate = useNavigate();
  const { metric_id } = useParams();
  const [comment, setComment] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [sliderValue, setSliderValue] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async () => {
    const resp = await userApis.getAllUsers();
    if (resp?.success) {
      setUsersList(resp?.data);
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
      // alert("OK");
    }
  };

  return (
    <div className="bg-white">
      <ScreenHeader title="Subordinates" />
      <div className="p-4 max-w-md mx-auto">
        <div className="mt-4">
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
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center mb-4">
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                {Array.from({ length: 21 }, (_, i) => -10 + i).map((value) => (
                  <span key={value} className="text-center flex-1">
                    {value}
                  </span>
                ))}
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                disabled={!selectedUser}
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <textarea
            className="w-full p-2 bg-gray-100"
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
