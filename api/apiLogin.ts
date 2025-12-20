import { BASE_API_FASTAPI } from "../config";
import { API_ROUTE } from "../const/apiRouter";// Đảm bảo import API_ROUTE

export async function loginUser(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password"); // ✅ cần cho chuẩn OAuth2

  const res = await fetch(`${BASE_API_FASTAPI}${API_ROUTE.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(), // ✅ gửi đúng định dạng
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await res.json();

  // ✅ Lưu access_token vào localStorage
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  return data; // Vẫn trả data nếu bạn muốn dùng thêm
}

