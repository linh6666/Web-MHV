import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export const getListActiveUsers = async () => {
  const response = await api.get(API_ROUTE.GET_ACTIVE_USERS);

  return {
    data: response.data.data,
    total: response.data.count,
  };
};