/**
 * Common APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const commonApis = {
  lookups: async () => {
    try {
      const response = await httpClient.get(endpoints.LOOKUPS);
      return response;
    } catch (error) {
      console.log("lookups:", error);
    }
  },

  me: async ({ user_id, payload }) => {
    try {
      const response = await httpClient.put(
        `${endpoints.ME}/${user_id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    } catch (error) {
      console.log("me:", error);
    }
  },

  getMyData: async () => {
    try {
      const response = await httpClient.get(endpoints.ME);
      return response;
    } catch (error) {
      console.log("getMyData:", error);
    }
  },
};
