/**
 * Screen Wrapper Component
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoInternetImg from "../assets/no-internet.jpeg";

import { AppRoutes, USER_TOKEN } from "../constants";
import { LocalStorageHelper } from "../utils/HttpUtils";

const ScreenWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isConnected, setConnected] = useState(navigator.onLine);
  const userToken = LocalStorageHelper.get(USER_TOKEN);

  useEffect(() => {
    if (!userToken) {
      navigate(AppRoutes.LOGIN);
    }

    const handleOffline = () => setConnected(false);
    const handleOnline = () => setConnected(true);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const RefreshButton = ({ onClick }) => {
    return (
      <div className="flex justify-center">
        <button
          className="
          border-2 
          border-[#0375a7] 
          bg-white 
          text-[#0375a7] 
          font-semibold 
          py-2 px-6 
          rounded-full 
          hover:bg-blue-50 
          transition-colors 
          duration-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#0375a7] 
          focus:ring-offset-2 
          text-sm"
          onClick={onClick}
        >
          Refresh
        </button>
      </div>
    );
  };

  return isConnected ? (
    <>{children}</>
  ) : (
    <div className="text-center mt-20">
      <img
        src={NoInternetImg}
        alt="No Connection"
        className="w-40 h-40 mx-auto mb-6"
      />
      <h1 className="font-bold mb-2">Something went wrong</h1>
      <p className="text-xs font-medium text-gray-400 mb-6">
        Check your connection, then refresh the page
      </p>
      <RefreshButton onClick={handleRefresh} />
    </div>
  );
};

export { ScreenWrapper };
