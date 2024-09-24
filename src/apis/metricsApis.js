/**
 * Metrics APIs
 */

import { sortList } from "../utils";
import { endpoints } from "./endpoints";
import { httpClient } from "../utils/HttpUtils";
import { RECORDS_PER_PAGE } from "../constants";

export const metricsApis = {
  getAllMetrics: async ({ metric_id, page, limit = RECORDS_PER_PAGE, q }) => {
    try {
      let url = endpoints.METRICS;
      if (metric_id) {
        url += `/${metric_id}`;
      }
      const resp = await httpClient.get(url, {
        params: { page, limit, q },
      });
      const hasData = resp?.data?.data;
      return hasData
        ? {
            metrics: sortList(hasData?.metrics, "label"),
            data: {
              ...hasData,
              sub_metrics: sortList(hasData?.sub_metrics, "label"),
            },
          }
        : {};
    } catch (error) {}
  },

  createMetric: async (payload) => {
    try {
      const response = await httpClient.post(endpoints.METRICS, payload);
      return response;
    } catch (error) {}
  },

  updateMetric: async ({ metric_id, payload }) => {
    try {
      const response = await httpClient.put(
        `${endpoints.METRICS}/${metric_id}`,
        payload
      );
      return response;
    } catch (error) {}
  },
};
