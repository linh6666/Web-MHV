"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Menu.module.css";
import { Button, Loader, Stack, Text, Image } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifilter";

interface MenuProps {
  project_id: string | null;
  initialLayer2?: string | null;
  initialLayer3?: string | null; // Nhận thêm layer3 từ URL
  onLayer2Change?: (layer2: string) => void;
  onModelsLoaded?: (models: string[]) => void;
  onSelectModel?: (modelName: string) => void;
}

interface MenuItem {
  label: string;
  unit_code?: string;
}

interface NodeAttributeItem {
  id: number;
  unit_code: string;
  layer4?: string;
  layer6?: string;
}

export default function MenuBuilding({
  project_id,
  initialLayer2,
  initialLayer3,
  onModelsLoaded,
  onSelectModel,
}: MenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layer2Value = searchParams.get("layer2") || initialLayer2;
  const layer3Value = searchParams.get("layer3") || initialLayer3;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 📡 Load danh sách tầng/căn hộ dựa trên Layer 3 (Tòa nhà)
  const fetchData = useCallback(async () => {
    if (!project_id || !layer2Value || !layer3Value) return;

    setLoading(true);

    try {
      // Gọi API với cả layer2 và layer3 để lấy danh sách chi tiết bên trong tòa nhà
      const data = await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer1", values: ["ct"] },
          { label: "layer2", values: [layer2Value] },
          { label: "layer3", values: [layer3Value] }, // Lọc theo tòa nhà cụ thể
        ],
      });

      if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        setMenuItems([]);
        return;
      }

      const items = data.data as NodeAttributeItem[];
      
      // Truyền unit_code để highlight trên bản đồ
      onModelsLoaded?.(
        items.map((i: NodeAttributeItem) => i.unit_code).filter(Boolean) as string[]
      );

      // Tạo menu items từ Layer 6 (thường là số tầng hoặc mã căn)
      const uniqueMap = new Map<string, MenuItem>();
      items.forEach((item: NodeAttributeItem) => {
        const label = (item.layer4 || item.unit_code || "").trim();
        if (!label || label.toLowerCase() === "skip") return;

        if (!uniqueMap.has(label)) {
          uniqueMap.set(label, {
            label: label,
            unit_code: item.unit_code,
          });
        }
      });

      setMenuItems(Array.from(uniqueMap.values()));
    } catch (error) {
      console.error("❌ Lỗi khi gọi API chi tiết tòa nhà:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [project_id, layer2Value, layer3Value, onModelsLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectUnit = async (unitCode: string) => {
    if (!project_id || !layer2Value || !layer3Value) return;
    try {
      await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer1", values: ["ct"] },
          { label: "layer2", values: [layer2Value] },
          { label: "layer3", values: [layer3Value] },
          { label: "layer4", values: [unitCode] },
        ],
      });
    } catch (error) {
      console.error("❌ Lỗi khi gọi API Layer 4:", error);
    }
  };

  const handleBack = () => {
    if (!project_id) return;
    router.back(); // Quay lại trang trước (trang danh sách tòa nhà)
  };

  return (
    <div className={styles.box}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo" className={styles.imgea} />
      </div>

      <div className={styles.title}>
        <h1 style={{ fontSize: 12 }}>{layer3Value?.toUpperCase()}</h1>
      </div>

      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <div className={styles.scroll} style={{ marginTop: "5px" }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                className={styles.menuBtn}
                onClick={() => handleSelectUnit(item.unit_code || item.label)}
                variant="filled"
                color="orange"
                style={{ marginBottom: "10px" }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          <Text mt="md" c="dimmed">
            Không có dữ liệu hiển thị
          </Text>
        )}
      </div>

      <div className={styles.footer}>
        <Stack align="center" gap="xs">
          <Button
            onClick={handleBack}
            style={{
              width: 30,
              height: 30,
              padding: 0,
              borderRadius: 40,
              background: "#234374",
              border: "1.5px solid #EEEEEE",
            }}
          >
            <IconArrowLeft size={18} color="#EEEEEE" />
          </Button>
        </Stack>
      </div>
    </div>
  );
}
