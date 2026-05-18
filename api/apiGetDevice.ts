import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';
import { GetListRolesParams } from './apiUserProjectRole';

interface GetListDeviceParams {
  token: string;
  skip?: number;
  limit?: number;
   lang?: string;
}

export const getListDevice = async ({
  token,
  skip,
  limit,
 lang = 'vi',
}: GetListDeviceParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_DEVICE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip,
      limit,
         lang,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count, // Sửa từ `total` thành `count`
  };
};