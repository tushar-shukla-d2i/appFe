/**
 * Subordinates APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const subordinatesApis = {
  getSubordinates: async () => {
    try {
      const resp = await httpClient.get(endpoints.SUBORDINATES);
      return resp;
    } catch (error) {
      console.log("getSubordinates:", error);
    }
  },
};
