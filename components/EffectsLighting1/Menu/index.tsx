"use client";

import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { Button, Image, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { getListMapping } from "../../../api/apigetlimapping";
import ProjectionModal from "../../Control/Menu/ProjectionModal";

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
  const [openedProjection, setOpenedProjection] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapping = async () => {
      if (!project_id) return;
      try {
        const res = await getListMapping({ token: "", project_id });
        interface MappingItem {
          id: number;
          button_label_vi: string;
          name: string;
        }
        const items = (res.data as MappingItem[])
          .filter((m) => m.name !== "CONTROL")
          .map((m) => ({
            id: m.id,
            label: m.button_label_vi,
          }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching mapping:", error);
      }
    };
    fetchMapping();
  }, [project_id]);

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

      {/* Tiêu đề */}
      <div className={styles.title}>
        <h1>MAPPING</h1>
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
                onClick={() => {
                  setSelectedMappingId(item.id.toString());
                  setOpenedProjection(true);
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
        <Stack align="center" gap="xs">
          <Button onClick={handleBack} variant="filled" className={styles.backBtn}>
            <IconArrowLeft size={18} color="#294b61" />
          </Button>
        </Stack>
      </div>

      {/* Modal Projection */}
      <ProjectionModal
        opened={openedProjection}
        onClose={() => setOpenedProjection(false)}
        project_id={project_id}
        mappingId={selectedMappingId}
      />
    </div>
  );
}
