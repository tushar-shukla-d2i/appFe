/**
 * Users listing screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { userApis } from "../../apis";
import { UserCard } from "../../components";

const Users = () => {
  const navigate = useNavigate();
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

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between shadow-lg">
        <button onClick={handleBackClick} className="text-xl">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">Our Team</h1>
        <div></div> {/* Empty div for spacing */}
      </div>

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
