/**
 * Auth section APIs
 */

import { endpoints } from "./endpoints";
import { USER_TOKEN, USER_DATA } from "../constants";
import { httpClient, LocalStorageHelper } from "../utils/HttpUtils";

export const authApis = {
  resetPassword: async (payload) => {
    const { inviteCode, ...rest } = payload || {};
    try {
      const resp = await httpClient.post(
        `${endpoints.RESET_PASSWORD}?inviteCode=${inviteCode}`,
        rest
      );
      if (resp?.success) {
        LocalStorageHelper.store(USER_TOKEN, resp?.data?.data?.token);
        LocalStorageHelper.store(USER_DATA, JSON.stringify(resp?.data?.data));
      }
      return resp;
    } catch (error) {}
  },

  login: async (payload) => {
    try {
      const resp = await httpClient.post(endpoints.lOGIN, payload);
      if (resp?.success) {
        LocalStorageHelper.store(USER_TOKEN, resp?.data?.data?.token);
        LocalStorageHelper.store(USER_DATA, JSON.stringify(resp?.data?.data));
      }
      return resp;
    } catch (error) {}
  },

  logout: async () => {
    try {
      LocalStorageHelper.delete(USER_TOKEN);
      LocalStorageHelper.delete(USER_DATA);
      return true;
    } catch (error) {}
  },
};
