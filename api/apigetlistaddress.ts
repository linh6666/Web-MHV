import { api } from "../libray/axios"; // Sửa "libray" thành "library" nếu cần
import { API_ROUTE } from "../const/apiRouter";

// Định nghĩa kiểu Province (nếu cần)


// Định nghĩa kiểu cho tham số
interface GetListProvincesParams {
  skip?: number;
  limit?: number;
  // Thay đổi từ Province[] thành string[] nếu bạn chỉ cần id
}

export const getListProvinces = async (params: GetListProvincesParams = {}) => {
  const { skip, limit } = params;

  const response = await api.get(API_ROUTE.GET_LIST_ADDRESS, {
    params: { skip, limit },
  });

 return response.data;
};