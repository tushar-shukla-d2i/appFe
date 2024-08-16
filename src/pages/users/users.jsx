/**
 * Users listing screen
 */

import React, { useEffect, useState } from "react";

import { userApis } from "../../apis";
import { ScreenHeader, UserCard } from "../../components";

const Users = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async () => {
    const resp = await userApis.getAllUsers();
    if (resp?.success) {
      setUsersList(resp?.data);
    }
  };

  return (
    <div className="bg-white">
      {/* Top Bar */}
      <ScreenHeader title="Our Team" />

      {/* Team Members List */}
      <div className="my-14 grid grid-cols-1 md:grid-cols-2">
        {usersList?.map((user) => (
          <UserCard userData={user} />
        ))}
      </div>
    </div>
  );
};

export { Users };
