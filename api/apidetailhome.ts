import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

/* ==========================
   📌 Interface & Type
========================== */
export interface GetDetailHomeParams {
  token: string;
  project_id: string;
  leaf_id: string;
}

export interface CreateUserPayload {
  
  // describe_vi: string;
  bathroom:string;
  bedroom:string;
  direction:string;
 balcony_direction:string;
//  main_door_direction:string;

}

/* ==========================
   📌 GET chi tiết Home
========================== */
export const getListdetailhome = async ({
  token,
  project_id,
  leaf_id,
}: GetDetailHomeParams) => {
  const url = API_ROUTE.GET_DETAILE_HOME
    .replace("{project_id}", project_id)
    .replace("{leaf_id}", leaf_id);

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* ==========================
   📌 EDIT chi tiết Home
========================== */
export const EditHome = async (
  token: string,
  project_id: string,
  leaf_id: string,
  payload: CreateUserPayload
) => {
  const url = API_ROUTE.EDIT_DETAILE_HOME
    .replace("{project_id}", project_id)
    .replace("{leaf_id}", leaf_id);

  const response = await api.put(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* ==========================
   📌 Export chung
========================== */
export const rolesApi = {
  getListdetailhome,
  EditHome,
};

export default rolesApi;

