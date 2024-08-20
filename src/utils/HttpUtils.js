import axios from "axios";
// import { triggerGlobalNotification } from "../components/GlobalNotification";
import { Config } from "./Config";
import { navigate } from "./CommonUtils";
import { TOKEN } from "../constants";

const LocalStorageHelper = {
  storeUserToken: (user) => {
    const token = user?.token;
    if (token) {
      LocalStorageHelper.store("_auth", token);
    }
    LocalStorageHelper.store(TOKEN, user);
  },
  getUserToken: (fullInfo = false) => {
    const user = LocalStorageHelper.get(TOKEN);
    const token = LocalStorageHelper.get("_auth");
    return fullInfo ? user : token;
  },
  deleteUserToken: () => {
    LocalStorageHelper.delete(TOKEN);
    LocalStorageHelper.delete("_auth");
  },
  store: (key, value) => {
    if (key && value && typeof localStorage !== "undefined") {
      localStorage.setItem(key, btoa(JSON.stringify(value)));
    }
  },
  get: (key) => {
    if (key && typeof localStorage !== "undefined") {
      let value = localStorage.getItem(key);
      try {
        return JSON.parse(atob(value));
      } catch (e) {
        return value || null;
      }
    }
  },
  delete: (key) => {
    if (key && typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

const baseUrl = window.location.host.includes("localhost")
  ? `${Config.LOCAL.BE_BASE_URL}`
  : `${Config.DEV.BE_BASE_URL}`;

const httpClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const contentType = Object.entries(config.headers)?.[1]?.[1];
  // Do something before request is sent
  const token = LocalStorageHelper.getUserToken(TOKEN);
  config.headers["Content-type"] = contentType || `application/json`;
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

const handle401 = () => {
  const token = LocalStorageHelper.getUserToken(TOKEN);
  if (token) {
    // triggerGlobalNotification({
    //     message: "You've been logged out.",
    //     isError: true,
    //     asDialog: true,
    // })
    LocalStorageHelper.deleteUserToken();
    // window.location.href = AllRoutes.Login.route;
  } else {
    // window.location.href = AllRoutes.Login.route;
  }
};

httpClient.interceptors.response.use(
  (response) => {
    const contentDisposition = response?.headers?.["content-disposition"];
    if (contentDisposition && contentDisposition?.includes?.("attachment")) {
      const filename = contentDisposition
        ?.split?.(";")
        ?.find?.((part) => part?.trim()?.startsWith?.("filename"))
        ?.split?.("=")?.[1]
        ?.trim();
      return { data: response.data, filename, success: true };
    }

    return { data: response.data, success: true };
  },
  (error) => {
    const errorResponse = error?.response;
    switch (errorResponse?.status) {
      case 422:
        const errors = errorResponse?.data ?? {};
        const globalError = errors["global"] || null;
        const captcaError = errors["g-recaptcha-response"] || null;
        if (globalError || captcaError) {
          // triggerGlobalNotification({
          //     message: globalError || captcaError,
          //     isError: true,
          //     timeout: 10000,
          // })
        }

        return Promise.resolve({
          success: false,
          errors: errors,
          code: 422,
        });
      case 429:
        return Promise.resolve({
          success: false,
          errors: {
            global:
              errorResponse?.data?.message ||
              "Too many requests, please try after sometime.",
          },
          code: 422,
        });
      case 401:
        handle401();
        return Promise.resolve({
          success: false,
          code: 401,
        });
      case 403:
        // triggerGlobalNotification({
        //     message: "Permission Denied",
        //     isError: true
        // })
        // window.history.go(-1);
        return Promise.resolve({
          success: false,
          code: 403,
        });
      case 404:
        // showGlobalModalNotification({
        //   message: 'Page/Resource you are trying to access, do not exist.',
        //   success: false,
        //   hideTs: 5000,
        //   title: "Error!!"
        // })
        // navigate(AllRoutes.Error404Page.route, { forceReload: true });
        return Promise.resolve({
          success: false,
          code: 404,
        });
      case 500:
        return Promise.reject({
          success: false,
          code: 500,
          message: errorResponse?.data?.details || "",
        });
      default:
        return Promise.resolve({
          success: false,
          code: 500,
        });
      // showGlobalModalNotification({
      //   message: "Something went wrong.",
      //   success: false,
      //   hideTs: 5000,
      //   title: "Error!!"
      // })
    }
    // return Promise.reject(error);
  }
);

export { httpClient, LocalStorageHelper };
