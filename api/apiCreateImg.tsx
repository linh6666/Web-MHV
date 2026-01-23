import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

/* =======================
   PAYLOAD
======================= */
export interface CreateImgPayload {
  files: File[]; // ✅ mảng file thay vì 1 file
}

/* =======================
   API CALL
======================= */
export const createImg = async (
  projectId: string,
  unitCode: string,
  payload: { files: File[] }
) => {
  const url = API_ROUTE.CREATE_IMG_DETAIL_HOME
    .replace("{project_id}", projectId)
    .replace("{unit_code}", unitCode);

  const formData = new FormData();

  // ✅ append đúng format: file_1, file_2, ...
  payload.files.forEach((file, index) => {
    formData.append(`file_${index + 1}`, file);
  });

  const response = await api.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
