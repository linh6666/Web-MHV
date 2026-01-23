// /api/userApi.ts
import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  id:string;
 name_vi:string;
timeout_minutes:string;
  


 
}

export const createUser = async (payload: FormData) => {
  const response = await api.post(API_ROUTE.CREATE_PROJECTS, payload, {
    headers: {
      "Content-Type": "multipart/form-data", // cần để server nhận file
    },
  });
  return response.data;
};