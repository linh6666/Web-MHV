import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // object chứa hằng số

export interface UpdateRequestPayload {
   status: "" | "pending" | "approved" | "rejected"; // ✅ thêm "" vào type
               
}

// Hàm update request theo project_id và request_id
export const updateRequest = async (
  project_id: string,
  request_id: string,
  payload: UpdateRequestPayload
) => {
  // ✅ tạo URL động từ project_id và request_id
  const url = API_ROUTE.UPDATE_REQUEST.replace("{project_id}", project_id)
                                      .replace("{request_id}", request_id);

  const response = await api.put(url, payload); // PUT vì update
  return response.data;
};
