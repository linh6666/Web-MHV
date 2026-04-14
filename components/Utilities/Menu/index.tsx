"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Text, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifiterutilities";
import ModalItem from "./ModalItem"; 

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

interface DataDetail {
  id: number;
  unit_code: string;
  layer1?: string;
  layer2?: string;
  layer3?: string;
  layer6?: string;
  zone?: string;
  building_type?: string;
  bedroom?: number | string;
  bathroom?: number | string;
  view?: string;
  status_unit?: string;
  price?: number;
  describe?: string;
  describe_vi?: string;
  main_door_direction?: string;
  balcony_direction?: string;
  direction?: string;
  url?: string;
  name_vi?: string;
  name_en?: string;
  description_en?: string;
}

interface NodeAttributeItem {
  layer2?: string | null;
  unit_code?: string;
  zone?: string;
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
  const [menuItems, setMenuItems] = useState<(MenuItem & { data: DataDetail })[]>([]);
  const [loading, setLoading] = useState(false);

  const [opened, setOpened] = useState(false);
  const [selectedData, setSelectedData] = useState<DataDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!project_id) return;

      setLoading(true);

      try {
        const body = {
          project_id,
          filters: [{ label: "layer1", values: ["ti", "ct;ti"] }],
        };

        const res = await createNodeAttribute(body);

        if (!res?.data || !Array.isArray(res.data)) {
          console.warn("⚠️ API không trả về dữ liệu hoặc data không phải mảng:", res);
          setMenuItems([]);
          return;
        }

        const data: NodeAttributeItem[] = res.data;

        // callback load models
        onModelsLoaded?.(
          data
            .map((item) => item.zone as string)
            .filter((code): code is string => Boolean(code))
        );

        // xử lý zone từ layer2
        const zoneMap = new Map<string, DataDetail>();
        const zones: { label: string; data: DataDetail }[] = [];

        data.forEach((item) => {
          if (!item.layer2) return;

          const layers = item.layer2
            .split(";")
            .map((z) => z.trim())
            .filter((z) => z && z.toLowerCase() !== "skip");
            
          layers.forEach((z) => {
            if (!zoneMap.has(z)) {
              const detail = item as unknown as DataDetail;
              zoneMap.set(z, detail);
              zones.push({ label: z, data: detail });
            }
          });
        });

        console.log("✅ Đã xử lý danh sách tiện ích:", zones);
        setMenuItems(zones);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API danh sách tiện ích:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project_id, onModelsLoaded]);

  const handleSelectModel = async (modelName: string, detail: DataDetail) => {
    if (!project_id) return;

    const normalizedModel = modelName.trim();
    console.log("🖱️ Click tiện ích:", normalizedModel);

    // Nếu nhấp vào cái đang chọn -> Tắt highlight
    if (selectedModel?.trim() === normalizedModel) {
      console.log("🔄 Toggle OFF tiện ích");
      onHighlightCodes?.([]); 
      onSelectModel?.(modelName); 
      return;
    }

    console.log("✨ Chọn tiện ích mới:", normalizedModel);
    onSelectModel?.(modelName); 

    // Sử dụng data có sẵn thay vì call API lại (tránh lỗi filter không khớp)
    if (detail) {
      console.log("📦 Dữ liệu modal:", detail);
      setSelectedData(detail);
      setOpened(true);
    }

    // Vẫn call API để lấy danh sách unit_code cần highlight (nếu cần filter chính xác hơn)
    try {
      const result = await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer1", values: ["ti", "ct;ti"] },
          { label: "layer2", values: [modelName] },
        ],
      });

      if (result?.data && Array.isArray(result.data)) {
        const codes = result.data
          .map((item: NodeAttributeItem) => item.zone as string)
          .filter((code: string | undefined): code is string => Boolean(code));

        console.log("🔦 Highlight các mã:", codes);
        onHighlightCodes?.(codes);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách highlight:", error);
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
                   handleSelectModel(item.label, item.data);
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

      <ModalItem
        opened={opened}
        onClose={() => setOpened(false)}
        data={selectedData}
        projectId={project_id}
      />
    </div>
  );
}
