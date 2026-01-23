"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apiLighting";
import { createON  } from "../../../api/apiON"; 
import { createOFF  } from "../../../api/apiOFF"; // ✅ Gọi đúng file API

// 🧩 Kiểu prop nhận vào
interface MenuProps {
  project_id: string | null;
}

// 🧩 Kiểu dữ liệu item trong menu
interface MenuItem {
  id: number;
  label: string;
}

export default function Menu({ project_id }: MenuProps) {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
   const [active, setActive] = useState<"on" | "off" | null>(null);
    const [loadingOn, setLoadingOn] = useState(false);

  // 🧩 Khởi tạo danh sách menu (cứng 5 nút)
  useEffect(() => {
    setMenuItems([
      { id: 1, label: "Hiệu ứng ánh sáng 1" },
      { id: 2, label: "Hiệu ứng ánh sáng 2" },
      { id: 3, label: "Hiệu ứng ánh sáng 3" },
      { id: 4, label: "Hiệu ứng ánh sáng 4" },
      { id: 5, label: "Hiệu ứng ánh sáng 5" },
    ]);
  }, []);

  // 🧭 Quay lại trang điều khiển
  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra?id=${project_id}`);
  };

  // 🧠 Khi nhấp nút — gọi API
  const handleClick = async (id: number, label: string) => {
    if (!project_id) {
      console.warn("⚠️ Không có project_id để gọi API.");
      return;
    }

    try {
      const body = { project_id };
      const response = await createNodeAttribute(body, {
        type_control: "eff",
        value: 1,
        rs: 0,
        id: id,
      });

      console.log(`✅ Đã gửi hiệu ứng ${label} (ID: ${id})`, response);
    } catch (error) {
      console.error(`❌ Lỗi khi gọi hiệu ứng ${label}:`, error);
    }
  };

   const handleClickOn = async () => {
      if (!project_id) return;
      setActive("on");
      setLoadingOn(true);
      try {
        const res = await createON({ project_id });
        console.log("✅ API ON result:", res);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API ON:", err);
      } finally {
        setLoadingOn(false);
      }
    };
     const handleClickOFF = async () => {
      if (!project_id) return;
      setActive("off");
      setLoadingOn(true);
      try {
        const res = await createOFF({ project_id });
        console.log("✅ API ON result:", res);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API ON:", err);
      } finally {
        setLoadingOn(false);
      }
    };
  const getButtonStyle = (isActive: boolean) => ({
    width: 90,
    height: 30,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    transition: "background 0.3s",
    background: isActive ? "#C2923F" : "#234374",
    color: isActive ? "#12223B" : "#EEEEEE",
      border: isActive
    ? "1.5px solid #C2923F"
    : "1.5px solid #EEEEEE",
  });


  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          className={styles.imgea}
        />
      </div>

      {/* Tiêu đề */}
      <div className={styles.title}>
        <h1>HIỆU ỨNG</h1>
      </div>

      {/* Các nút chức năng */}
      <div className={styles.Function}>
        {menuItems.length > 0 ? (
          <Stack align="center" style={{ gap: "20px", marginTop: "30px" }}>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                id={`menu-btn-${item.id}`}
                className={styles.menuBtn}
                variant="outline"
                onClick={() => handleClick(item.id, item.label)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Text mt="md" c="dimmed">
            Không có dữ liệu hiển thị
          </Text>
        )}
      </div>

      {/* Nút quay lại */}
      <div className={styles.footer}>
       < Stack align="center" gap="xs">
                
                          <Group gap="xs" wrap="nowrap" align="center">
  <Button
    style={getButtonStyle(active === "on")}
    onClick={() =>
      active !== "on" ? handleClickOn() : setActive(null)
    }
  >
    <Text size="11px">BẬT TẤT CẢ</Text>
  </Button>

  <Button
    style={getButtonStyle(active === "off")}
    onClick={() =>
      active !== "off" ? handleClickOFF() : setActive(null)
    }
  >
    <Text size="11px">TẮT TẤT CẢ</Text>
  </Button>

 
</Group>
        
                    {/* Nút quay lại */}
                  <Button
                    onClick={handleBack}
                    variant="filled"
                    style={{
                      width: 30,
                      height: 30,
                      padding: 0,
                      borderRadius: 40,
                      background: "#234374",
                      border: "1.5px solid #EEEEEE",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconArrowLeft size={18} color="#EEEEEE" />
                  </Button>
             
                </Stack>
      </div>
    </div>
  );
}
