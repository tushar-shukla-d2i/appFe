/**
 * Metrics APIs
 */

import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";

export const metricsApis = {
  getAllMetrics: async () => {
    try {
      const response = await httpClient.get(endpoints.METRICS);
      return response;
    } catch (error) {
      console.log("getAllMetrics:", error);
    }
  },

  getMetricById: async ({ metric_id }) => {
    try {
      const response = await httpClient.get(
        `${endpoints.METRICS}/${metric_id}`
      );
      return response;
    } catch (error) {
      console.log("getMetricById:", error);
    }
  },
};
