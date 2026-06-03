import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export const getListActiveUsers = async () => {
  const response = await api.get(API_ROUTE.GET_ACTIVE_USERS);

  // Nếu API trả về trực tiếp một số (ví dụ: 1) đại diện cho số lượng user online
  if (typeof response.data === "number") {
    return {
      data: [],
      total: response.data,
    };
  }

  // Nếu API trả về một object dạng { data: [...], count: X }
  return {
    data: response.data?.data || [],
    total: response.data?.count ?? response.data?.total ?? 0,
  };
};