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
  // Tạo URL động và thêm tham số vào query parameters
  let url = API_ROUTE.CREATE_IMG_DETAIL_HOME
    .replace("{project_id}", projectId)
    .replace("{unit_code}", unitCode);

  const queryParams = new URLSearchParams();
  if (payload.description_vi) {
    // Thử gửi đồng thời vào nhiều field name phổ biến để backend nhận diện
    queryParams.append("description_vi", payload.description_vi);
    queryParams.append("name_vi", payload.description_vi);
  }

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  console.log("👉 FINAL API URL:", url);

  // Khởi tạo FormData
  const formData = new FormData();

  // Append file: file_1, file_2, ...
  payload.files.forEach((file, index) => {
    formData.append(`file_${index + 1}`, file);
  });

  // Append metadata vào FormData (để backup)
  if (payload.description_vi) {
    formData.append("description_vi", payload.description_vi);
    formData.append("name_vi", payload.description_vi);
    formData.append("description_en", payload.description_vi);
    formData.append("name_en", payload.description_vi);
  }

  // Gửi request sử dụng PUT
  const response = await api.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
