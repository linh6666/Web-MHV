"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifilter";
import { createON } from "../../../api/apiON";
import { createOFF } from "../../../api/apiOFF";
// import Function from "./Function";

interface MenuProps {
  project_id: string | null;
  initialLayer7?: string | null;
  onLayer7Change?: (layer7: string) => void;
  onModelsLoaded?: (models: string[]) => void;
}

interface MenuItem {
  label: string;
  phase_vi: string;
  unit_code?: string;
  building_type_vi: string;
}

interface NodeAttributeItem {
  layer6?: string;
  group?: string;
  [key: string]: unknown;
}

export default function Menu({
  project_id,
  initialLayer7,
  onLayer7Change,
  onModelsLoaded,
}: MenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layer7Value = searchParams.get("layer7") || initialLayer7;

  // ⚙️ State
  const [active, setActive] = useState<"on" | "off" | null>(null);
  const [phase, setPhase] = useState<string>( layer7Value|| "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  // const [isMultiMode, setIsMultiMode] = useState<"single" | "multi" | null>(null);

  useEffect(() => {
    if (layer7Value && layer7Value !== phase) {
      setPhase(layer7Value);
      onLayer7Change?.(layer7Value);
    }
  }, [layer7Value, phase, onLayer7Change]);

  // 📡 Gọi API danh sách nhà
  const fetchData = useCallback(async () => {
  if (!project_id || !phase) return;

  setLoading(true);

  try {
    const data = await createNodeAttribute({
      project_id,
      filters: [
        { label: "layer8", values: ["ct", "ct;ti"] },
        { label: "layer7", values: [phase] },
      ],
    });

    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
      setMenuItems([]);
      return;
    }

    const items = data.data as NodeAttributeItem[];
    const uniqueMap = new Map<string, MenuItem>();

    // ✅ GỌI 1 LẦN DUY NHẤT
    onModelsLoaded?.(
      items
        .map((i: NodeAttributeItem) => i.unit_code)
        .filter(Boolean) as string[]
    );

    items.forEach((item: NodeAttributeItem) => {
      const buildingType = (item.layer6 || "").trim();
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

    setMenuItems(Array.from(uniqueMap.values()));
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

  // 🧭 Điều hướng
  // const handleNavigate = (phase: string, buildingType: string) => {
  //   if (!project_id) return;
  //   router.push(
  //     `/Tuong-tac/Millennia-City/Cong-trinh?id=${project_id}&phase=${encodeURIComponent(
  //       phase
  //     )}&building_type_vi=${encodeURIComponent(buildingType)}`
  //   );
  // };

  // ⏪ Quay lại
  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra/Du-an-tieu-bieu?id=${project_id}`);
  };

  // 🔆 ON / OFF
  const handleClickOn = async () => {
    if (!project_id) return;
    setActive("on");
    try {
      const res = await createON({ project_id });
      console.log("✅ API ON result:", res);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API ON:", err);
    }
  };

  const handleClickOFF = async () => {
    if (!project_id) return;
    setActive("off");
    try {
      const res = await createOFF({ project_id });
      console.log("✅ API OFF result:", res);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API OFF:", err);
    }
  };

  // 🌗 MULTI
  // const handleMultiModeClick = () => {
  //   setIsMultiMode("multi");
  //   fetchData();
  // };

  // 🎨 Style nút ON/OFF
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
        <h1>{phase?.toUpperCase()}</h1>
      </div>

      {/* Danh sách menu */}
      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <div className={styles.scroll} style={{ marginTop: "5px" }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                className={styles.menuBtn}
                // onClick={() => handleNavigate(item.phase_vi, item.building_type_vi)}
                variant="filled"
                color="orange"
                style={{
                  marginBottom: "10px",
                  // background:
                  //   isMultiMode === "multi"
                  //     ? "linear-gradient(to top, #FFE09A,#FFF1D2)"
                  //     : undefined,
                }}
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

      {/* Footer */}
      <div className={styles.footer}>
        <Stack align="center" gap="xs">
          {/* 🔘 MULTI/SINGLE */}
          {/* <Function
            activeMode={isMultiMode}
            setActiveMode={setIsMultiMode}
            onMultiModeClick={handleMultiModeClick}
          /> */}

          {/* ⚙️ ON/OFF + Back */}
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