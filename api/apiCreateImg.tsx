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
  leafId: string,
  payload: CreateImgPayload
) => {
  // Tạo URL động với query parameters
  const url = `${API_ROUTE.CREATE_IMG_DETAIL_HOME_NEW}?project_id=${projectId}&node_attribute_id=${leafId}`;

  console.log("👉 FINAL API URL:", url);

  // Khởi tạo FormData
  const formData = new FormData();

  const mediaMetadata: any[] = [];

  // Append file array
  payload.files.forEach((file) => {
    formData.append("files", file);
    
    // Thêm metadata cho từng file với trường bắt buộc là filename
    mediaMetadata.push({
      filename: file.name,
      description_vi: payload.description_vi || "",
    });
  });

  // Gửi metadata dạng JSON chuỗi
  formData.append("media_metadata", JSON.stringify(mediaMetadata));

  // Gửi request sử dụng POST theo như screenshot Postman
  const response = await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
