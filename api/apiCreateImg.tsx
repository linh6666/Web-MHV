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

  console.log("👉 CREATE IMG URL:", url);
  console.log("👉 PAYLOAD RECEIVED:", payload);

  // Khởi tạo FormData
  const formData = new FormData();

  // Append file: file_1, file_2, ...
  payload.files.forEach((file, index) => {
    console.log(`👉 Append file_${index + 1}:`, file.name);
    formData.append(`file_${index + 1}`, file);
  });

  // Append description_vi
  if (payload.description_vi) {
    console.log("👉 Append description_vi:", payload.description_vi);
    formData.append("description_vi", payload.description_vi);
  } else {
    console.warn("⚠️ description_vi is EMPTY or UNDEFINED");
  }

  // Log toàn bộ FormData (rất quan trọng)
  console.log("👉 FORM DATA CONTENT:");
  for (const pair of formData.entries()) {
    console.log(`   ${pair[0]}:`, pair[1]);
  }

  // Gửi request
  const response = await api.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("👉 API RESPONSE:", response.data);

  return response.data;
};
