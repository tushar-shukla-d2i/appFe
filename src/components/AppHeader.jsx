/**
 * App Header Component
 */

import React from "react";
import { useNavigate } from "react-router-dom";

import d2iLogo from "../assets/d2i_logo.jpg";
import { AppRoutes, USER_DATA } from "../constants";
import { LocalStorageHelper } from "../utils/HttpUtils";

const AppHeader = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA)) || {};

  return (
    <header className="bg-[#0375a7] text-white py-4">
      <div className="flex items-center justify-center">
        <img
          src={d2iLogo}
          alt="logo"
          className="rounded-full h-14 w-14 mr-4 hover:cursor-pointer"
          onClick={() => userData?._id && navigate(AppRoutes.DASHBOARD)}
        />
        <h1 className="text-sm font-bold tracking-wider	">
          Innovating Tomorrow, Today
        </h1>
      </div>
    </header>
  );
};

export { AppHeader };
