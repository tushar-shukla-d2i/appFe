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

  me: async (payload) => {
    try {
      const response = await httpClient.put(endpoints.ME, payload);
      return response;
    } catch (error) {
      console.log("me:", error);
    }
  },
};
