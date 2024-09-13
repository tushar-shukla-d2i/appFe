/**
 * Directory screen
 */

import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

import { userApis } from "../../apis";
import {
  Loader,
  NoRecordsFound,
  ScreenHeader,
  ScreenWrapper,
  UserCard,
} from "../../components";

const Directory = () => {
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
    setUsersList(resp);
    setLoading(false);
  };

  const filterUsers = () => {
    const lowercasedQuery = searchQuery?.toLowerCase();

    const fieldsToSearch = [
      "_id",
      "firstName",
      "lastName",
      "role",
      "bloodGroup",
      "officialEmail",
      "alternateEmail",
      "contactNumber",
      "alternateContactNumber",
      "birthday",
    ];

    const filtered = usersList?.filter?.((user) =>
      fieldsToSearch?.some?.((field) =>
        user?.[field]?.toString()?.toLowerCase()?.includes?.(lowercasedQuery)
      )
    );

    setFilteredUsers(filtered);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <ScreenHeader title="Directory" />

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

        {/* Team Members List */}
        {loading ? (
          <Loader />
        ) : filteredUsers?.length ? (
          <div className="mb-14 grid grid-cols-1 md:grid-cols-2">
            {filteredUsers.map((user) => (
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
