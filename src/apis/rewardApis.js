/**
 * Rewards APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const rewardsApis = {
  getAllRewards: async ({ user_id }) => {
    try {
      const response = await httpClient.get(`${endpoints.REWARDS}/${user_id}`);
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
