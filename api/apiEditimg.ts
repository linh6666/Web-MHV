import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

/* =======================
   PAYLOAD
======================= */
export interface CreateImgPayload {
  files: File[];
  description_vi?: string;
}

/* =======================
   API CALL
======================= */
export const createImg = async (
  projectId: string, // Có thể giữ tham số này nếu API cũ cần hoặc bỏ qua
  detailid: string,
  payload: { files: File[]; description_vi?: string }
) => {
  // 1. Đưa projectId quay lại URL theo chuẩn API Server
  const url = API_ROUTE.UPDATE_IMG
    .replace("{project_id}", projectId)
    .replace("{detal_id}", detailid);

  const formData = new FormData();

  // 2. Append file với key 'file' thay vì file_1, file_2
  if (payload.files.length > 0) {
    formData.append("file", payload.files[0]);
  }

  // 3. Đưa metadata vào Body thay vì URL
  if (payload.description_vi !== undefined) {
    formData.append("description_vi", payload.description_vi);
  }

  const response = await api.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
