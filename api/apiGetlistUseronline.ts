import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export interface UserOnline {
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  active_at: number;
}

export interface UserOnlineResponse {
  data: UserOnline[];
  total: number;
  size: number;
  next_cursor: string | null;
  has_more: boolean;
}

export const getListActiveUsers = async (
  size: number = 20,
  cursor?: string | null
): Promise<UserOnlineResponse> => {
  const response = await api.get(API_ROUTE.GET_USER_ONLINE, {
    params: {
      size,
      cursor: cursor || undefined,
    },
  });

  return {
    data: response.data?.users || [],
    total: response.data?.total_online ?? 0,
    size: response.data?.size ?? 20,
    next_cursor: response.data?.next_cursor ?? null,
    has_more: response.data?.has_more ?? false,
  };
};