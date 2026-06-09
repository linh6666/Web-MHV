"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apiLighting";
import { createON } from "../../../api/apiON";
import { createOFF } from "../../../api/apiOFF";

interface MenuProps {
  project_id: string | null;
}

interface MenuItem {
  id: number;
  label: string;
}

export default function Menu({ project_id }: MenuProps) {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState<"on" | "off" | null>(null);
  const [loading, setLoading] = useState<"on" | "off" | null>(null);

  // Khởi tạo menu
  useEffect(() => {
    setMenuItems([
      { id: 1, label: "Hiệu ứng ánh sáng 1" },
      { id: 2, label: "Hiệu ứng ánh sáng 2" },
      { id: 3, label: "Hiệu ứng ánh sáng 3" },
      { id: 4, label: "Hiệu ứng ánh sáng 4" },
      { id: 5, label: "Hiệu ứng ánh sáng 5" },
    ]);
  }, []);

  // Quay lại trang điều khiển
  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra?id=${project_id}`);
  };

  // Gọi API hiệu ứng
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

  // BẬT TẤT CẢ
  const handleClickOn = async () => {
    if (!project_id || loading) return;

    setActive("on");
    setLoading("on");

    try {
      const res = await createON({ project_id });
      console.log("✅ API ON result:", res);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API ON:", err);
    } finally {
      setLoading(null);
    }
  };

  // TẮT TẤT CẢ
  const handleClickOFF = async () => {
    if (!project_id || loading) return;

    setActive("off");
    setLoading("off");

    try {
      const res = await createOFF({ project_id });
      console.log("✅ API OFF result:", res);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API OFF:", err);
    } finally {
      setLoading(null);
    }
  };

  // Style dynamic
  const getButtonStyle = (isActive: boolean) => ({
    transition: "all 0.3s",
    background: isActive ? "#C2923F" : "#EEEEEE",
    color: isActive ? "#12223B" : "#294b61",
    border: isActive
      ? "1.5px solid #C2923F"
      : "1.5px solid #EEEEEE",
  });

  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo" className={styles.imgea} />
      </div>

      {/* Tiêu đề */}
      <div className={styles.title}>
        <h1>HIỆU ỨNG</h1>
      </div>

      {/* Menu hiệu ứng */}
      <div className={styles.Function}>
        {menuItems.length > 0 ? (
          <Stack align="center" gap="20px" mt="30px">
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

      {/* Footer */}
      <div className={styles.footer}>
        <Stack align="center" gap="xs">
          <Group gap="xs" wrap="nowrap" align="center">
            {/* BẬT */}
            <Button
              loading={loading === "on"}
              disabled={!!loading}
              className={styles.toggleBtn}
              style={getButtonStyle(active === "on")}
              onClick={() =>
                active !== "on"
                  ? handleClickOn()
                  : setActive(null)
              }
            >
              <Text size="11px">BẬT TẤT CẢ</Text>
            </Button>

            {/* TẮT */}
            <Button
              loading={loading === "off"}
              disabled={!!loading}
              className={styles.toggleBtn}
              style={getButtonStyle(active === "off")}
              onClick={() =>
                active !== "off"
                  ? handleClickOFF()
                  : setActive(null)
              }
            >
              <Text size="11px">TẮT TẤT CẢ</Text>
            </Button>
          </Group>

          {/* Nút quay lại */}
          <Button
            onClick={handleBack}
            variant="filled"
            className={styles.backBtn}
          >
            <IconArrowLeft size={18} color="#294b61" />
          </Button>
        </Stack>
      </div>
    </div>
  );
}
