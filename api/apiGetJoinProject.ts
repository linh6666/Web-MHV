import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListRolesParams {
  token: string;
  
   lang?: string;
}

export const GetJoinProject = async ({
  token,
 
 lang = 'vi',
}: GetListRolesParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_JOINPROJECT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
         lang,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count, // Sửa từ `total` thành `count`
  };
};