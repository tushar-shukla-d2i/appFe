/**
 * Dashboard screen
 */

import React from "react";
import { useNavigate } from "react-router-dom";

import placeholderImg from "../../assets/react.svg";
import { AppRoutes, USER_DATA } from "../../constants";
import { LocalStorageHelper } from "../../utils/HttpUtils";

const IconButton = ({ label, img, icon, onClick }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-xl hover:cursor-pointer"
      onClick={onClick}
    >
      {!!img && <img src={img} alt={label} className="w-6 h-6" />}
      {!!icon && <span className="text-xl">{icon}</span>}
    </div>
    <p className="text-center font-semibold text-md mt-2">{label}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const { firstName, lastName, officialEmail } = userData ?? {};
  return (
    <div>
      <div className="flex h-44 items-center w-full px-8 pt-6 pb-20 bg-[#72abbc] rounded-b-[3.5rem]">
        <img
          alt="user_img"
          src={placeholderImg}
          className="h-20 w-20 rounded-full mr-6"
        />
        <div>
          <h1 className="text-white font-bold text-xl uppercase tracking-wider mb-2">{`${firstName} ${lastName}`}</h1>
          <h2 className="text-white font-medium sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {officialEmail}
          </h2>
        </div>
      </div>

      <div className="bg-gray-50 mx-6 mt-[-3rem] px-4 py-6 shadow-xl rounded-lg">
        <h1 className="font-bold text-lg tracking-wider mb-8">Features</h1>
        <div className="grid grid-cols-3 gap-4">
          <IconButton
            label="Team"
            icon="👥"
            onClick={() => navigate(AppRoutes.USERS)}
          />
          <IconButton label="Metrics" icon="🎁" />
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
