import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export interface GetListhomeParams {
  node_attribute_id?: string;
  project_id?: string;
  unit_code?: string;
  leaf_id?: string;
}

export const Getlisthome = async (params: GetListhomeParams) => {
  const { node_attribute_id, project_id, unit_code, leaf_id } = params;
  let url = "";

  if (leaf_id || node_attribute_id) {
    const id = leaf_id || node_attribute_id;
    url = `${API_ROUTE.GET_LIST_DETAIL_HOME_NEW}?node_attribute_id=${id}&project_id=${project_id || ''}`;
  } else if (project_id && unit_code) {
    url = API_ROUTE.GET_LIST_DETAIL_HOME
      .replace("{project_id}", project_id)
      .replace("{unit_code}", unit_code);
  } else {
    console.warn("Getlisthome: Missing required parameters");
    return [];
  }

  const response = await api.get(url);
  
  // Normalize response to return an array of items
  const data = response.data;
  if (Array.isArray(data)) return data;
  return data?.results || data?.data || data?.items || [];
};
