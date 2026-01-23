import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const deleteUserManagement = async (userId: string) => {
  try {
    const url = API_ROUTE. DELETE_PROJECTS.replace("{project_id}", userId);
    console.log("Đang gửi DELETE tới:", url); // kiểm tra trước khi gửi
    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá người dùng:", error);
    throw error;
  }
};
