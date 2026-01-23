import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListProjectParams {
  token: string;
  project_id: string; // thêm project_id bắt buộc
  skip?: number;
  limit?: number;
  lang?: string;
}

export const GetJoinProject = async ({
  token,
  project_id,
  skip ,
  limit ,
  lang = 'vi',
}: GetListProjectParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_REQUESTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      project_id, // thêm project_id vào params
      skip,
      limit,
      lang,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count, // giữ nguyên count
  };
};
