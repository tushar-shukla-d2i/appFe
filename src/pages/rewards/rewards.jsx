/**
 * Rewards listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { rewardsApis } from "../../apis";
import { formattedMDYDate } from "../../utils/CommonUtils";
import { LocalStorageHelper, useDebounce } from "../../utils";
import {
  AppRoutes,
  DEBOUNCE_DELAY,
  MAX_METRIC_POINTS,
  USER_DATA,
} from "../../constants";
import {
  Loader,
  NoRecordsFound,
  Pagination,
  ScreenHeader,
  ScreenWrapper,
  SearchInput,
} from "../../components";

const RewardItem = ({ reward }) => {
  const {
    _id,
    submittedByName,
    points,
    comment,
    date,
    metricName,
    metricParentName,
  } = reward ?? {};

  return (
    <div key={_id} className="mx-8 my-4 p-4 bg-gray-50 shadow rounded-lg">
      <div className="flex justify-between cursor-pointer">
        <span className="font-bold whitespace-pre">
          {`${metricParentName}  •  ${metricName}   >   ${points}/${MAX_METRIC_POINTS}`}
        </span>
        <div className="flex items-center">
          <span className="font-semibold text-sm mr-4">
            {formattedMDYDate(date)}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <p className="text-gray-600 text-sm font-semibold mt-1 mr-3">
          {comment}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <p className="text-gray-500 text-xs">By - {submittedByName}</p>
      </div>
    </div>
  );
};

const Rewards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [rewardsList, setRewardsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page")
      ? parseInt(queryParams.get("page"), 10)
      : 1;
    const query = queryParams.get("q") || "";
    setCurrentPage(page);
    setSearchQuery(query);
    getRewardsList(page, query);
  }, [location.search]);

  const getRewardsList = async (page, q) => {
    setLoading(true);
    const resp = await rewardsApis.getAllRewards({
      user_id: userData?._id,
      page,
      q,
    });
    setLoading(false);
    setRewardsList(resp?.rewards);
    setTotalPages(resp?.data?.totalPages || 1);
  };

  // Debounced search function
  const debouncedSearch = useDebounce((query) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", query);
    queryParams.set("page", 1);
    navigate({ search: queryParams.toString() });
  }, DEBOUNCE_DELAY);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handlePageChange = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate({ search: queryParams.toString() });
    setCurrentPage(page);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <ScreenHeader title="Rewards" navigateBackURl={AppRoutes.DASHBOARD} />

        {/* Search and Pagination */}
        <div className="flex items-center justify-between mx-10 mt-10 mb-6">
          <SearchInput searchQuery={searchQuery} handleSearch={handleSearch} />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>

        {/* Rewards List */}
        {loading ? (
          <Loader />
        ) : rewardsList?.length ? (
          rewardsList?.map?.((reward) => (
            <RewardItem key={reward?._id} reward={reward} />
          ))
        ) : (
          <NoRecordsFound />
        )}
      </div>
    </ScreenWrapper>
  );
};

export { Rewards };
