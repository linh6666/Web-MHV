import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export const getOrderPaymentByOrderId = async (order_id: string, project_id?: string | null) => {
    // Replace {order_id} in the route string
    const url = API_ROUTE.GET_LIST_ODER_PAYMENT.replace("{order_id}", order_id);

    const response = await api.get(url, {
        params: { project_id }
    });

    return response.data;
}