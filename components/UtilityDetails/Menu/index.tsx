"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifiterutilities";
import { createON } from "../../../api/apiON"; 
import { createOFF } from "../../../api/apiOFF";
import Function from "./Function";

interface MenuProps {
  project_id: string | null;
  initialBuildingType?: string | null;
    onModelsLoaded?: (models: string[]) => void;
  onSelectModel?: (modelName: string) => void;
}

interface MenuItem {
  label: string;
  phase_vi: string;
  subzone_vi: string;
}

interface NodeAttributeItem {
  model_building_vi?: string;
  group?: string;
  [key: string]: unknown;
}

export default function Menu({ project_id, initialBuildingType,onModelsLoaded,
  onSelectModel, }: MenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseFromQuery = searchParams.get("building") || initialBuildingType;

  const [active, setActive] = useState<"on" | "off" | null>(null);
  const [isMultiMode, setIsMultiMode] = useState<"single" | "multi" | null>(null); // ✅ ban đầu null
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOn, setLoadingOn] = useState(false);

  // ✅ Hàm fetch dữ liệu
  const fetchData = async () => {
    if (!project_id || !phaseFromQuery) return;

    setLoading(true);
    try {
      const data = await createNodeAttribute({
        project_id,
        filters: [
          { label: "group", values: ["ti"] },
          { label: "building_type_vi", values: [phaseFromQuery] },
        ],
      });

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
         onModelsLoaded?.(
          data.data.map((i: NodeAttributeItem) => i.building_code)
        );
        const uniqueMap = new Map<string, MenuItem>();

        data.data.forEach((item: NodeAttributeItem) => {
          const subzone: string = item.model_building_vi || "";

          if (
            subzone.trim() &&
            !subzone.includes(";") &&
            !subzone.includes("Cảnh quan") &&
            !uniqueMap.has(subzone)
          ) {
            uniqueMap.set(subzone, {
              label: subzone,
              phase_vi: phaseFromQuery,
              subzone_vi: subzone,
            });
          }
        });

        setMenuItems(Array.from(uniqueMap.values()));
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [project_id, phaseFromQuery,onModelsLoaded]);

  // ✅ Xử lý khi nhấn 1 nút model
  const handleMenuClick = async (subzoneLabel: string) => {
    if (!project_id || !phaseFromQuery) return;

    try {
      const data = await createNodeAttribute({
        project_id,
        filters: [
          { label: "group", values: ["ti"] },
          { label: "building_type_vi", values: [phaseFromQuery] },
          { label: "model_building_vi", values: [subzoneLabel] },
        ],
      });

      console.log("✅ API trả về cho", subzoneLabel, data);
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
    }
  };

  // ✅ Quay lại trang tiện ích
  const handleBack = () => {
    if (!project_id) return;
    router.push(`/Tuong-tac/Millennia-City/Tien-ich?id=${project_id}`);
  };

  // ✅ Khi nhấn MULTI
  const handleMultiModeClick = () => {
    // Bấm lần đầu: kích hoạt multi, bấm lại thì tắt (null)
    setIsMultiMode(prev => (prev === "multi" ? null : "multi"));
    fetchData();
  };

  const getButtonStyle = (isActive: boolean) => ({
    width: 30,
    height: 30,
    padding: 0,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    transition: "background 0.3s",
    background: isActive
      ? "linear-gradient(to top, #FFE09A,#FFF1D2)"
      : "#FFFAEE",
    color: "#752E0B",
    border: "1.5px solid #752E0B",
  });

  // ✅ ON/OFF API
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
      console.log("✅ API OFF result:", res);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API OFF:", err);
    } finally {
      setLoadingOn(false);
    }
  };

  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/Logo/logo-tt-city-millennia.png"
          alt="Logo"
          className={styles.imgea}
        />
      </div>

      {/* Title */}
      <div className={styles.title}>
        <h1>{phaseFromQuery?.toUpperCase()}</h1>
      </div>

      {/* Menu danh sách */}
      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <div className={styles.scroll} style={{ marginTop: "5px" }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                className={styles.menuBtn}
                onClick={() => {handleMenuClick(item.label);
                  onSelectModel?.(item.label);
                }}
                variant="filled"
                color="orange"
                style={{
                  marginBottom: "10px",
                  background:
                    isMultiMode === "multi"
                      ? "linear-gradient(to top, #FFE09A,#FFF1D2)"
                      : undefined,
                }}
                disabled={isMultiMode === "multi"}
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
          <Function
            activeMode={isMultiMode}
            setActiveMode={setIsMultiMode}
            onMultiModeClick={handleMultiModeClick}
          />
          <Group gap="xs">
            {/* Nút ON */}
            <Button
              style={getButtonStyle(active === "on")}
              onClick={() => {
                if (active !== "on") handleClickOn();
                setActive(active === "on" ? null : "on");
              }}
              disabled={loadingOn}
            >
              <Text style={{ fontSize: "13px" }}>ON</Text>
            </Button>

            {/* Nút OFF */}
            <Button
              style={getButtonStyle(active === "off")}
              onClick={() => {
                if (active !== "off") handleClickOFF();
                setActive(active === "off" ? null : "off");
              }}
            >
              <Text style={{ fontSize: "12px" }}>OFF</Text>
            </Button>

            {/* Nút quay lại */}
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
                background: "#FFFAEE",
                color: "#752E0B",
                border: "1.5px solid #752E0B",
              }}
            >
              <IconArrowLeft size={18} color="#752E0B" />
            </Button>
          </Group>
        </Stack>
      </div>
    </div>
  );
}

