/**
 * User Card Component
 */

import React from "react";

import placeholderImg from "../assets/placeholder.png";
import {
  envBasedImgUrl,
  formatDateToShortMonthString,
} from "../utils/CommonUtils";

const formatDate = (date) =>
  new Date(date)?.toLocaleDateString?.("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

const isToday = (date) => formatDate(date) === formatDate(new Date());

const UserCard = ({ userData }) => {
  const {
    _id,
    firstName,
    lastName,
    bloodGroup,
    officialEmail,
    alternateEmail,
    contactNumber,
    alternateContactNumber,
    birthday,
    joiningDate,
    userProfile,
  } = userData ?? {};

  const RenderDetails = ({ label, value, highlight }) => (
    <p
      className={`font-semibold my-2 ${
        highlight
          ? "bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 py-2 rounded"
          : ""
      }`}
    >
      <span className="mr-2">{label} :</span> {value}
    </p>
  );

  return (
    <div key={_id} className="mx-8 my-4 bg-gray-50 shadow-lg rounded-lg">
      <div className="flex justify-center items-center p-2">
        <img
          src={
            userProfile ? `${envBasedImgUrl()}${userProfile}` : placeholderImg
          }
          alt="logo"
          className="rounded-full h-16 w-16 mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{`${
            firstName || ""
          } ${lastName || ""}`}</h2>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        {!!bloodGroup && <RenderDetails label="🩸" value={bloodGroup} />}
        <RenderDetails label="✉️" value={officialEmail} />
        {!!alternateEmail && (
          <RenderDetails label="📬" value={alternateEmail} />
        )}
        {!!contactNumber && <RenderDetails label="☎️" value={contactNumber} />}
        {!!alternateContactNumber && (
          <RenderDetails label="📲" value={alternateContactNumber} />
        )}
        {!!birthday && (
          <RenderDetails
            label="🎂"
            value={formatDateToShortMonthString(birthday)}
            highlight={isToday(birthday)}
          />
        )}
        <RenderDetails
          label="🗓️"
          value={formatDateToShortMonthString(joiningDate)}
        />
      </div>
    </div>
  );
};

export { UserCard };
