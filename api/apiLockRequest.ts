import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // object chứa hằng số

export interface UpdateRequestPayload {
  status: "pending" | "approved" | "rejected" | "expired";
  approver_id?: string;
  approver_at?: string;
  response_message_vi?: string;
  response_message_en?: string;
}

// Hàm update request theo project_id và request_id
export const updateRequest = async (
  request_id: string,
  project_id: string | null,
  payload: UpdateRequestPayload
) => {
  // ✅ tạo URL động từ request_id
  const url = API_ROUTE.LOCK_REQUEST.replace("{request_id}", request_id);

  const response = await api.put(url, payload, {
    params: {
      project_id: project_id,
    },
  });
  return response.data;
};
