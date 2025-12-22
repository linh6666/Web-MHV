import { BASE_API_FASTAPI } from "../config";
import { API_ROUTE } from "../const/apiRouter";


export async function getUserInfo(token: string) { // Đặt kiểu cho token là string
  const res = await fetch(`${BASE_API_FASTAPI}${API_ROUTE.LOGIN_USERNAME}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch user info");
  }

  const data = await res.json();
  return data;
}


