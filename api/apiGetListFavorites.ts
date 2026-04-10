import { api } from '../libray/axios';
import { API_ROUTE } from '../const/apiRouter';

export const getListFavorites = async (project_id: string) => {
  const url = API_ROUTE.GET_LIST_FAVORITES.replace(
    '{project_id}',
    project_id
  );

  const response = await api.get(url);

  return {
    data: response.data.data,
    total: response.data.count,
  };
};