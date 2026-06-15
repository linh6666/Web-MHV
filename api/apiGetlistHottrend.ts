import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface GetListHottrendParams {
  metric_name?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
}

export const getListHottrend = async (projectId: string, params?: GetListHottrendParams) => {
  const url = API_ROUTE.GET_LIST_HOT_TREND.replace("{project_id}", projectId);

  const response = await api.get(url, { params });

  return response.data;
};
