import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_API_FASTAPI } from "../config";
import { disconnectSocket } from "../services/socket";

const handleAuthLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    try {
      disconnectSocket();
    } catch (e) {
      console.error("Error disconnecting socket:", e);
    }
    if (window.location.pathname !== "/" && window.location.pathname !== "/dang-nhap") {
      window.location.href = "/";
    }
  }
};

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

      if (error.response?.status === 401) {
        if (!originalRequest?._retry) {
          originalRequest._retry = true; // tránh vòng lặp vô hạn

          // Gọi API refresh token nếu có
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
          if (refreshToken) {
            try {
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
              handleAuthLogout();
              return Promise.reject(refreshError);
            }
          }
        }

        // Không có refresh token hoặc refresh thất bại hoặc retry vẫn 401
        handleAuthLogout();
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiInstance(BASE_API_FASTAPI || "");


export { api };