/**
 * Users APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { sortList } from "../utils/CommonUtils";
import { RECORDS_PER_PAGE } from "../constants";

export const userApis = {
  getAllUsers: async ({
    includeSelf,
    page,
    limit = RECORDS_PER_PAGE,
    q,
  } = {}) => {
    try {
      const resp = await httpClient.get(endpoints.USERS, {
        params: { includeSelf, page, limit, q },
      });
      return resp?.data?.data?.users
        ? {
            users: sortList(resp?.data?.data?.users, "firstName", "lastName"),
            data: resp?.data?.data,
          }
        : {};
    } catch (error) {}
  },

  createUser: async (payload) => {
    try {
      const resp = await httpClient.post(endpoints.USERS, payload);
      return resp;
    } catch (error) {}
  },

  getUserById: async ({ user_id }) => {
    try {
      const resp = await httpClient.get(`${endpoints.USERS}/${user_id}`);
      return resp;
    } catch (error) {}
  },

  updateUserById: async ({ user_id, payload }) => {
    try {
      const resp = await httpClient.put(
        `${endpoints.USERS}/${user_id}`,
        payload
      );
      return resp;
    } catch (error) {}
  },
};
