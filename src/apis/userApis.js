/**
 * Users APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const userApis = {
  getAllUsers: async ({ includeSelf } = {}) => {
    try {
      let url = endpoints.USERS;
      if (includeSelf) {
        url += `?includeSelf=true`;
      }
      const response = await httpClient.get(url);
      return response?.data?.data || [];
    } catch (error) {
      console.log("getAllUsers:", error);
    }
  },

  createUser: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.USERS, payload);
      return response;
    } catch (error) {
      console.log("createUser:", error);
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
