/**
 * Leaves APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { RECORDS_PER_PAGE } from "../constants";

export const leaveApis = {
  getMyLeaves: async () => {
    try {
      const response = await httpClient.get(endpoints.LEAVE);
      return response;
    } catch (error) {
      console.log("getMyLeaves:", error);
    }
  },

  getLeavesById: async ({
    user_id,
    status,
    page,
    limit = RECORDS_PER_PAGE,
  }) => {
    try {
      const response = await httpClient.get(`${endpoints.LEAVE}/${user_id}`, {
        params: { status, page, limit },
      });
      return response;
    } catch (error) {
      console.log("getLeavesById:", error);
    }
  },

  createLeave: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.LEAVE, payload);
      return response;
    } catch (error) {
      console.log("createLeave:", error);
    }
  },

  updateLeave: async ({ leave_id, payload }) => {
    try {
      const response = await httpClient.put(
        `${endpoints.LEAVE}/${leave_id}`,
        payload
      );
      return response;
    } catch (error) {
      console.log("updateLeave:", error);
    }
  },
};
