import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListhomeParams {
  project_id: string;
  unit_code: string;
}

export const Getlisthome = async ({ project_id, unit_code }: GetListhomeParams) => {
  // Thay thế cả project_id và unit_code trong URL
  let url = API_ROUTE.GET_LIST_DETAIL_HOME
    .replace("{project_id}", project_id)
    .replace("{unit_code}", unit_code);

  const response = await api.get(url);
  return response.data; // trả về dữ liệu để component dùng
};
