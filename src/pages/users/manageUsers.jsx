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
      setUsersList(resp?.data?.data);
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

  const handleAddClick = () => {
    navigate(AppRoutes.USER);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Bar */}
      <ScreenHeader title="Manage Users" handleAddClick={handleAddClick} />

      <div className="relative mx-11 mt-10 mb-5">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-500 rounded-lg w-full"
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
