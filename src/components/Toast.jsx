/**
 * Toast Component
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";

const Toast = ({ message, duration = 1000, navigateUrl = -1 }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        !!navigateUrl && navigate(navigateUrl);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-36 left-1/2 transform -translate-x-1/2 z-50">
      <div
        id="toast-success"
        className="flex items-center w-64 p-3 bg-green-800 rounded-lg shadow"
        role="alert"
      >
        <FaRegCheckCircle className="text-white" />
        <div className="ml-3 text-sm font-normal text-white">{message}</div>
      </div>
    </div>
  );
};

export { Toast };
