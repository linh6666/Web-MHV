import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export interface UserStatusDetail {
  user_name: string;
  is_online: boolean;
  status: string;
}

export const getUserStatusDetail = async (email: string): Promise<UserStatusDetail> => {
  const url = API_ROUTE.GET_LIST_DETAIL_USERS.replace("{email}", email);
  const response = await api.get(url);
  return response.data;
};