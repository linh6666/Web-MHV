// /api/userApi.ts
import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
 label: string;
  data_type: string;
  parent_attributes_id: string | null;
  display_label_vi: string;
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_ATTRIBUTES, payload); // ✅ dùng đúng key từ object
  return response.data;
};
