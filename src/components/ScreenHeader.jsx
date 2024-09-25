/**
 * Screen Header Component
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

import { USER_DATA, USER_ROLES } from "../constants";
import { LocalStorageHelper } from "../utils/HttpUtils";

const ScreenHeader = ({ title, navigateBackURl, handleAddClick }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const { role } = userData ?? {};

  const handleBackClick = () => {
    navigate(navigateBackURl || -1);
  };

  return (
    <div className="p-4 flex items-center justify-between shadow-lg">
      <button onClick={handleBackClick} className="text-xl">
        <FaArrowLeft />
      </button>
      <h1 className="text-lg font-semibold">{title || ""}</h1>
      {role === USER_ROLES.ADMIN && !!handleAddClick ? (
        <button onClick={handleAddClick} className="text-2xl">
          <FiPlusCircle />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export { ScreenHeader };
