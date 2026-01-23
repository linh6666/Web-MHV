import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  name: string;
  rank_total: string;
    description_vi: string;
    // description_en: string;
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_SYSTEM, payload); // ✅ dùng đúng key từ object
  return response.data;
};