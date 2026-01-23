
import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListRolesParams {
  token: string;
  skip?: number;
  limit?: number;
}

export const getListRoles = async ({
  token,
  skip,
  limit,
}: GetListRolesParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_ROLES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip,
      limit,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count, 
  };
};
