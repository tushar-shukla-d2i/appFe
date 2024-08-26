/**
 * Rewards APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const rewardsApis = {
  getAllRewards: async () => {
    try {
      const response = await httpClient.get(endpoints.REWARDS);
      return response;
    } catch (error) {
      console.log("getAllRewards:", error);
    }
  },

  assignReward: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.REWARDS, payload);
      return response;
    } catch (error) {
      console.log("assignReward:", error);
    }
  },
};
