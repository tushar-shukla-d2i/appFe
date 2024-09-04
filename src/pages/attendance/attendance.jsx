/**
 * Attendance Screen
 */

import React, { useEffect, useState } from "react";

import { attendanceApis } from "../../apis";
import { ScreenHeader } from "../../components";
import { LocalStorageHelper } from "../../utils/HttpUtils";
import { PUNCHING_ACTIONS, USER_DATA } from "../../constants";
import { convertUTCtoIST, UtilFunctions } from "../../utils/CommonUtils";

const { PUNCH_IN, PUNCH_OUT } = PUNCHING_ACTIONS;

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const userData = JSON.parse(LocalStorageHelper.get(USER_DATA));
  const isPunchedIn = attendance?.punchInTime;

  useEffect(() => {
    getAttendance();
  }, []);

  const getAttendance = async (attendanceDate) => {
    let payload = { user_id: userData?._id };
    if (attendanceDate) {
      payload.attendanceDate = attendanceDate;
      payload = UtilFunctions.convertToDayjsYMDFormat(payload, [
        "attendanceDate",
      ]);
    }
    const resp = await attendanceApis.getAttendance(payload);
    setAttendance(resp?.data?.data);
  };

  const handlePunchToggle = async () => {
    const payload = { action: isPunchedIn ? PUNCH_OUT : PUNCH_IN };
    await attendanceApis.punchInOut(payload);
    getAttendance();
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    getAttendance(event.target.value);
  };

  // Check if the selected date is today's date
  const isToday = date === new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white">
      <ScreenHeader title="Attendance" />

      <div className="w-[70%] mx-auto p-8 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <button
          disabled={!isToday || !!attendance?.punchOutTime}
          onClick={handlePunchToggle}
          className={`w-full py-2 px-4 text-white rounded-md mb-6 transition-all ${
            isPunchedIn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } disabled:text-white disabled:rounded-md disabled:bg-gray-400`}
        >
          {isPunchedIn ? "Punch Out" : "Punch In"}
        </button>

        <div className="my-6">
          <label htmlFor="datePicker" className="block text-gray-700 mb-2">
            Select Date:
          </label>
          <input
            id="datePicker"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center text-gray-700 mt-10">
          <span className="block font-medium mr-4">Punch in time:</span>
          <span className="text-lg font-semibold">{`${convertUTCtoIST(
            attendance?.punchInTime
          )}`}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="block font-medium mr-4">Punch out time:</span>
          <span className="text-lg font-semibold">{`${convertUTCtoIST(
            attendance?.punchOutTime
          )}`}</span>
        </div>
      </div>
    </div>
  );
};

export { Attendance };
