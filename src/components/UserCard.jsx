/**
 * User Card Component
 */

import React from "react";

import d2iLogo from "../assets/d2i_logo.jpg";
import { formatDateToShortMonthString } from "../utils/CommonUtils";

const UserCard = ({ userData }) => {
  const {
    _id,
    firstName,
    lastName,
    role,
    bloodGroup,
    officialEmail,
    alternateEmail,
    contactNumber,
    alternateContactNumber,
    birthday,
  } = userData ?? {};

  const RenderDetails = ({ label, value }) => {
    return (
      <p className="font-semibold text-black my-2">
        <span className="mr-2">{`${label}: `}</span> {value}
      </p>
    );
  };

  return (
    <div
      key={_id}
      className="mx-8 my-4 bg-gray-50 shadow-lg rounded-lg overflow-hidden"
    >
      <div className="flex justify-center items-center p-2">
        <img
          src={d2iLogo}
          alt="logo"
          className="rounded-full h-16 w-16 mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{`${
            firstName || ""
          } ${lastName || ""}`}</h2>
          <p className="text-gray-600">{role || "S/W Engineer"}</p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <RenderDetails label="🩸" value={bloodGroup} />
        <RenderDetails
          label="📧"
          value={`${officialEmail} ${
            alternateEmail ? `, ${alternateEmail}` : ""
          }`}
        />
        <RenderDetails
          label="📞"
          value={`${contactNumber} ${
            alternateContactNumber ? `, ${alternateContactNumber}` : ""
          }`}
        />
        <RenderDetails
          label="🎂"
          value={formatDateToShortMonthString(birthday)}
        />
      </div>
    </div>
  );
};

export { UserCard };
