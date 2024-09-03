/**
 * Attendance APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const attendanceApis = {
  getAttendance: async () => {
    try {
      const response = await httpClient.get(endpoints.ATTENDANCE);
      return response;
    } catch (error) {
      console.log("getAttendance:", error);
    }
  },

  punchInOut: async () => {
    try {
      const response = await httpClient.post(endpoints.ATTENDANCE);
      return response;
    } catch (error) {
      console.log("punchInOut:", error);
    }
  },

  updatePunchInOut: async () => {
    try {
      const response = await httpClient.put(`${endpoints.ATTENDANCE}/123`);
      return response;
    } catch (error) {
      console.log("updatePunchInOut:", error);
    }
  },
};
