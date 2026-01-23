import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

// ==========================
// 📌 Interface & Type
// ==========================
export interface CreateProjectTemplatePayload {
  project_id: string;
  attribute_id: string;
//   parent_node_attributes_id: string;
  values: { value: string }[];
}

// ==========================
// 📌 API: Tạo Project Template Node Attribute
// ==========================
export const createProjectTemplate = async (payload: CreateProjectTemplatePayload) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";

    console.log("🔹 Gửi dữ liệu tạo Project Template:", payload);

    const response = await api.post(API_ROUTE.CREATE_NODEATTRIBUTE, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Kết quả API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API tạo Project Template:", error);
    throw error;
  }
};
