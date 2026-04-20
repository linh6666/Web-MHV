import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateContactPayload {
  project_id: string;
  node_attribute_id: string;
  topic: string;
  message: string;
}


export const createContact = async (payload: CreateContactPayload) => {
  const response = await api.post(API_ROUTE.CREATE_CONTRACT, payload);
  return response.data;
};