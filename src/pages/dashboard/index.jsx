/**
 * Dashboard screen
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiLogOut,
} from "react-icons/fi";

import { authApis } from "../../apis";
import placeholderImg from "../../assets/react.svg";
import { AppRoutes, USER_DATA, USER_ROLES } from "../../constants";
import { LocalStorageHelper } from "../../utils/HttpUtils";

// Dummy data for rewards
const rewards = [
  { name: "John Doe", rate: 8, comment: "Great job on the project!" },
  {
    name: "Jane Smith",
    rate: 9,
    comment: "Excellent work on the last sprint.",
  },
  // Add more reward objects as needed
];

const IconButton = ({ label, img, icon, onClick }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-14 h-14 bg-slate-100 flex items-center justify-center rounded-xl hover:cursor-pointer"
      onClick={onClick}
    >
      {!!img && <img src={img} alt={label} className="w-6 h-6" />}
      {!!icon && <span className="text-3xl">{icon}</span>}
    </div>
    <p className="text-center font-semibold text-md mt-2">{label}</p>
  </div>
);

const RewardCard = ({ rewards }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h1 className="font-bold text-lg tracking-wider">Rewards</h1>
        {expanded ? (
          <FiChevronUp className="text-black text-2xl transition-transform duration-500" />
        ) : (
          <FiChevronDown className="text-black text-2xl transition-transform duration-500" />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="mt-6">
          {rewards?.map?.((reward, index) => (
            <div key={index} className="border-b border-gray-200 py-2">
              <div className="flex justify-between">
                <span className="font-semibold">{reward.name}</span>
                <span className="text-gray-600">{reward.rate}/10</span>
              </div>
              <p className="text-gray-600 mt-1">{reward.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const { _id, firstName, lastName, officialEmail, role } = userData ?? {};
  const [userImage, setUserImage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    const resp = await authApis.logout();
    !!resp && navigate(AppRoutes.LOGIN);
  };

  return (
    <div>
      <div className="flex h-48 items-center w-full px-8 pt-6 pb-20 bg-[#72abbc] rounded-b-[3.5rem]">
        <div className="relative h-20 w-20 rounded-full mr-8">
          <img
            alt="user_img"
            src={userImage || placeholderImg}
            className="h-full w-full rounded-full hover:cursor-pointer"
          />
          <label className="absolute bottom-2 -right-2 flex items-center justify-center cursor-pointer">
            {userImage ? (
              <FiEdit className="text-white text-xl" />
            ) : (
              <FiCamera className="text-white text-xl" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex-1">
          <h1 className="text-white font-bold text-xl uppercase tracking-wider mb-2">{`${firstName} ${lastName}`}</h1>
          <h2 className="text-white font-medium sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {officialEmail}
          </h2>
          <p className="text-white font-bold text-xl mt-2">
            Total Rewards - {rewards?.length}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-100 p-3 rounded-full hover:bg-gray-200"
        >
          <FiLogOut className="h-6 w-6 text-[#0375a7]" />
        </button>
      </div>

      <div className="bg-gray-50 mx-6 mt-[-3rem] mb-10 px-4 py-6 shadow-xl rounded-lg">
        <RewardCard rewards={rewards} />
      </div>

      <div className="bg-gray-50 mx-6 px-4 py-6 shadow-2xl rounded-lg">
        <h1 className="font-bold text-lg tracking-wider mb-8">Features</h1>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {role === USER_ROLES.ADMIN && (
            <IconButton
              label="Manage Users"
              icon="🗂️"
              onClick={() => navigate(AppRoutes.MANAGE_USERS)}
            />
          )}
          <IconButton
            label="Profile"
            icon="🧑‍💼"
            onClick={() => navigate(`${AppRoutes.USER}/${_id}`)}
          />
          <IconButton
            label="Change Password"
            icon="🔒"
            onClick={() => navigate(`${AppRoutes.CHANGE_PASSWORD}/${_id}`)}
          />
          <IconButton
            label="Team"
            icon="👥"
            onClick={() => navigate(AppRoutes.USERS)}
          />
          <IconButton
            label="Metrics"
            icon="🎁"
            onClick={() => navigate(AppRoutes.METRICS)}
          />
          {/* <IconButton
            label="Rewards"
            icon="🎖️"
            onClick={() => navigate(AppRoutes.METRICS)}
          /> */}
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
