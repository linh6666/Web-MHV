import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const deleteImg = async (

  detalId: string
) => {
  try {
    const url = API_ROUTE.DELETE_IMG_DETAIL_HOME_NEW
      .replace("{media_id}", detalId);

    console.log("Đang gửi DELETE tới:", url);

    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
    throw error;
  }
};
