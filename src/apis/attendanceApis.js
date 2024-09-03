/**
 * Attendance APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const attendanceApis = {
  getAttendance: async ({ user_id }) => {
    try {
      const response = await httpClient.get(
        `${endpoints.ATTENDANCE}/${user_id}`
      );
      return response;
    } catch (error) {
      console.log("getAttendance:", error);
    }
  },

  punchInOut: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.ATTENDANCE, payload);
      return response;
    } catch (error) {
      console.log("punchInOut:", error);
    }
  },
};
