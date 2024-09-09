/**
 * Users APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { sortList } from "../utils/CommonUtils";

export const userApis = {
  getAllUsers: async ({ includeSelf } = {}) => {
    try {
      let url = endpoints.USERS;
      if (includeSelf) {
        url += `?includeSelf=true`;
      }
      const resp = await httpClient.get(url);
      return resp?.data?.data
        ? sortList(resp?.data?.data, "firstName", "lastName")
        : [];
    } catch (error) {
      console.log("getAllUsers:", error);
    }
  },

  createUser: async (payload) => {
    try {
      const resp = await httpClient.post(endpoints.USERS, payload);
      return resp;
    } catch (error) {
      console.log("createUser:", error);
    }
  },

  getUserById: async ({ user_id }) => {
    try {
      const resp = await httpClient.get(`${endpoints.USERS}/${user_id}`);
      return resp;
    } catch (error) {
      console.log("getUserById:", error);
    }
  },

  updateUserById: async ({ user_id, payload }) => {
    try {
      const resp = await httpClient.put(
        `${endpoints.USERS}/${user_id}`,
        payload
      );
      return resp;
    } catch (error) {
      console.log("updateUserById:", error);
    }
  },
};
