/**
 * Manage users listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdEditNote } from "react-icons/md";

import { userApis } from "../../apis";
import { useDebounce } from "../../utils";
import { AppRoutes } from "../../constants";
import { Config } from "../../utils/config";
import placeholderImg from "../../assets/placeholder.png";
import {
  Loader,
  NoRecordsFound,
  Pagination,
  ScreenHeader,
  ScreenWrapper,
  SearchInput,
} from "../../components";

const ManageUsers = () => {
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
    const resp = await userApis.getAllUsers({ page, q });
    setUsersList(resp?.users || []);
    setTotalPages(resp?.data?.totalPages || 1);
    setLoading(false);
  };

  // Debounced search function
  const debouncedSearch = useDebounce((query) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", query);
    queryParams.set("page", 1);
    navigate({ search: queryParams.toString() });
  }, 500);

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
    navigate(AppRoutes.USER);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <ScreenHeader title="Manage Users" handleAddClick={handleAddClick} />

        <div className="flex items-center justify-between mx-10 mt-10 mb-6">
          <SearchInput searchQuery={searchQuery} handleSearch={handleSearch} />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>

        {/* Team Members List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <Loader />
          ) : usersList?.length ? (
            <ul className="mx-7 sm:mx-10 my-4 space-y-2">
              {usersList?.map?.((user) => {
                const { _id, firstName, lastName, officialEmail, userProfile } =
                  user ?? {};
                return (
                  <li
                    key={_id}
                    className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <img
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                        src={
                          userProfile
                            ? `${Config.DEV.IMAGE_BASE_URL}${userProfile}`
                            : placeholderImg
                        }
                        alt={`${firstName || "user"} image`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium truncate">{`${
                          firstName || ""
                        } ${lastName || ""}`}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {officialEmail}
                        </p>
                      </div>
                    </div>
                    <button
                      className="cursor-pointer p-2 ml-4"
                      onClick={() => navigate(`${AppRoutes.USER}/${_id}`)}
                    >
                      <MdEditNote className="text-2xl sm:text-3xl text-gray-500" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <NoRecordsFound />
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
};

export { ManageUsers };
