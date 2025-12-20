import { BASE_API_FASTAPI } from "../config";
import { API_ROUTE } from "../const/apiRouter"; // Đảm bảo đã khai báo SENDEMAIL

export async function sendPasswordResetEmail(email: string) {
  const res = await fetch(`${BASE_API_FASTAPI}${API_ROUTE.SENDEMAIL.replace('{email}', encodeURIComponent(email))}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }), // Vẫn gửi email trong payload nếu cần
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to send password reset email");
  }

  const data = await res.json();
  return data; // Trả về dữ liệu từ phản hồi
}