import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const getListCustomer = async (
  projectId: string,
  skip: number = 0,
  limit: number = 100,
  options?: {
    token?: string;
  }
) => {
  const url = API_ROUTE.GET_LIST_CUSTOMER;

  const response = await api.get(url, {
    params: {
      skip,
      limit,
      project_id: projectId,
    },
    headers: {
      Authorization: options?.token ? `Bearer ${options.token}` : undefined,
    },
  });

  return {
    items: response.data.data,
    total: response.data.count,
  };
};