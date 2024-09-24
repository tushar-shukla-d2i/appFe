/**
 * Rewards APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { RECORDS_PER_PAGE } from "../constants";

export const rewardsApis = {
  getAllRewards: async ({ user_id, page, limit = RECORDS_PER_PAGE, q }) => {
    try {
      const resp = await httpClient.get(`${endpoints.REWARDS}/${user_id}`, {
        params: { q, page, limit },
      });
      return resp?.data?.data
        ? { rewards: resp?.data?.data?.rewards || [], data: resp?.data?.data }
        : {};
    } catch (error) {}
  },

  assignReward: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.REWARDS, payload);
      return response;
    } catch (error) {}
  },
};
