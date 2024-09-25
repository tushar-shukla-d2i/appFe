/**
 * Attendance APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { RECORDS_PER_PAGE } from "../constants";

export const attendanceApis = {
  getAttendance: async ({
    user_id,
    attendanceDate,
    page,
    limit = RECORDS_PER_PAGE,
    q,
  }) => {
    try {
      let url = endpoints.ATTENDANCE;
      if (user_id) {
        url += `/${user_id}`;
      }

      const response = await httpClient.get(url, {
        params: { attendanceDate, page, limit, q },
      });
      return response;
    } catch (error) {}
  },

  punchInOut: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.ATTENDANCE, payload);
      return response;
    } catch (error) {}
  },
};
