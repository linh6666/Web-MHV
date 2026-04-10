import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateJoinProjectPayload {
  role_id: string;
  request_message: string;
}

export const createJoinProject = async (
  projectId: string,
  payload: CreateJoinProjectPayload
) => {
  const url = API_ROUTE.CREATE_REQUEST.replace(
    "{project_id}",
    projectId
  );

  const response = await api.post(url, payload);
  return response.data;
};
