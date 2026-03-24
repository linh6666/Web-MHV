"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Text, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifiterutilities";

interface MenuProps {
  project_id: string | null;
  selectedModel?: string | null; // Thêm prop này
  onModelsLoaded?: (models: string[]) => void;
  onSelectModel?: (modelName: string) => void;
  onHighlightCodes?: (codes: string[]) => void;
}

interface MenuItem {
  label: string;
}

interface NodeAttributeItem {
  layer7?: string | null;
  unit_code?: string;
  [key: string]: unknown;
}

export default function Menu({
  project_id,
  selectedModel, // Nhận vào từ props
  onModelsLoaded,
  onSelectModel,
  onHighlightCodes,
}: MenuProps) {
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
          filters: [{ label: "layer8", values: ["ti", "ct;ti"] }],
        };

        const res = await createNodeAttribute(body);

        if (!res?.data || !Array.isArray(res.data)) {
          setMenuItems([]);
          return;
        }

        const data: NodeAttributeItem[] = res.data;

        // callback load models
        onModelsLoaded?.(
          data
            .map((item) => item.unit_code)
            .filter((code): code is string => Boolean(code))
        );

        // xử lý zone từ layer6
        const zoneSet = new Set<string>();
        const zones: string[] = [];

        data.forEach((item) => {
          if (!item.layer7) return;

          item.layer7
            .split(";")
            .map((z) => z.trim())
            .filter((z) => z && z.toLowerCase() !== "skip")
            .forEach((z) => {
              if (!zoneSet.has(z)) {
                zoneSet.add(z);
                zones.push(z);
              }
            });
        });

        setMenuItems(zones.map((zone) => ({ label: zone })));
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project_id, onModelsLoaded]);

  // ✅ SỬA LOGIC CLICK ĐỂ TOGGLE VÀ TRÁNH CALL API LẦN 2
  // ✅ SỬA LOGIC CLICK ĐỂ TOGGLE VÀ TRÁNH CALL API LẦN 2
  const handleSelectModel = async (modelName: string) => {
    if (!project_id) return;

    const normalizedModel = modelName.trim();

    // Nếu nhấp vào cái đang chọn -> Tắt highlight và không call API
    if (selectedModel?.trim() === normalizedModel) {
      onHighlightCodes?.([]); // Xóa danh sách highlight
      onSelectModel?.(modelName); // Toggle về null trong parent
      return;
    }

    onSelectModel?.(modelName); // Set model mới trong parent

    // Nếu nhấp vào cái mới -> Call API
    try {
      const result = await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer8", values: ["ti", "ct;ti"] },
          { label: "layer7", values: [modelName] },
        ],
      });

      if (result?.data && Array.isArray(result.data)) {
        const codes = result.data
          .map((item: NodeAttributeItem) => item.unit_code)
          .filter((code: string | undefined): code is string => Boolean(code));

        onHighlightCodes?.(codes);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lọc theo tiện ích:", error);
    }
  };

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra?id=${project_id}`);
  };

  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo" className={styles.imgea} />
      </div>

      {/* Title */}
      <div className={styles.title}>
        <h1>TIỆN ÍCH TIÊU BIỂU</h1>
      </div>

      {/* Menu */}
      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
         ) : menuItems.length > 0 ? (
           <Stack align="center" className={styles.menuStack}>
             {menuItems.map((item, index) => (
               <Button
                 key={index}
                 className={`${styles.menuBtn} ${
                   item.label.length >= 20 ? styles.menuBtnLong : ""
                 } ${selectedModel === item.label ? styles.activeBtn : ""}`} // Thêm class activeBtn
                 onClick={() => {
                   handleSelectModel(item.label);
                 }}
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
