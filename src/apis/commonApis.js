/**
 * Common APIs
 */

import { endpoints } from "./endpoints";
import { USER_DATA } from "../constants";
import { httpClient, LocalStorageHelper } from "../utils/HttpUtils";

export const commonApis = {
  lookups: async () => {
    try {
      const resp = await httpClient.get(endpoints.LOOKUPS);
      return resp;
    } catch (error) {
      console.log("lookups:", error);
    }
  },

  me: async ({ user_id, payload }) => {
    try {
      const resp = await httpClient.put(`${endpoints.ME}/${user_id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (resp?.success) {
        LocalStorageHelper.store(USER_DATA, JSON.stringify(resp?.data?.data));
      }
      return resp;
    } catch (error) {
      console.log("me:", error);
    }
  },

  getMyData: async () => {
    try {
      const resp = await httpClient.get(endpoints.ME);
      return resp;
    } catch (error) {
      console.log("getMyData:", error);
    }
  },
};
