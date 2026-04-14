"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifilter";
import { createON } from "../../../api/apiON";
import { createOFF } from "../../../api/apiOFF";
import ModalItem from "./ModalItem"; 

interface MenuProps {
  project_id: string | null;
  initialLayer2?: string | null;
  onLayer2Change?: (layer2: string) => void;
  onModelsLoaded?: (models: string[]) => void;
  onSelectModel?: (modelName: string) => void;
}

interface MenuItem {
  label: string;
  phase_vi: string;
  unit_code?: string;
  building_type_vi: string;
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
  layer3?: string;
  layer6?: string;
  group?: string;
  unit_code?: string;
  [key: string]: unknown;
}

export default function Menu({
  project_id,
  initialLayer2,
  onLayer2Change,
  onModelsLoaded,
  onSelectModel,
}: MenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
   const layer2Value = searchParams.get("layer2") || initialLayer2;

  const [active, setActive] = useState<"on" | "off" | null>(null);
  const [phase, setPhase] = useState<string>(layer2Value || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

   const [opened, setOpened] = useState(false);
     const [selectedData, setSelectedData] = useState<DataDetail | null>(null);

   useEffect(() => {
     if (layer2Value && layer2Value !== phase) {
      setPhase(layer2Value);
      onLayer2Change?.(layer2Value);
    }
  }, [layer2Value, phase, onLayer2Change]);

  // 📡 Load danh sách menu
  const fetchData = useCallback(async () => {
    if (!project_id || !phase) return;

    setLoading(true);

    try {
      const data = await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer1", values: ["ct", "ct;ti"], },
          { label: "layer2", values: [phase] },
        ],
      });

      if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        setMenuItems([]);
        return;
      }

      const items = data.data as NodeAttributeItem[];
      const uniqueMap = new Map<string, MenuItem>();

      onModelsLoaded?.(
        items.map((i) => i.unit_code).filter(Boolean) as string[]
      );

      items.forEach((item) => {
        const buildingType = (item.layer3 || "").trim();
        const groupValue = item.group;

        if (!buildingType) return;
        if (buildingType.toLowerCase() === "skip") return;
        if (buildingType.includes(";")) return;
        if (groupValue === "ct;ti") return;

        if (!uniqueMap.has(buildingType)) {
          uniqueMap.set(buildingType, {
            label: buildingType,
            phase_vi: phase,
            building_type_vi: buildingType,
          });
        }
      });

      const sortedItems = Array.from(uniqueMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" })
      );
      setMenuItems(sortedItems);
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [project_id, phase, onModelsLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ CHỈ SỬA ĐOẠN LỖI CLICK NÚT
  const handleSelectModel = async (modelName: string) => {
    if (!project_id || !phase) return;

    try {
      // Kiểm tra xem hạng mục này có dữ liệu chi tiết không trước khi chuyển trang
      const response = await createNodeAttribute({
        project_id,
        filters: [
          { label: "layer1", values: ["ct", "ct;ti"] },
          { label: "layer2", values: [phase] },
          { label: "layer3", values: [modelName] },
        ],
      });

      // Lọc bỏ những hạng mục là 'skip' trước khi kiểm tra để đảm bảo có dữ liệu thực tế
      const validData = (response?.data || []).filter((item: NodeAttributeItem) => {
        const layer4 = typeof item.layer4 === "string" ? item.layer4 : "";
        const unitCode = typeof item.unit_code === "string" ? item.unit_code : "";
        const label = (layer4 || unitCode || "").toLowerCase().trim();
        return label !== "" && label !== "skip";
      });

      if (validData.length > 0) {
        // Có dữ liệu thực tế mới chuyển sang trang chi tiết công trình mới
        router.push(
          `/tuong-tac/Ciputra/Chi-tiet-cong-trinh?id=${project_id}&layer2=${phase}&layer3=${modelName}`
        );
      } else if (response?.data && response.data.length > 0) {
        // Nếu không có dữ liệu để sang trang mới (chỉ có 'skip' hoặc rỗng), thì hiển thị modal
        setSelectedData(response.data[0] as unknown as DataDetail);
        setOpened(true);
        console.warn("⚠️ Hạng mục này chỉ chứa dữ liệu 'skip' hoặc rỗng, hiển thị Modal thay vì chuyển trang.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra dữ liệu:", error);
    }

    // Vẫn gọi onSelectModel để highlight (nếu cần thiết trước khi trang chuyển)
    onSelectModel?.(modelName);
  };


  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra/Du-an-tieu-bieu?id=${project_id}`);
  };

  const handleClickOn = async () => {
    if (!project_id) return;
    setActive("on");
    try {
      await createON({ project_id });
    } catch (err) {
      console.error("❌ Lỗi khi gọi API ON:", err);
    }
  };

  const handleClickOFF = async () => {
    if (!project_id) return;
    setActive("off");
    try {
      await createOFF({ project_id });
    } catch (err) {
      console.error("❌ Lỗi khi gọi API OFF:", err);
    }
  };

  const getButtonStyle = (isActive: boolean) => ({
    width: 90,
    height: 30,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    background: isActive ? "#C2923F" : "#234374",
    color: isActive ? "#12223B" : "#EEEEEE",
    border: isActive ? "1.5px solid #C2923F" : "1.5px solid #EEEEEE",
  });

  return (
    <div className={styles.box}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo" className={styles.imgea} />
      </div>

    <div className={styles.title}>
  <h1 style={{ fontSize: 12 }}>{phase?.toUpperCase()}</h1>
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
                onClick={() => handleSelectModel(item.label)}
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
          {/* <Group gap="xs" wrap="nowrap">
            <Button
              style={getButtonStyle(active === "on")}
              onClick={handleClickOn}
            >
              <Text size="11px">BẬT TẤT CẢ</Text>
            </Button>

            <Button
              style={getButtonStyle(active === "off")}
              onClick={handleClickOFF}
            >
              <Text size="11px">TẮT TẤT CẢ</Text>
            </Button>
          </Group> */}

          <Button
            onClick={handleBack}
            style={{
              width: 30,
              height: 30,
              padding: 0,
              borderRadius: 40,
              background: "#294b61",
              border: "1.5px solid #EEEEEE",
            }}
          >
            <IconArrowLeft size={18} color="#EEEEEE" />
          </Button>
        </Stack>
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
