"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Stack,
  Text,
  Button,
  Loader,
  Modal,
} from "@mantine/core";
import styles from "./Interact.module.css";
import { getListProject } from "../../api/apigetlistProjectControl";
import { NotificationExtension } from "../../extension/NotificationExtension";

// ===========================
// ✅ TYPE
// ===========================

interface OverviewImage {
  url: string;
  thumbnail_url: string;
}

interface Project {
  id: string;
  name: string;
  address?: string | null;
  overview_image?: OverviewImage | null; // ✅ FIX
  investor?: string | null;
  project_template_id: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
  rank_name?: string | null;
  type?: string | null;
  link?: string;
}

// ===========================
// 🔥 HELPER
// ===========================

const getImageUrl = (img?: OverviewImage | null) => {
  if (!img?.url) return "/placeholder.png";
  return img.url.replace("http://", "https://");
};

// ===========================
// COMPONENT
// ===========================

export default function DetailInteractive() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialOrder, setInitialOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") ?? "";

    if (!token) {
      setShowLoginModal(true);
      setLoading(false);
      return;
    }

    async function fetchProjects() {
      try {
        const { data } = await getListProject({
          token,
          skip: 0,
          limit: 20,
        });

        // Lưu thứ tự ban đầu
        setInitialOrder(data.map((p: Project) => p.id));

        // Mapping link theo tên
        const linkMap: Record<string, string> = {
          "MHV Ciputra": "/tuong-tac/Ciputra",
        };

        const dataWithLink: Project[] = data.map((project: Project) => {
          const baseLink =
            linkMap[project.name] || `/Dieu-khien-${project.id}`;
          const link = `${baseLink}?id=${project.id}`;

          return {
            ...project,
            link,
          };
        });

        setProjects(dataWithLink);
        NotificationExtension.Success("Tải dữ liệu dự án thành công");
      } catch (error) {
        const axiosError = error as {
          response?: { data?: { detail?: string } };
        };

        const errorMessage =
          axiosError?.response?.data?.detail ||
          "Lỗi khi tải dữ liệu dự án";

        NotificationExtension.Fails(errorMessage);
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className={styles.background}>
        <div className={styles.container}>
          <div
            className={`${styles.cardGrid} ${
              projects.length < 4 ? styles.centerGrid : ""
            }`}
          >
            {projects.map((project) => (
              <Card
                key={project.id}
                shadow="sm"
                radius="md"
                withBorder
                padding="0"
                className={styles.card}
              >
                {/* ===== IMAGE ===== */}
                <Image
                  src={getImageUrl(project.overview_image)}
                  height={160}
                  alt={project.name}
                  style={{
                    borderTopLeftRadius: "var(--mantine-radius-md)",
                    borderTopRightRadius: "var(--mantine-radius-md)",
                  }}
                />

                {/* ===== CONTENT ===== */}
                <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
                  <Text fw={500}>{project.name}</Text>

                  <Text size="sm" c="dimmed">
                    Loại dự án: {project.type || "Thông tin chưa có"}
                  </Text>

                  <Text size="sm" c="dimmed">
                    Địa chỉ: {project.address || "Địa chỉ chưa có"}
                  </Text>

                  <Text size="sm" c="dimmed">
                    Nhà đầu tư: {project.investor || "Thông tin chưa có"}
                  </Text>
                </Stack>

                {/* ===== BUTTON ===== */}
                <Button
                  component="a"
                  href={project.link}
                  className={`${styles.baseButton} ${styles.primaryButton}`}
                >
                  Đi tới dự án
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAL LOGIN ===== */}
      <Modal
        opened={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Thông báo"
        centered
      >
        <Text>Bạn cần đăng nhập để xem danh sách dự án.</Text>

        <Button
          mt="md"
          fullWidth
          onClick={() => (window.location.href = "/")}
          style={{
            backgroundColor: "#294b61",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Đăng nhập ngay
        </Button>
      </Modal>
    </>
  );
}