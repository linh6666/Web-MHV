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
  const response = await api.post(API_ROUTE. CREATE_ATTRIBUTES, payload); // ✅ dùng đúng key từ object
  return response.data;
};

export const deleteUserManagement = async (userId: string) => {
  try {
    const url = API_ROUTE.DELETE_ATTRIBUTES.replace("{attribute_id}", userId);
    console.log("Đang gửi DELETE tới:", url); // kiểm tra trước khi gửi
    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá người dùng:", error);
    throw error;
  }
};
