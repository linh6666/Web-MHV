import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

/* =======================
   PAYLOAD
======================= */
export interface CreateImgPayload {
  files: File[];            // mảng file upload
  description_vi?: string;  // mô tả tiếng Việt
}

/* =======================
   API CALL
======================= */
export const createImg = async (
  projectId: string,
  unitCode: string,
  payload: CreateImgPayload
) => {
  // Tạo URL động
  const url = API_ROUTE.CREATE_IMG_DETAIL_HOME
    .replace("{project_id}", projectId)
    .replace("{unit_code}", unitCode);

  console.log("👉 FINAL API URL:", url);

  // Khởi tạo FormData
  const formData = new FormData();

  // Append file và metadata tương ứng theo index (file_1, description_vi_1, ...)
  payload.files.forEach((file, index) => {
    const fileIndex = index + 1;
    console.log(`👉 Appending file_${fileIndex} and its metadata...`);
    
    formData.append(`file_${fileIndex}`, file);
    
    if (payload.description_vi) {
      formData.append(`description_vi_${fileIndex}`, payload.description_vi);
    }
  });

  // Gửi request sử dụng PUT (trả về PUT do 405 Method Not Allowed với POST)
  const response = await api.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
