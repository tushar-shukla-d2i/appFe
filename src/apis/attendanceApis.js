/**
 * Attendance APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const attendanceApis = {
  getAttendance: async ({ user_id, attendanceDate }) => {
    try {
      let url = endpoints.ATTENDANCE;
      if (user_id) {
        url += `/${user_id}`;
      }
      const params = {};
      if (attendanceDate) {
        params.attendanceDate = attendanceDate;
      }
      const response = await httpClient.get(url, { params });
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
