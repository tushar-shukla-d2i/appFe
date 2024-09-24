/**
 * Dashboard screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiEdit, FiLogOut } from "react-icons/fi";

import { envBasedImgUrl } from "../../utils/CommonUtils";
import { Loader, ScreenWrapper } from "../../components";
import placeholderImg from "../../assets/placeholder.png";
import { LocalStorageHelper } from "../../utils/HttpUtils";
import { authApis, commonApis, rewardsApis } from "../../apis";
import { AppRoutes, USER_DATA, USER_ROLES } from "../../constants";

const IconButton = ({ label, icon, onClick }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-11 h-11 bg-slate-100 border flex items-center justify-center rounded-xl hover:cursor-pointer"
      onClick={onClick}
    >
      {!!icon && <span className="text-2xl">{icon}</span>}
    </div>
    <p className="text-center font-medium text-sm mt-2">{label}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const { _id, firstName, lastName, officialEmail, role } = userData ?? {};
  const [rewards, setRewards] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getUserData();
    !!_id && getRewardsList();
  }, []);

  const getUserData = async () => {
    const resp = await commonApis.getMyData();
    if (resp?.success && resp?.data?.data?.userProfile) {
      setUserImage(`${envBasedImgUrl()}${resp?.data?.data?.userProfile}`);
    }
  };

  const getRewardsList = async () => {
    const resp = await rewardsApis.getAllRewards({ user_id: _id });
    setRewards(resp?.rewards);
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("userProfile", file);
    try {
      setIsUploading(true);
      const resp = await commonApis.me({ user_id: _id, payload: formData });
      if (resp?.success) {
        getUserData();
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
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
    <ScreenWrapper>
      <div>
        <div className="flex h-48 items-center w-full px-8 pt-6 pb-20 bg-[#72abbc] rounded-b-[3.5rem]">
          <div className="relative h-16 w-16 rounded-full mr-6">
            {isUploading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <img
                alt="user_img"
                src={userImage || placeholderImg}
                className="h-full w-full rounded-full hover:cursor-pointer"
              />
            )}
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
            <h1 className="text-white font-bold text-sm uppercase tracking-wider mb-2">{`${firstName} ${lastName}`}</h1>
            <h2 className="text-white font-medium sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              {officialEmail}
            </h2>
            <p className="text-white font-bold mt-2">
              {`Total Rewards - (${
                rewards?.reduce?.((s, i) => s + i?.points, 0) || "0"
              })`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200"
          >
            <FiLogOut className="h-4 w-4 text-[#0375a7]" />
          </button>
        </div>

        <div className="bg-gray-50 mx-6 mt-[-3rem] mb-10 px-4 py-6 shadow-2xl rounded-lg">
          <h1 className="font-bold text-lg tracking-wider mb-8">Features</h1>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            <IconButton
              label="Attendance"
              icon="📅"
              onClick={() => navigate(AppRoutes.ATTENDANCE)}
            />
            {role === USER_ROLES.ADMIN && (
              <IconButton
                label="Attendance Records"
                icon="📈"
                onClick={() => navigate(AppRoutes.ATTENDANCE_RECORDS)}
              />
            )}
            <IconButton
              label="Change Password"
              icon="🔒"
              onClick={() => navigate(`${AppRoutes.CHANGE_PASSWORD}/${_id}`)}
            />
            <IconButton
              label="Directory"
              icon="👥"
              onClick={() => navigate(AppRoutes.DIRECTORY)}
            />
            {role !== USER_ROLES.ADMIN && (
              <IconButton
                label="Leave"
                icon="🏖️"
                onClick={() => navigate(AppRoutes.LEAVE)}
              />
            )}
            {role === USER_ROLES.ADMIN && (
              <IconButton
                label="Manage Users"
                icon="🗂️"
                onClick={() => navigate(AppRoutes.MANAGE_USERS)}
              />
            )}
            <IconButton
              label="Metrics"
              icon="🎁"
              onClick={() => navigate(AppRoutes.METRICS)}
            />
            <IconButton
              label="Profile"
              icon="🧑‍💼"
              onClick={() => navigate(`${AppRoutes.USER}/${_id}`)}
            />
            <IconButton
              label="Requests"
              icon="📋"
              onClick={() => navigate(`${AppRoutes.LEAVE}/${_id}`)}
            />
            {!!rewards?.length && (
              <IconButton
                label="Rewards"
                icon="🎖️"
                onClick={() => navigate(AppRoutes.REWARDS)}
              />
            )}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export { Dashboard };
