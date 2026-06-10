"use client";

import React, { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import Sun from "./Sun";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import FilterMenu from "./FilterMenu";
import ProjectionModal from "./ProjectionModal";
import { getListMapping } from "../../../api/apigetlimapping";

interface MenuProps {
  project_id: string | null;
}

interface MappingItem {
  id: string;
  project_id: string;
  name: string;
  node_attribute_id: string | null;
  button_label_vi: string;
  button_label_en: string;
}

interface MenuItem {
  label: string;
  link?: string;
  type?: "modal" | "filter";
  mappingId?: string;
}

export default function Menu({ project_id }: MenuProps) {
  const router = useRouter();

  const [showFilter, setShowFilter] = useState(false);
  const [openedProjection, setOpenedProjection] = useState(false);
  const [mappingButtons, setMappingButtons] = useState<MappingItem[]>([]);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(
    null
  );

  // Call API lấy mapping
  useEffect(() => {
    const fetchMapping = async () => {
      if (!project_id) return;

      try {
        const res = await getListMapping({
          token: "",
          project_id: project_id,
        });

        setMappingButtons(res.data);
      } catch (error) {
        console.error("Lỗi lấy mapping:", error);
      }
    };

    fetchMapping();
  }, [project_id]);

  // Menu items
  const menuItems: MenuItem[] = [
    // ...mappingButtons.map((item) => ({
//   label: item.button_label_vi,
//   type: "modal" as const,
//   mappingId: item.id,
// })),
    {
      label: "MAPPING",
      link: `/tuong-tac/Ciputra/Mapping${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "GIỚI THIỆU TỔNG THỂ",
      link: `/tuong-tac/Ciputra/Gioi-thieu-du-an${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "DỰ ÁN TIÊU BIÊU",
      link: `/tuong-tac/Ciputra/Du-an-tieu-bieu${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "TIỆN ÍCH TIÊU BIÊU",
      link: `/tuong-tac/Ciputra/Tien-ich${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "HIỆU ỨNG ÁNH SÁNG",
      link: `/tuong-tac/Ciputra/Hieu-ung-anh-sang${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "THƯ VIỆN ẢNH",
      link: `/tuong-tac/Ciputra/Thu-vien-anh${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "HƯỚNG DẪN SỬ DỤNG",
      link: `/tuong-tac/Ciputra/Huong-dan-su-dung${
        project_id ? `?id=${project_id}` : ""
      }`,
    },
    {
      label: "BỘ LỌC SẢN PHẨM",
      type: "filter",
    },
  ];

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
        <h1>MÔ HÌNH TƯƠNG TÁC</h1>
      </div>

      {/* Menu Buttons */}
      <div className={styles.Function}>
        <Stack align="center" style={{ gap: "15px", marginTop: "10px" }}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              className={`${styles.menuBtn} ${
                item.type === "filter" && showFilter ? styles.active : ""
              }`}
              variant="outline"
              leftSection={
                item.type === "filter" ? <IconSearch size={16} /> : null
              }
              onClick={() => {
                if (item.type === "modal") {
                  setSelectedMappingId(item.mappingId || null);
                  setOpenedProjection(true);
                } else if (item.type === "filter") {
                  setShowFilter(!showFilter);
                } else if (item.link) {
                  router.push(item.link);
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </div>

      {/* Filter Menu display */}
      {showFilter && (
        <FilterMenu
          project_id={project_id}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <Group gap="xs">
          <Sun project_id={project_id} />

          <Button
            onClick={() => router.push("/tuong-tac")}
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
              background: "#EEEEEE",
              color: "#294b61",
              border: "1.5px solid #EEEEEE",
            }}
          >
            <Group gap={0} align="center">
              <IconArrowLeft size={18} color="#294b61" />
            </Group>
          </Button>
        </Group>
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
