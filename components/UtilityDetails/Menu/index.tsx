"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Menu.module.css";
import {
  Button,
  Group,
  Image,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
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
  building_code?: string;
  group?: string;
  [key: string]: unknown;
}

export default function Menu({
  project_id,
  initialBuildingType,
  onModelsLoaded,
  onSelectModel,
}: MenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseFromQuery =
    searchParams.get("building") || initialBuildingType;

  const [active, setActive] = useState<"on" | "off" | null>(null);
  const [isMultiMode, setIsMultiMode] = useState<
    "single" | "multi" | null
  >(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOn, setLoadingOn] = useState(false);

  // ✅ FIX: bọc fetchData bằng useCallback
  const fetchData = useCallback(async () => {
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
          data.data.map(
            (i: NodeAttributeItem) => i.building_code as string
          )
        );

        const uniqueMap = new Map<string, MenuItem>();

        data.data.forEach((item: NodeAttributeItem) => {
          const subzone = item.model_building_vi || "";

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
  }, [project_id, phaseFromQuery, onModelsLoaded]);

  // ✅ FIX: dependency array giờ chỉ còn fetchData
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= HANDLERS =================

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

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/Tuong-tac/Millennia-City/Tien-ich?id=${project_id}`);
  };

  const handleMultiModeClick = () => {
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
    background: isActive
      ? "linear-gradient(to top, #FFE09A,#FFF1D2)"
      : "#FFFAEE",
    color: "#752E0B",
    border: "1.5px solid #752E0B",
  });

  const handleClickOn = async () => {
    if (!project_id) return;
    setActive("on");
    setLoadingOn(true);
    try {
      await createON({ project_id });
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
      await createOFF({ project_id });
    } catch (err) {
      console.error("❌ Lỗi khi gọi API OFF:", err);
    } finally {
      setLoadingOn(false);
    }
  };

  // ================= UI =================

  return (
    <div className={styles.box}>
      <div className={styles.logo}>
        <Image
          src="/Logo/logo-tt-city-millennia.png"
          alt="Logo"
          className={styles.imgea}
        />
      </div>

      <div className={styles.title}>
        <h1>{phaseFromQuery?.toUpperCase()}</h1>
      </div>

      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <div className={styles.scroll} style={{ marginTop: 5 }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                className={styles.menuBtn}
                onClick={() => {
                  handleMenuClick(item.label);
                  onSelectModel?.(item.label);
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

      <div className={styles.footer}>
        <Stack align="center" gap="xs">
          <Function
            activeMode={isMultiMode}
            setActiveMode={setIsMultiMode}
            onMultiModeClick={handleMultiModeClick}
          />
          <Group gap="xs">
            <Button
              style={getButtonStyle(active === "on")}
              onClick={handleClickOn}
              disabled={loadingOn}
            >
              <Text size="xs">ON</Text>
            </Button>

            <Button
              style={getButtonStyle(active === "off")}
              onClick={handleClickOFF}
            >
              <Text size="xs">OFF</Text>
            </Button>

            <Button
              onClick={handleBack}
              style={getButtonStyle(false)}
            >
              <IconArrowLeft size={18} />
            </Button>
          </Group>
        </Stack>
      </div>
    </div>
  );
}
