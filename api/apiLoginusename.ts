import { BASE_API_FASTAPI } from "../config";
import { API_ROUTE } from "../const/apiRouter";

export async function getUserInfo(token: string) {
  const res = await fetch(`${BASE_API_FASTAPI}${API_ROUTE.LOGIN_USERNAME}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 🚨 QUAN TRỌNG NHẤT
  if (!res.ok) {
    // Token sai / hết hạn / chưa login
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("access_token");
    window.location.replace("/");
    return null; // 👈 báo cho useAuth biết là chưa login
  }

    // Lỗi hệ thống thật sự
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch user info"); // hạn chế dùng Throw vì nó sẽ ngắt luôn luồng xử lý ở sau
    // return
  }

  const data = await res.json();
  return data;
}



