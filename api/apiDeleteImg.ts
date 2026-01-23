import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const deleteImg = async (
  projectId: string,
  detalId: string
) => {
  try {
    const url = API_ROUTE.Delete_IMG
      .replace("{project_id}", projectId)
      .replace("{detal_id}", detalId);

    console.log("Đang gửi DELETE tới:", url);

    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
    throw error;
  }
};
