import { api } from "../libray/axios"; // sửa "libray" thành "library"
import { API_ROUTE } from "../const/apiRouter";

export const getWardsByProvince = async (provinceCode: string) => {
  const url = `${API_ROUTE.GET_LIST_ADDRESS_DEATIL}/${provinceCode}/wards`;
  const response = await api.get(url);
  return response.data; // giả sử trả về mảng phường/xã
};