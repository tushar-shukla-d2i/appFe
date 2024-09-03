/**
 * Attendance Screen
 */

import React, { useEffect, useState } from "react";

import { attendanceApis } from "../../apis";
import { ScreenHeader } from "../../components";

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  let workingHours = 8;
  let afkHours = 1;
  const isPunchedIn = attendance?.employees?.punchInTime;

  useEffect(() => {
    // getAttendance();
  }, []);

  const getAttendance = async () => {
    const resp = await attendanceApis.getAttendance();
    setAttendance(resp?.data?.data);
  };

  const handlePunchToggle = async () => {
    attendance?.employees?.punchInTime
      ? await attendanceApis.updatePunchInOut()
      : await attendanceApis.punchInOut();
    // getAttendance();
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // Check if the selected date is today's date
  const isToday = date === new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white">
      <ScreenHeader title="Attendance" />

      <div className="w-[70%] mx-auto p-8 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
        {isToday ? (
          <button
            onClick={handlePunchToggle}
            className={`w-full py-2 px-4 text-white rounded-md mb-6 transition-all ${
              isPunchedIn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2 px-4 text-white rounded-md mb-6 bg-gray-400 cursor-not-allowed"
          >
            Punch In/Out
          </button>
        )}

        <div className="my-6">
          <label htmlFor="datePicker" className="block text-gray-700 mb-2">
            Select Date:
          </label>
          <input
            id="datePicker"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center text-gray-700 mt-10">
          <span className="block font-medium mr-4">Total Working Hours:</span>
          <span className="text-lg font-semibold">{`${workingHours} ${
            workingHours > 1 ? "hrs" : "hr"
          }`}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="block font-medium mr-4">Total AFK Time:</span>
          <span className="text-lg font-semibold">{`${afkHours} ${
            afkHours > 1 ? "hrs" : "hr"
          }`}</span>
        </div>
      </div>
    </div>
  );
};

export { Attendance };
