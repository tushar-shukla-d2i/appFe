/**
 * Admin- Attendance Records Screen
 */

import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

import { attendanceApis } from "../../apis";
import { convertUTCtoIST, UtilFunctions } from "../../utils/CommonUtils";
import { NoRecordsFound, ScreenHeader, ScreenWrapper } from "../../components";

const AttendanceRecords = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceList, setAttendanceList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getAttendanceList();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [attendanceList, searchQuery]);

  const getAttendanceList = async (attendanceDate) => {
    let payload = { attendanceDate };
    payload = UtilFunctions.convertToDayjsYMDFormat(payload, [
      "attendanceDate",
    ]);
    const resp = await attendanceApis.getAttendance(payload);
    setAttendanceList(resp?.data?.data?.employees);
  };

  const filterUsers = () => {
    const lowercasedQuery = searchQuery?.toLowerCase();
    const fieldsToSearch = [
      "_id",
      "userName",
      "punchInTime",
      "punchOutTime",
      "timesheet",
    ];
    const filtered = attendanceList?.filter?.((user) =>
      fieldsToSearch?.some?.((field) =>
        user?.[field]?.toString()?.toLowerCase()?.includes?.(lowercasedQuery)
      )
    );

    setFilteredUsers(filtered);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    getAttendanceList(event.target.value);
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader title="Attendance Records" />

        <div className="mx-10">
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

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-500 rounded-lg w-full"
            />
            <div className="absolute top-3 right-2">
              {searchQuery ? (
                <FaTimes
                  className="cursor-pointer text-gray-500"
                  onClick={() => setSearchQuery("")}
                />
              ) : (
                <FaSearch className="text-gray-500" />
              )}
            </div>
          </div>

          {filteredUsers?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-4 text-left font-medium border-r border-gray-300 text-gray-700 w-1/4">
                      Name
                    </th>
                    <th className="py-2 px-4 text-left font-medium border-r border-gray-300 text-gray-700 w-1/4">
                      Attendance
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-gray-700 w-1/2">
                      Timesheet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map?.((employee) => {
                    const {
                      _id,
                      userName,
                      punchInTime,
                      punchOutTime,
                      timesheet,
                    } = employee ?? {};
                    return (
                      <tr key={_id} className="border-b border-gray-200">
                        <td className="py-2 px-4 text-sm border-r border-gray-300">
                          {userName}
                        </td>
                        <td className="py-2 px-4 border-r border-gray-300">
                          <div className="text-sm">
                            In: {convertUTCtoIST(punchInTime)}
                          </div>
                          <div className="text-sm">
                            Out: {convertUTCtoIST(punchOutTime)}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="truncate max-w-xs">{timesheet}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <NoRecordsFound />
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
};

export { AttendanceRecords };
