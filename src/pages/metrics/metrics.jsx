/**
 * Metrics listing screen
 */

import React, { useEffect, useState } from "react";
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

const Metrics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [metricsList, setMetricsList] = useState([]);
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
    getMetricsList(page, query);
  }, [location.search]);

  const getMetricsList = async (page, q) => {
    setLoading(true);
    const resp = await metricsApis.getAllMetrics({ page, q });
    setMetricsList(resp?.metrics || []);
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
    navigate(AppRoutes.ADD_EDIT_METRIC);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        <ScreenHeader
          title="Metrics"
          navigateBackURl={AppRoutes.DASHBOARD}
          handleAddClick={handleAddClick}
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
          <MetricCard data={metricsList} route={AppRoutes.METRICS} />
        )}
      </div>
    </ScreenWrapper>
  );
};

export { Metrics };
