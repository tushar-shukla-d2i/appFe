/**
 * Manage users listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { MdEditNote } from "react-icons/md";
import { FaSearch, FaTimes } from "react-icons/fa";

import { userApis } from "../../apis";
import { AppRoutes } from "../../constants";
import d2iLogo from "../../assets/d2i_logo.jpg";
import { Loader, NoRecordsFound, ScreenHeader } from "../../components";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [usersList, searchQuery]);

  const getUsersList = async () => {
    setLoading(true);
    const resp = await userApis.getAllUsers();
    if (resp?.success) {
      setUsersList(resp?.data);
    }
    setLoading(false);
  };

  const filterUsers = () => {
    const lowercasedQuery = searchQuery?.toLowerCase();

    const fieldsToSearch = ["_id", "firstName", "lastName", "officialEmail"];

    const filtered = usersList?.filter?.((user) =>
      fieldsToSearch?.some?.((field) =>
        user?.[field]?.toString()?.toLowerCase()?.includes?.(lowercasedQuery)
      )
    );

    setFilteredUsers(filtered);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Bar */}
      <ScreenHeader title="Manage Users" />

      {/* Search Input */}
      <div className="mt-10 mb-6 mx-10 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-500 rounded-lg"
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
        <button
          type="button"
          className="text-white bg-[#0375a7] hover:bg-[#22617b] font-medium rounded-lg text-sm p-3 text-center inline-flex items-center me-2"
          onClick={() => navigate(AppRoutes.USER)}
        >
          <FaPlus className="text-xl mr-2 font-bold" />
          Add New User
        </button>
      </div>

      {/* Team Members List */}

      {loading ? (
        <Loader />
      ) : filteredUsers?.length ? (
        <ul className="mx-10 my-4">
          {filteredUsers.map((user) => {
            const { _id, firstName, lastName, officialEmail } = user ?? {};
            return (
              <li
                key={_id}
                className="items-center px-3 border-2 border-gray-200 bg-gray-50 mb-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-16 h-w-16 rounded-full"
                      src={d2iLogo}
                      alt={`${firstName || "user"} image`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{`${
                      firstName || ""
                    } ${lastName || ""}`}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {officialEmail}
                    </p>
                  </div>
                  <button
                    className="cursor-pointer"
                    onClick={() => navigate(`${AppRoutes.USER}/${_id}`)}
                  >
                    <MdEditNote className="text-3xl text-gray-500" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <NoRecordsFound />
      )}
    </div>
  );
};

export { ManageUsers };
