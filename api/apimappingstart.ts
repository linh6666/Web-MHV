import { api } from "../libray/axios";

interface StartProjectionParams {
  project_id: string;
  script_id: string;
  token?: string;
}

export const startProjection = async ({
  project_id,
  script_id,
  token,
}: StartProjectionParams) => {
  const url =
    "/api/v1/node_attribute/filter?type_control=mapping&value=1&rs=0";

  const response = await api.post(
    url,
    {
      project_id: project_id,
      script_id: script_id,
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  return response.data;
};