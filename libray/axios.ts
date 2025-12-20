import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_API_FASTAPI  } from "../config";

const createApiInstance = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });

  // Thêm interceptor request để tự động gắn token Authorization
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor response xử lý lỗi 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error("API request failed:", error);

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // tránh vòng lặp vô hạn

        // Gọi API refresh token ở đây
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            // Chưa có refresh token -> logout hoặc redirect login
            return Promise.reject(error);
          }

          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const newToken = response.data.access_token;
          localStorage.setItem("access_token", newToken);

          // Cập nhật lại header Authorization với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Thử gọi lại request ban đầu với token mới
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại, logout hoặc redirect login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiInstance(BASE_API_FASTAPI || "");


export { api };