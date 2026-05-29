import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const getListanalysis= async (projectId: string) => {
    const url = API_ROUTE.GET_LIST_DEVICE_DETAIL.replace(
        "{project_id}",
        projectId
    );

    const response = await api.get(url);

    return response.data;
};

export const getListOrder = getListanalysis;