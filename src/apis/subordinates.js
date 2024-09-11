/**
 * Subordinates APIs
 */

import { endpoints } from "./endpoints";
import { sortList } from "../utils/CommonUtils";
import { httpClient } from "../utils/HttpUtils";

export const subordinatesApis = {
  getSubordinates: async () => {
    try {
      const resp = await httpClient.get(endpoints.SUBORDINATES);
      return resp?.data?.data
        ? sortList(resp?.data?.data, "firstName", "lastName")
        : [];
    } catch (error) {
      console.log("getSubordinates:", error);
    }
  },
};
