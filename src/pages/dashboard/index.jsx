/**
 * Dashboard screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiEdit, FiLogOut } from "react-icons/fi";

import { Config } from "../../utils/Config";
import placeholderImg from "../../assets/react.svg";
import { LocalStorageHelper } from "../../utils/HttpUtils";
import { authApis, commonApis, rewardsApis } from "../../apis";
import { AppRoutes, USER_DATA, USER_ROLES } from "../../constants";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const { _id, firstName, lastName, officialEmail, role } = userData ?? {};
  const [rewards, setRewards] = useState(false);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    getUserData();
    getRewardsList();
  }, []);

  const getUserData = async () => {
    const resp = await commonApis.getMyData();
    if (resp?.success && resp?.data?.userProfile) {
      setUserImage(`${Config.LOCAL.IMAGE_BASE_URL}${resp?.data?.userProfile}`);
    }
  };

  const getRewardsList = async () => {
    const resp = await rewardsApis.getAllRewards({ user_id: _id });
    if (resp?.success) {
      setRewards(resp?.data?.data);
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("userProfile", file);
    await commonApis.me({ user_id: _id, payload: formData });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
      uploadProfilePicture(file);
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
              id="image"
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
            Total Rewards -{rewards?.reduce?.((s, i) => s + i?.points, 0)}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-100 p-3 rounded-full hover:bg-gray-200"
        >
          <FiLogOut className="h-6 w-6 text-[#0375a7]" />
        </button>
      </div>

      <div className="bg-gray-50 mx-6 mt-[-3rem] mb-10 px-4 py-6 shadow-2xl rounded-lg">
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
            label="Directory"
            icon="👥"
            onClick={() => navigate(AppRoutes.USERS)}
          />
          <IconButton
            label="Metrics"
            icon="🎁"
            onClick={() => navigate(AppRoutes.METRICS)}
          />
          {!!rewards?.length && (
            <IconButton
              label="Rewards"
              icon="🎖️"
              onClick={() => navigate(AppRoutes.REWARDS)}
            />
          )}
          <IconButton
            label="Attendance"
            icon="📅"
            onClick={() => navigate(AppRoutes.ATTENDANCE)}
          />
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
