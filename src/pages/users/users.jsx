/**
 * Users listing screen
 */

import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

import { userApis } from "../../apis";
import { NoRecordsFound, ScreenHeader, UserCard } from "../../components";

const Users = () => {
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
    const resp = await userApis.getAllUsers();
    if (resp?.success) {
      setUsersList(resp?.data);
    }
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
    <div className="bg-white">
      {/* Top Bar */}
      <ScreenHeader title="Our Team" />

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
      {filteredUsers?.length ? (
        <div className="mb-14 grid grid-cols-1 md:grid-cols-2">
          {filteredUsers.map((user) => (
            <UserCard key={user._id} userData={user} />
          ))}
        </div>
      ) : (
        <NoRecordsFound />
      )}
    </div>
  );
};

export { Users };
