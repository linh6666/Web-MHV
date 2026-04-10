import { api } from "../libray/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateOrderPayload {
  unit_code: string;
  project_id: string;
  email: string;
  contract_code: string;
  total_price_at_sale_vi: number;
  id_cccd: string;
  file: File;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { file, project_id, ...data } = payload;

  const formData = new FormData();

  // append text field
  formData.append("unit_code", data.unit_code);
  formData.append("email", data.email);
  formData.append("contract_code", data.contract_code);
  formData.append(
    "total_price_at_sale_vi",
    String(data.total_price_at_sale_vi)
  );
  formData.append("id_cccd", data.id_cccd);

  // file upload
  formData.append("file", file);

  // 🔥 replace {project_id} bằng giá trị thật
  const url = API_ROUTE.CREATE_ORDER.replace(
    "{project_id}",
    project_id
  );

  const response = await api.post(url, formData);

  return response.data;
};