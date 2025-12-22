"use client";

import { useState, useEffect } from "react";
import styles from "./PersonalInformation.module.css";
import {
  IconUser,
  IconCalendar,
  IconLogout,
  IconHeartFilled,
  IconBuildingWarehouse,
  IconList,
  
  IconExchange,
} from "@tabler/icons-react";
import { Loader, Container,  Text } from "@mantine/core";
import { getCurrentUser } from "../../api/apiProfile";
import ProfileInfo from "./Profile";
import  Project from "./Project";
import ResetPasswword from "./ResetPasswword";


interface User {
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  is_superuser:boolean;
area_id:string;
province_id:string;
ward_id:string;
introducer_id:string;
  creation_time: string;
  detal_address:string;

  last_login: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
//   const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "home" | "profile" | "orders" | "bookings" | "membership" | "promotions"| "listcustomer"| "ResetPassword"
  >("profile");

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => console.error("Lỗi khi gọi API:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container size="sm" py="xl" style={{ textAlign: "center" }}>
        <Loader size="lg" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="sm" py="xl">
        <Text c="red" ta="center">
          Không lấy được thông tin user
        </Text>
      </Container>
    );
  }

  // 🧠 Hàm xử lý đăng xuất
 const handleLogout = () => {
  const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
  if (!confirmed) return;

  // ✅ Xóa token trong localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // ✅ Xóa thông tin user trong state
  setUser(null);

  // ✅ Load lại trang về /
  window.location.href = "/";
};

  // ✅ Nội dung main theo tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo user={user} />;
      case "orders":
        return  <h1>xin chào</h1>;
        // <FavoritesList  />
      case "bookings":
        return <Project  />;
      case "membership":
        return <h1>xin chào</h1>;
        // <Warehouse/>
         case "listcustomer":
        return <>xin chào các bạn nhé </>;
          case "ResetPassword":
        return <ResetPasswword />;
      default:
        return <div>Chọn mục từ menu để hiển thị</div>;
    }
  };

  return (
    <div className={styles.Box}>
      {/* Sidebar bên trái */}
      <aside className={styles.sidebar}>
        <nav>
          <ul>
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`${styles.menuItem} ${
                  activeTab === "profile" ? styles.active : ""
                }`}
              >
                <IconUser size={18} /> Tài khoản của bạn
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`${styles.menuItem} ${
                  activeTab === "orders" ? styles.active : ""
                }`}
              >
                <IconHeartFilled size={18} /> Danh sách yêu thích
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`${styles.menuItem} ${
                  activeTab === "bookings" ? styles.active : ""
                }`}
              >
                <IconCalendar size={18} /> Dự án của tôi 
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("membership")}
                className={`${styles.menuItem} ${
                  activeTab === "membership" ? styles.active : ""
                }`}
              >
                <IconBuildingWarehouse size={18} /> Tổng quan bán hàng
              </button>
            </li>
                <li>
              <button
                onClick={() => setActiveTab("listcustomer")}
                className={`${styles.menuItem} ${
                  activeTab === "listcustomer" ? styles.active : ""
                }`}
              >
                <IconList
 size={18} /> Danh sách khách hàng
              </button>
            </li>
                 <li>
              <button
                onClick={() => setActiveTab("ResetPassword")}
                className={`${styles.menuItem} ${
                  activeTab === "ResetPassword" ? styles.active : ""
                }`}
              >
                <IconExchange

 size={18} /> Đổi mật khẩu tài khoản
              </button>
            </li>


            <li>
              <button
                onClick={handleLogout}
                className={`${styles.menuItem} ${styles.logoutBtn}`}
              >
                <IconLogout size={18} /> Đăng xuất
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Nội dung bên phải */}
      <main className={styles.content}>{renderContent()}</main>
    </div>
  );
}

