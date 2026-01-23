import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const getListOrder = async (
  projectId: string,
  options?: {
    token?: string;
  }
) => {
  const url = API_ROUTE.GET_LIST_ORDER.replace(
    "{project_id}",
    projectId
  );

  const response = await api.get(url, {
    headers: {
      Authorization: options?.token
        ? `Bearer ${options.token}`
        : undefined,
    },
  });

  return {
      items: response.data.items, // ✅ ĐÚNG
    total: response.data.total, // ✅ ĐÚNG
  };
};