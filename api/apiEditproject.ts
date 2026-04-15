import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  
  name: string;
  address: string;
  investor: string;
 
overview_image: File | null;


    
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_PROJECTS, payload, {
    headers: {
      "Content-Type": "multipart/form-data", // cần để server nhận file
    },
  }); // ✅ dùng đúng key từ object
  return response.data;
};
