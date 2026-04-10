// /api/userApi.ts
import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateFavoritePayload {
  unit_code: string;
  project_id: string;
}

export const createFavorite = async (payload: CreateFavoritePayload) => {
  const response = await api.post(API_ROUTE.CREATE_FAVORITES, payload);
  return response.data;
};
