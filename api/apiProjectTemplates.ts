import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

// ==========================
// 📌 Interface & Type
// ==========================
export interface GetListRolesParams {
  token: string;
  skip?: number;
  limit?: number;
}

export interface CreateUserPayload {
   type_vi: string;
  //  type_en: string;
  
}


export const getListProjectTemplates = async ({ token, skip, limit }: GetListRolesParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_PROJECTTYPE, {
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

// 🔹 Tạo mới Role
export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_PROJECTTYPE, payload);
  return response.data;
};

export const rolesApi = {
  getListProjectTemplates,
  createUser,
};

export default rolesApi;
export const deleteUserManagement = async (userId: string) => {
  try {
    const url = API_ROUTE.DELETE_PROJECTTYPE.replace("{type_id}", userId);
    console.log("Đang gửi DELETE tới:", url); // kiểm tra trước khi gửi
    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá người dùng:", error);
    throw error;
  }
};
