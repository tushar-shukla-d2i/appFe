/**
 * Rewards APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const rewardsApis = {
  assignReward: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.REWARDS, payload);
      return response;
    } catch (error) {
      console.log("assignReward:", error);
    }
  },
};
