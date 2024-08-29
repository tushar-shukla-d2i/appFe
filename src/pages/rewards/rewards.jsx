/**
 * Rewards listing screen
 */

import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { rewardsApis } from "../../apis";
import { USER_DATA } from "../../constants";
import { formattedMDYDate } from "../../utils/CommonUtils";
import { LocalStorageHelper } from "../../utils/HttpUtils";
import { Loader, NoRecordsFound, ScreenHeader } from "../../components";

const RewardItem = ({ reward }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { _id, submittedByName, points, comment, date } = reward ?? {};

  return (
    <div key={_id} className="mx-8 my-4 p-4 bg-gray-50 shadow rounded-lg">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold">{submittedByName}</span>
        <div className="flex items-center">
          <span className="font-semibold text-sm mr-4">
            {formattedMDYDate(date)}
          </span>
          {isExpanded ? (
            <FiChevronUp className="text-black text-xl" />
          ) : (
            <FiChevronDown className="text-black text-xl" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2">
          <p className="text-gray-600 text-sm font-semibold">
            Rate: {points}/10
          </p>
          <p className="text-gray-600 text-sm font-semibold mt-1">{comment}</p>
        </div>
      )}
    </div>
  );
};

const Rewards = () => {
  const [loading, setLoading] = useState(false);
  const [rewardsList, setRewardsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRewards, setFilteredRewards] = useState([]);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};

  useEffect(() => {
    getRewardsList();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [rewardsList, searchQuery]);

  const getRewardsList = async () => {
    setLoading(true);
    const resp = await rewardsApis.getAllRewards({ user_id: userData?._id });
    setLoading(false);
    if (resp?.success) {
      setRewardsList(resp?.data?.data);
    }
  };

  const filterRewards = () => {
    const lowercasedQuery = searchQuery?.toLowerCase();

    const fieldsToSearch = ["_id", "name", "rate", "comment", "date"];

    const filtered = rewardsList?.filter?.((reward) =>
      fieldsToSearch?.some?.((field) =>
        reward?.[field]?.toString()?.toLowerCase()?.includes?.(lowercasedQuery)
      )
    );

    setFilteredRewards(filtered);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Bar */}
      <ScreenHeader title="Rewards" />

      {/* Search Input */}
      <div className="mt-10 mb-6 mx-10 relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-500 rounded w-full pr-10"
        />
        <div className="absolute top-3 right-2">
          {searchQuery ? (
            <FaTimes
              className="cursor-pointer text-gray-500"
              onClick={() => setSearchQuery("")}
            />
          ) : (
            <FaSearch className="text-gray-500" />
          )}
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : filteredRewards?.length ? (
        filteredRewards?.map?.((reward, index) => (
          <RewardItem key={index} reward={reward} />
        ))
      ) : (
        <NoRecordsFound />
      )}
    </div>
  );
};

export { Rewards };
