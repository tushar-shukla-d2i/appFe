/**
 * Auth section APIs
 */

import { endpoints } from "./endpoints";
import { TOKEN, USER_DATA } from "../constants";
import { httpClient, LocalStorageHelper } from "../utils/HttpUtils";

export const authApis = {
  signup: async (payload) => {
    try {
      const resp = await httpClient.post(endpoints.SIGNUP, payload);
      if (resp?.success) {
        LocalStorageHelper.store(TOKEN, resp?.data?.data?.token);
        LocalStorageHelper.store(USER_DATA, JSON.stringify(resp?.data?.data));
      }
      return resp;
    } catch (error) {
      console.log("Error signup:-", error);
    }
  },

  login: async (payload) => {
    try {
      const resp = await httpClient.post(endpoints.lOGIN, payload);
      if (resp?.success) {
        LocalStorageHelper.store(TOKEN, resp?.data?.data?.token);
        LocalStorageHelper.store(USER_DATA, JSON.stringify(resp?.data?.data));
      }
      return resp;
    } catch (error) {
      console.log("Error login:-", error);
    }
  },

  logout: async () => {
    try {
      LocalStorageHelper.delete(TOKEN);
      LocalStorageHelper.delete(USER_DATA);
      return true;
    } catch (error) {
      console.log("Error logout:-", error);
    }
  },
};
