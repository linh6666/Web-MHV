// /api/userApi.ts
import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
 full_name: string;
    phone: string;
    province_id: string;
    ward_id: string;
    introducer_id: string;
    detal_address: string;



}

export const Editme = async (payload: CreateUserPayload) => {
  const response = await api.patch(API_ROUTE. UPDATE_ME, payload); // ✅ dùng đúng key từ object
  return response.data;
};
