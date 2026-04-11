import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface UpdateOrderPaymentPayload {
    status: "pending" | "approved" | "rejected" | "expired";
    note?: string;
}

export const updateOrderPayment = async (
    order_payment_id: string,
    project_id: string | null,
    payload: UpdateOrderPaymentPayload
) => {
    const url = API_ROUTE.UPDATE_ODER_PAYMENT.replace("{order_payment_id}", order_payment_id);

    const response = await api.put(url, payload, {
        params: {
            project_id: project_id,
        },
    });
    return response.data;
};
