/**
 * Apply Leave Screen
 */

import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { leaveApis } from "../../apis";
import { formattedMDYDate, UtilFunctions } from "../../utils/CommonUtils";
import {
  DAY_TYPES,
  getLeaveType,
  LEAVE_STATUS,
  LEAVE_TYPES,
} from "../../constants";
import {
  Button,
  ErrorMsg,
  Input,
  ScreenHeader,
  ScreenWrapper,
  Toast,
  Loader,
} from "../../components";

const { approved, rejected } = LEAVE_STATUS;

const validationSchema = Yup.object().shape({
  leaveStart: Yup.date().required("Start date is required."),
  leaveEnd: Yup.date().required("End date is required."),
  leaveType: Yup.string().required("Leave type is required."),
  dayType: Yup.number().required("Day type is required."),
  reason: Yup.string().required("Please provide a reason for your leave."),
});

const isDisabled = (date) => {
  const day = date?.getDay();
  const isSunday = day === 0;
  const isSaturday = day === 6;
  const isFirstSaturday = date?.getDate() <= 7 && isSaturday;
  const isPastDate = date < new Date();
  const holidays = [new Date(2024, 0, 1), new Date(2024, 11, 25)];
  const isHoliday = holidays.some(
    (holiday) => date?.toDateString() === holiday?.toDateString()
  );
  return (
    isSunday || (isSaturday && !isFirstSaturday) || isPastDate || isHoliday
  );
};

