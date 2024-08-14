/**
 * Users APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const userApis = {
  getAllUsers: async () => {
    try {
      const response = await httpClient.get(endpoints.USERS);
      return response;
    } catch (error) {
      console.log("getAllUsers:", error);
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await httpClient.get(`${endpoints.GET_USER}/${userId}`);
      return response;
    } catch (error) {
      console.log("getUserById:", error);
    }
  },
};
