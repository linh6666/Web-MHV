import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

interface GetListMappingParams {
  token?: string;
  project_id: string;
}

export const getListMapping = async ({
  token,
  project_id,
}: GetListMappingParams) => {

  const url = API_ROUTE.GET_LIST_MAPPING.replace(
    "{project_id}",
    project_id
  );

  const response = await api.get(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return {
    data: response.data.data,
    total: response.data.count,
  };
};