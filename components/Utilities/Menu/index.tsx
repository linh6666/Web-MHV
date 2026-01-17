"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Loader, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { createNodeAttribute } from "../../../api/apifiterutilities";

interface MenuProps {
  project_id: string | null;
  onModelsLoaded?: (models: string[]) => void;
}

interface MenuItem {
  label: string;
}

interface NodeAttributeItem {
  layer6?: string | null;
  building_code?: string;
  [key: string]: unknown;
}

export default function Menu({ project_id, onModelsLoaded }: MenuProps) {
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

        // ✅ callback load models (không phụ thuộc layer6)
        onModelsLoaded?.(
          data
            .map((item) => item.building_code)
            .filter((code): code is string => Boolean(code))
        );

        // ✅ xử lý zone từ layer6
        const zones: string[] = [];
        const zoneSet = new Set<string>();

        data.forEach((item) => {
          if (!item.layer6) return; // ❌ null | undefined | ""

          item.layer6
            .split(";")
            .map((z) => z.trim())
            .filter(
              (z) =>
                z &&
                z.toLowerCase() !== "skip" // ❌ loại skip
            )
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

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/Tuong-tac/Millennia-City?id=${project_id}`);
  };

  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo" className={styles.imgea} />
      </div>

      {/* Title */}
      <div className={styles.title}>
        <h1>TIỆN ÍCH TIÊU BIÊU</h1>
      </div>

      {/* Menu */}
      <div className={styles.Function}>
        {loading ? (
          <Loader color="orange" />
        ) : menuItems.length > 0 ? (
          <div className={styles.scroll} style={{ marginTop: "5px" }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                className={styles.menuBtn}
                variant="outline"
                style={{ margin: "8px", fontSize: "9px" }}
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
