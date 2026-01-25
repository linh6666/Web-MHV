import { useState, useEffect } from "react";
import { loginUser } from "../api/apiLogin";
import { getUserInfo } from "../api/apiLoginusename";

interface User {
  full_name: string;
  email: string;
  system_rank?: number;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Lấy thông tin user từ token
  const getUser = async (token: string) => {
    try {
      const fetchedUser = await getUserInfo(token);

      // ✅ CHƯA LOGIN / TOKEN HẾT HẠN → KHÔNG PHẢI LỖI
      if (!fetchedUser) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      // ✅ LOGIN THÀNH CÔNG
      setUser(fetchedUser);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      // ❌ Chỉ log lỗi hệ thống thật sự
      console.error("Fetch user error:", err);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // 🔹 Check token khi app load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getUser(token);
    }
  }, []);

  // 🔹 Login
  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem("access_token", access_token);

      // 👉 Lấy user ngay sau khi login
      await getUser(access_token);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed.");
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    error,
  };
};

export default useAuth;
