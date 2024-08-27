/**
 * Screen Header Component
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ScreenHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 flex items-center justify-between shadow-lg">
      <button onClick={handleBackClick} className="text-xl">
        <FaArrowLeft />
      </button>
      <h1 className="text-lg font-semibold">{title || ""}</h1>
      <div /> {/* Empty div for spacing */}
    </div>
  );
};

export { ScreenHeader };
