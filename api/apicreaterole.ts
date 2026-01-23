// /api/userApi.ts
import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  name: string;
  rank: number;
description_vi: string;

 
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_ROLES, payload); // ✅ dùng đúng key từ object
  return response.data;
};