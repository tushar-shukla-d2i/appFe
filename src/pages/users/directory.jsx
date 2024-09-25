/**
 * Directory screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { userApis } from "../../apis";
import { useDebounce } from "../../utils";
import { DEBOUNCE_DELAY } from "../../constants";
import {
  Loader,
  NoRecordsFound,
  Pagination,
  ScreenHeader,
  ScreenWrapper,
  SearchInput,
  UserCard,
} from "../../components";

const Directory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
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
    getUsersList(page, query);
  }, [location.search]);

  const getUsersList = async (page, q) => {
    setLoading(true);
    const resp = await userApis.getAllUsers({ includeSelf: true, page, q });
    setUsersList(resp?.users || []);
    setTotalPages(resp?.data?.totalPages || 1);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate({ search: queryParams.toString() });
    setCurrentPage(page);
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

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <ScreenHeader title="Directory" />

        {/* Search Input */}
        <div className="flex items-center justify-between mx-10 mt-10 mb-6">
          <SearchInput searchQuery={searchQuery} handleSearch={handleSearch} />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>

        {/* Team Members List */}
        {loading ? (
          <Loader />
        ) : usersList?.length ? (
          <div className="mb-14 grid grid-cols-1 md:grid-cols-2">
            {usersList?.map?.((user) => (
              <UserCard key={user._id} userData={user} />
            ))}
          </div>
        ) : (
          <NoRecordsFound />
        )}
      </div>
    </ScreenWrapper>
  );
};

export { Directory };
