/**
 * Leave Requests Screen
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { leaveApis } from "../../apis";
import { formattedMDYDate } from "../../utils/CommonUtils";
import { getLeaveType, LEAVE_STATUS } from "../../constants";
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
  const [screenLoading, setScreenLoading] = useState(false);
  const [loading, setLoading] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (user_id) {
      getSubordinatesLeaves();
    }
  }, [user_id]);

  // Fetch leave requests from subordinates
  const getSubordinatesLeaves = async () => {
    setScreenLoading(true);
    const resp = await leaveApis.getLeavesById({ user_id });
    setTimeout(() => {
      setScreenLoading(false);
    }, 200);
    if (resp?.success) {
      setLeaveRequests(resp?.data?.data || []);
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
      getSubordinatesLeaves();
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader title="Leave Requests" />

        {screenLoading ? (
          <Loader />
        ) : (
          <div className="w-[85%] mx-auto mt-12">
            {!leaveRequests?.length ? (
              <NoRecordsFound />
            ) : (
              leaveRequests.map((leave) => {
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
                    className="p-6 mt-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 mb-6"
                  >
                    {/* User Name */}
                    <p className="text-center mb-4 font-bold text-gray-900">
                      {userName || ""}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-4 xs:grid-cols-1">
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

                    <div className="grid grid-cols-2 gap-6 mb-4 xs:grid-cols-1">
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
                    <div className="mb-4">
                      <p className="text-sm text-gray-700">Reason</p>
                      <p className="text-sm text-gray-900">{reason}</p>
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
          </div>
        )}
        <Toast message={toastMsg} navigateUrl={null} />
      </div>
    </ScreenWrapper>
  );
};

export { LeaveRequests };
