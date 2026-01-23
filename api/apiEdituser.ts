import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  email: string;
 system_id: string;

  is_active: boolean;
  // is_superuser: boolean;
  //  area_id: string,
  
      // introducer_id: string,
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_USERNAME, payload); // ✅ dùng đúng key từ object
  return response.data;
};