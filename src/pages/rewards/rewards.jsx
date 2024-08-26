/**
 * Rewards listing screen
 */

import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { rewardsApis } from "../../apis";
import { formattedMDYDate } from "../../utils/CommonUtils";
import { NoRecordsFound, ScreenHeader } from "../../components";

const rewardsData = [
  {
    _id: 1,
    name: "John Doe",
    rate: 8,
    comment: "Great job on the project!",
    date: "2024-08-01",
  },
  {
    _id: 2,
    name: "Jane Smith",
    rate: 9,
    comment: "Excellent work on the last sprint.",
    date: "2024-08-15",
  },
];

const RewardItem = ({ reward }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { _id, name, rate, comment, date } = reward ?? {};

  return (
    <div key={_id} className="m-8 p-4 bg-gray-50 shadow-lg rounded-lg">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold text-lg">{name}</span>
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
          <p className="text-gray-600 font-semibold">Rate: {rate}/10</p>
          <p className="text-gray-600 font-semibold mt-1">{comment}</p>
        </div>
      )}
    </div>
  );
};

const Rewards = () => {
  const [rewardsList, setRewardsList] = useState(rewardsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRewards, setFilteredRewards] = useState(rewardsData);

  useEffect(() => {
    // getRewardsList();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [rewardsList, searchQuery]);

  const getRewardsList = async () => {
    const resp = await rewardsApis.getAllRewards();
    if (resp?.success) {
      setRewardsList(resp?.data);
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
    <div className="bg-white">
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
      {filteredRewards?.length ? (
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
