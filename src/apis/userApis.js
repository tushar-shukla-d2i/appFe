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

  getUserById: async ({ user_id }) => {
    try {
      const response = await httpClient.get(`${endpoints.USERS}/${user_id}`);
      return response;
    } catch (error) {
      console.log("getUserById:", error);
    }
  },

  updateUserById: async ({ user_id, payload }) => {
    try {
      const response = await httpClient.put(
        `${endpoints.USERS}/${user_id}`,
        payload
      );
      return response;
    } catch (error) {
      console.log("updateUserById:", error);
    }
  },
};
