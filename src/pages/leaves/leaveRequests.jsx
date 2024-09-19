/**
 * Leave Requests Screen
 */

import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { leaveApis } from "../../apis";
import { formattedMDYDate } from "../../utils/CommonUtils";
import {
  getLeaveType,
  LEAVE_STATUS,
  LEAVE_STATUS_ARRAY,
  RECORDS_PER_PAGE,
} from "../../constants";
import {
  Button,
  Loader,
  NoRecordsFound,
  ScreenHeader,
  ScreenWrapper,
  Toast,
} from "../../components";

const { approved, pending, rejected } = LEAVE_STATUS;

const LeaveRequests = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [screenLoading, setScreenLoading] = useState(false);
  const [loading, setLoading] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status") || "";
    setSelectedStatus(status);
    if (user_id) {
      getSubordinatesLeaves(status, 1);
    }
  }, [user_id, location.search]);

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("status", status);
    navigate({ search: queryParams?.toString() });
    getSubordinatesLeaves(status, 1);
  };

  // Fetch leave requests from subordinates
  const getSubordinatesLeaves = async (status, page) => {
    setScreenLoading(true);
    const resp = await leaveApis.getLeavesById({
      user_id,
      status,
      page,
      limit: RECORDS_PER_PAGE,
    });
    setTimeout(() => {
      setScreenLoading(false);
    }, 200);
    if (resp?.success) {
      setLeaveRequests(resp?.data?.data?.leaves || []);
      setTotalPages(resp?.data?.data?.totalPages || 1);
      setCurrentPage(page);
    }
  };

  const handleSubmit = async (leave_id, status, action) => {
    setLoading((prev) => ({
      ...prev,
      [leave_id]: { ...prev[leave_id], [action]: true },
    }));
    const resp = await leaveApis.updateLeave({
      leave_id,
      payload: { status },
    });
    setLoading((prev) => ({
      ...prev,
      [leave_id]: { ...prev[leave_id], [action]: false },
    }));
    if (resp?.success) {
      setToastMsg(`Leave ${status} successfully!`);
      getSubordinatesLeaves(selectedStatus, currentPage);
    }
  };

  const handlePageChange = (page) => {
    getSubordinatesLeaves(selectedStatus, page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    // Prev button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-md border-2 ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-white text-black border-gray-500"
        }`}
      >
        <FaChevronLeft
          className={`${
            currentPage === 1 ? "text-gray-400" : "text-gray-600"
          } text-sm`}
        />
      </button>
    );

    // First page box
    buttons.push(
      <button
        key="page1"
        disabled={currentPage === 1}
        onClick={() =>
          handlePageChange(currentPage === 1 ? 1 : currentPage - 1)
        }
        className={`px-3 py-1 rounded-md border-2 ${
          currentPage === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-500"
        }`}
      >
        {currentPage === 1 ? 1 : currentPage - 1}
      </button>
    );

    // Second page box
    buttons.push(
      <button
        key="page2"
        disabled={totalPages === 1 || currentPage === totalPages}
        onClick={() => handlePageChange(currentPage === 1 ? 2 : currentPage)}
        className={`px-3 py-1 rounded-md border-2 ${
          totalPages === 1 || currentPage === totalPages
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-500"
        }`}
      >
        {currentPage === 1 ? 2 : currentPage}
      </button>
    );

    // Ellipsis
    buttons.push(
      <span key="ellipsis" className="pr-2">
        ...
      </span>
    );

    // Last page box
    {
      totalPages > 1 &&
        buttons.push(
          <button
            key="lastPage"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border-2 ${
              currentPage === totalPages
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-500"
            }`}
          >
            {totalPages}
          </button>
        );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md border-2 ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-white text-black border-gray-500"
        }`}
      >
        <FaChevronRight
          className={`${
            currentPage === totalPages ? "text-gray-400" : "text-gray-600"
          } text-sm`}
        />
      </button>
    );

    return buttons;
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader title="Leave Requests" />

        {/* Filter Dropdown */}
        <div className="w-[85%] mx-auto mt-6">
          <select
            value={selectedStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border text-sm border-gray-300 px-2 py-1 rounded-md"
          >
            {LEAVE_STATUS_ARRAY.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {screenLoading ? (
          <Loader />
        ) : (
          <div className="w-[85%] mx-auto mt-6">
            {!leaveRequests?.length ? (
              <NoRecordsFound />
            ) : (
              leaveRequests?.map?.((leave) => {
                const {
                  _id,
                  userName,
                  leaveStart,
                  leaveEnd,
                  leaveType,
                  dayType,
                  reason,
                  status,
                } = leave ?? {};
                return (
                  <div
                    key={_id}
                    className="px-6 py-4 mt-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 mb-6"
                  >
                    {/* User Name */}
                    <p className="text-center mb-4 font-bold text-gray-900">
                      {userName || ""}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-2 xs:grid-cols-1">
                      {/* Start Date */}
                      <div>
                        <p className="text-sm text-gray-700">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formattedMDYDate(leaveStart)}
                        </p>
                      </div>
                      {/* End Date */}
                      <div>
                        <p className="text-sm text-gray-700">End Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formattedMDYDate(leaveEnd)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-2 xs:grid-cols-1">
                      {/* Leave Type */}
                      <div>
                        <p className="text-sm text-gray-700">Leave Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getLeaveType(leaveType)}
                        </p>
                      </div>
                      {/* Day Type */}
                      <div>
                        <p className="text-sm text-gray-700">Day Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {dayType === 1 ? "Full Day" : "Half Day"}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <p className="text-sm text-gray-700">Reason</p>
                      <p className="text-sm font-medium text-gray-900">
                        {reason}
                      </p>
                    </div>

                    {/* Approve/Reject Buttons */}
                    <div className="flex flex-wrap justify-center">
                      {status === pending ? (
                        <>
                          <Button
                            title="Approve"
                            loading={loading[_id]?.approve}
                            onClick={() =>
                              handleSubmit(_id, approved, "approve")
                            }
                            disabled={
                              loading[_id]?.approve || loading[_id]?.rejected
                            }
                            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm w-fit m-2 ${
                              loading[_id]?.approve || loading[_id]?.rejected
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                          <Button
                            title="Reject"
                            loading={loading[_id]?.rejected}
                            onClick={() =>
                              handleSubmit(_id, rejected, "rejected")
                            }
                            disabled={
                              loading[_id]?.approve || loading[_id]?.rejected
                            }
                            className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm w-fit m-2 ${
                              loading[_id]?.approve || loading[_id]?.rejected
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        </>
                      ) : (
                        <Button
                          title={status}
                          disabled
                          className="text-white capitalize py-2 px-4 rounded-md text-sm w-fit m-2 disabled:bg-gray-400"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-6 mb-8">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
        <Toast message={toastMsg} navigateUrl={null} />
      </div>
    </ScreenWrapper>
  );
};

export { LeaveRequests };