const CalendarInput = ({
  label,
  value,
  setFieldValue,
  fieldName,
  minDate,
  maxDate,
  disabled,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateChange = (date) => {
    if (!isDisabled(date)) {
      setFieldValue(fieldName, date);
    }
    setCalendarOpen(false);
  };

  const handleOpenCalendar = () => {
    if (!disabled) {
      setCalendarOpen(!calendarOpen);
    }
  };

  return (
    <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
      <label className="block mb-2 text-sm">{label}</label>
      <div className="relative" onClick={handleOpenCalendar}>
        <input
          type="text"
          value={value ? formattedMDYDate(value) : ""}
          placeholder={`Select ${label?.toLowerCase()}`}
          readOnly
          className="border border-gray-300 text-sm p-2 pl-10 rounded-lg w-full cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <FaCalendarAlt
          className={`absolute left-2 top-3 text-gray-${
            disabled ? "300" : "500"
          } ${disabled ? "cursor-not-allowed" : "hover:cursor-pointer"}`}
        />
      </div>
      {calendarOpen && (
        <div className="absolute bg-white border border-gray-300 z-10">
          <Calendar
            onChange={handleDateChange}
            value={value}
            tileDisabled={({ date }) => isDisabled(date)}
            minDate={minDate}
            maxDate={maxDate}
            onClickDay={handleDateChange}
          />
        </div>
      )}
      <ErrorMsg id={fieldName} />
    </div>
  );
};

const getTodayDate = () => {
  const today = new Date();
  return today?.toISOString()?.split?.("T")?.[0];
};

const ApplyLeave = () => {
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [leavesLoading, setLeavesLoading] = useState(false);

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    setLeavesLoading(true);
    const resp = await leaveApis.getMyLeaves();
    if (resp?.success) {
      setLeaves(resp.data?.data?.leaves || []);
    }
    setLeavesLoading(false);
  };

  const TableHead = () => (
    <thead>
      <tr className="bg-gray-200">
        {[
          "Start Date",
          "End Date",
          "Leave Type",
          "Day Type",
          "Reason",
          "Status",
        ].map((header) => (
          <th key={header} className="p-2 text-center text-sm font-semibold">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );

  const TableCell = ({ children }) => (
    <td className="p-2 text-center text-sm capitalize">{children}</td>
  );

  const TableBody = ({ leaves }) => (
    <tbody>
      {leaves?.map?.((leave) => {
        const {
          _id,
          leaveStart,
          leaveEnd,
          leaveType,
          status,
          dayType,
          reason,
        } = leave ?? {};

        return (
          <tr key={_id} className="border-b border-gray-200">
            <TableCell>{formattedMDYDate(leaveStart)}</TableCell>
            <TableCell>{formattedMDYDate(leaveEnd)}</TableCell>
            <TableCell>{getLeaveType(leaveType)}</TableCell>
            <TableCell>{dayType}</TableCell>
            <TableCell>{reason}</TableCell>
            <td className="p-2 text-center text-xs text-white font-medium capitalize">
              <div
                className={`${
                  status === approved
                    ? "bg-green-500"
                    : status === rejected
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } rounded-full p-[6px] text-center`}
              >
                {status}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    let payload = values;
    payload = UtilFunctions.convertToDayjsYMDFormat(payload, [
      "leaveStart",
      "leaveEnd",
    ]);
    payload.dayType = Number(payload.dayType);
    const resp = await leaveApis.createLeave(payload);
    setLoading(false);
    if (resp?.success) {
      setToastMsg("Leave applied successfully!");
      fetchMyLeaves();
      resetForm();
    }
  };

  return (
    <ScreenWrapper>
      <div className="bg-white">
        <ScreenHeader title="Apply Leave" />
        <div className="w-[85%] mx-auto mt-16 mb-6">
          <div className="p-6 mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
            <Formik
              initialValues={{
                reason: "",
                leaveStart: null,
                leaveEnd: null,
                leaveType: "",
                dayType: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, setFieldValue, values }) => (
                <Form>
                  {/* Date Inputs */}
                  <div className="flex flex-col sm:flex-row sm:space-x-6">
                    {/* Start Date Input */}
                    <CalendarInput
                      label="Start Date"
                      value={values?.leaveStart}
                      setFieldValue={setFieldValue}
                      fieldName="leaveStart"
                      minDate={new Date(getTodayDate())}
                      maxDate={
                        values?.leaveEnd ? new Date(values?.leaveEnd) : null
                      }
                      disabled={loading}
                    />

                    {/* End Date Input */}
                    <CalendarInput
                      label="End Date"
                      value={values?.leaveEnd}
                      setFieldValue={setFieldValue}
                      fieldName="leaveEnd"
                      minDate={values?.leaveStart || new Date(getTodayDate())}
                      disabled={loading}
                    />
                  </div>

                  {/* Leave Type and Day Type in a Row */}
                  <div className="flex flex-col sm:flex-row sm:space-x-6 sm:my-6">
                    {/* Leave Type Dropdown */}
                    <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                      <Input
                        id="leaveType"
                        label="Leave Type:"
                        type="select"
                        options={LEAVE_TYPES}
                        placeholder="Select leave type"
                        disabled={loading}
                      />
                    </div>

                    {/* Day Type Dropdown */}
                    <div className="w-full sm:w-1/2">
                      <Input
                        id="dayType"
                        label="Day Type"
                        type="select"
                        options={DAY_TYPES}
                        placeholder="Select day type"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="mt-4">
                    <label className="block mb-2 text-sm">
                      Reason for Leave:
                    </label>
                    <Field
                      as="textarea"
                      name="reason"
                      rows="3"
                      className="border border-gray-300 w-full p-2 text-sm rounded-lg disabled:cursor-not-allowed"
                      placeholder="Provide a reason for your leave"
                      disabled={loading}
                      onChange={(e) =>
                        e.target.value !== " " && handleChange(e)
                      }
                    />
                    <ErrorMsg id="reason" />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 text-center">
                    <Button
                      type="submit"
                      loading={loading}
                      title="Submit"
                      width="auto"
                    />
                  </div>
                </Form>
              )}
            </Formik>

            {/* Display User Leaves */}
            {!!leaves?.length && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">My Leaves</h3>
                {leavesLoading ? (
                  <Loader />
                ) : (
                  <div className="overflow-auto sm:overflow-visible">
                    <table className="min-w-full border border-gray-300">
                      <TableHead />
                      <TableBody leaves={leaves} />
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Toast message={toastMsg} navigateUrl={null} />
      </div>
    </ScreenWrapper>
  );
};

export { ApplyLeave };
