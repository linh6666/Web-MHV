import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

// ==========================
// 📌 Interface & Type
// ==========================
export interface GetListRolesParams {
  token: string;
  template_id: string;
  skip?: number;
  limit?: number;
}

export interface CreateUserPayload {

  project_template_id:string;
  attribute_id:string;
  is_required:string;
}

// ==========================
// 📌 Lấy danh sách Project Templates (theo template_id)
// ==========================
export const getListTemplateAttributesLink = async ({
  token,
  template_id,
  skip,
  limit,
}: GetListRolesParams) => {
  // ✅ Thay thế {template_id} trong URL
  const url = API_ROUTE.GET_LIST_TEMPLATEATTRIBUTESLINK.replace(
    "{template_id}",
    template_id
  );

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip,
      limit,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count,
  };
};

// ==========================
// 📌 Tạo mới Role
// ==========================
export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_TEMPLATEATTRIBUTESLINK, payload);
  return response.data;
};

// ==========================
// 📌 Xoá Template
// ==========================
export const deleteUserManagement = async (userId: string) => {
  try {
    const url = API_ROUTE.DELETE_TEMPLATEATTRIBUTESLINK.replace("{link_id}", userId);
    console.log("Đang gửi DELETE tới:", url);
    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá người dùng:", error);
    throw error;
  }
};

// ==========================
// 📌 Export chung
// ==========================
export const rolesApi = {
  getListTemplateAttributesLink,
  createUser,
};

export default rolesApi;
