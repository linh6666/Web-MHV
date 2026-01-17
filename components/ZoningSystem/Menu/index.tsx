"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Stack, Loader, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifilter";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface MenuProps {
  project_id: string | null;
}

interface MenuItem {
  label: string;
}

interface NodeAttributeItem {
  layer7?: string;
  [key: string]: unknown;
}

interface ApiResponse {
  message?: string;
  data?: NodeAttributeItem[];
  [key: string]: unknown;
}

export default function Menu({ project_id }: MenuProps) {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!project_id) return;

      setLoading(true);
      try {
        const body = {
          project_id,
          filters: [{ label: "layer8", values: ["ct", "ct;ti"],
 }],
        };

        const data: ApiResponse = await createNodeAttribute(body);

        // ✅ Kiểm tra nếu API có message
        if (data?.message) {
          NotificationExtension.Success(data.message);
        }

        if (data?.data && Array.isArray(data.data)) {
          const allPhases: string[] = data.data.flatMap(
            (item: NodeAttributeItem) =>
              String(item.layer7 || "")
                .split(";")
                .map((z) => z.trim())
                .filter(Boolean)
          );

          // 🆕 BƯỚC LỌC MỚI: Loại bỏ các phase có giá trị là "skip" (không phân biệt chữ hoa/thường)
          const filteredPhases = allPhases.filter((phase) => phase.toLowerCase() !== "skip");

          const uniquePhases = Array.from(new Set(filteredPhases));

          const sortedPhases = uniquePhases.sort((a, b) => {
            const numA = a.match(/\d+/)?.[0];
            const numB = b.match(/\d+/)?.[0];
            if (numA && numB) return Number(numA) - Number(numB);
            return a.localeCompare(b, "vi", { sensitivity: "base" });
          });

          const items: MenuItem[] = sortedPhases.map((phase) => ({
            label: phase,
          }));
          setMenuItems(items);
        } else {
          console.warn("⚠️ Dữ liệu trả về không đúng định dạng:", data);
          NotificationExtension.Fails("Dữ liệu trả về không hợp lệ từ API!");
        }
      } catch (error: unknown) {
        console.error("❌ Lỗi khi gọi API:", error);

        // ✅ Nếu backend trả về lỗi có message hoặc detail
        let apiMessage = "Gọi API thất bại!";
        if (error && typeof error === "object") {
          const errObj = error as {
            response?: { data?: { detail?: string; message?: string } };
            message?: string;
          };
          apiMessage =
            errObj.response?.data?.detail ||
            errObj.response?.data?.message ||
            errObj.message ||
            apiMessage;
        }

        NotificationExtension.Fails(apiMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project_id]);

  const handleNavigate = (layer7: string) => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra/Mau-cong-trinh?id=${project_id}&layer7=${encodeURIComponent(layer7)}`);
  };

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra?id=${project_id}`);
  };

  return (
    <div className={styles.box}>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          className={styles.imgea}
        />
      </div>

      <div className={styles.title}>
        <h1>DỰ ÁN TIÊU BIỂU</h1>
      </div>

      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <Stack align="center" style={{ gap: "20px", marginTop: "30px" }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                className={styles.menuBtn}
                onClick={() => handleNavigate(item.label)}
                variant="outline"
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

      <div className={styles.footer}>
        <Group gap="xs">
          <Button
            onClick={handleBack}
            variant="filled"
            style={{
              width: 30,
              height: 30,
              padding: 0,
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "background 0.3s",
              background: "#234374",
              color: "#EEEEEE",
              border: "1.5px solid #EEEEEE",
            }}
          >
            <IconArrowLeft size={18} color="#EEEEEE" />
          </Button>
        </Group>
      </div>
    </div>
  );
}