/**
 * Admin- Attendance Records Screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { attendanceApis } from "../../apis";
import { AppRoutes, DEBOUNCE_DELAY } from "../../constants";
import { convertUTCtoIST, useDebounce, UtilFunctions } from "../../utils";
import {
  NoRecordsFound,
  ScreenHeader,
  ScreenWrapper,
  Loader,
  Pagination,
  SearchInput,
} from "../../components";

const AttendanceRecords = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceList, setAttendanceList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page")
      ? parseInt(queryParams.get("page"), 10)
      : 1;
    const query = queryParams.get("q") || "";
    const date =
      queryParams.get("date") || new Date().toISOString().split("T")[0];
    setCurrentPage(page);
    setSearchQuery(query);
    setAttendanceDate(date);
    getAttendanceList(page, query, date);
  }, [location.search]);

  const getAttendanceList = async (page, q, date) => {
    setLoading(true);
    let payload = { page, q, attendanceDate: date };
    payload = UtilFunctions.convertToDayjsYMDFormat(payload, [
      "attendanceDate",
    ]);
    const resp = await attendanceApis.getAttendance(payload);
    setAttendanceList(resp?.data?.data?.records?.employees || []);
    setTotalPages(resp?.data?.data?.totalPages || 1);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate({ search: queryParams.toString() });
    setCurrentPage(page);
  };

  const debouncedSearch = useDebounce((query) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", query);
    queryParams.set("page", 1);
    navigate({ search: queryParams.toString() });
  }, DEBOUNCE_DELAY);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setAttendanceDate(newDate);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("date", newDate);
    queryParams.set("page", 1);
    navigate({ search: queryParams.toString() });
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader
          title="Attendance Records"
          navigateBackURl={AppRoutes.DASHBOARD}
        />

        <div className="mx-10">
          <div className="my-6">
            <label htmlFor="datePicker" className="block text-gray-700 mb-2">
              Select Date:
            </label>
            <input
              id="datePicker"
              type="date"
              value={attendanceDate}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between mt-10 mb-6">
            <SearchInput
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
          {loading ? (
            <Loader />
          ) : attendanceList.length ? (
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
                  {attendanceList?.map?.((employee) => {
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
                          <div className="max-w-xs">{timesheet}</div>
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
