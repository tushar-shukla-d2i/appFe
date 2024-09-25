/**
 * Sub Metrics listing screen
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";

import { metricsApis } from "../../apis";
import { useDebounce } from "../../utils";
import { AppRoutes, DEBOUNCE_DELAY } from "../../constants";
import {
  Loader,
  MetricCard,
  Pagination,
  ScreenHeader,
  ScreenWrapper,
  SearchInput,
} from "../../components";

const SubMetrics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { metric_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parentMetricData, setParentMetricData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page")
      ? parseInt(queryParams.get("page"), 10)
      : 1;
    const query = queryParams.get("q") || "";
    setCurrentPage(page);
    setSearchQuery(query);
    getSubMetricsList(page, query);
  }, [location.search]);

  const getSubMetricsList = async (page, q) => {
    setLoading(true);
    const resp = await metricsApis.getAllMetrics({
      metric_id,
      page,
      q,
    });
    setParentMetricData(resp?.data);
    setTotalPages(resp?.data?.totalPages || 1);
    setLoading(false);
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

  const handleAddClick = () => {
    navigate(`${AppRoutes.ADD_EDIT_METRIC}/${metric_id}`);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        <ScreenHeader
          title={parentMetricData?.parentMetric?.label}
          handleAddClick={handleAddClick}
          navigateBackURl={AppRoutes.DASHBOARD}
        />

        <div className="flex items-center justify-between mx-10 mt-10 mb-6">
          <SearchInput searchQuery={searchQuery} handleSearch={handleSearch} />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>

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
