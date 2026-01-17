"use client";

import { useEffect, useState } from "react";
import { Card, Image, Stack, Text, Button, Loader, Modal } from "@mantine/core";
import styles from "./Interact.module.css";
import { getListProject } from "../../api/apigetlistProjectControl";

interface Project {
  id: string;
  name: string;
  address?: string | null;
  overview_image?: string | null;
  investor?: string | null;
  project_template_id: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
   rank_name?: string | null;
  type?: string | null;
  link?: string;
}

export default function DetailInteractive() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialOrder, setInitialOrder] = useState<string[]>([]); // <--- lưu thứ tự ban đầu
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
      const { data } = await getListProject({ token, skip: 0, limit: 20 });

      // Nếu đây là lần đầu fetch -> lưu lại thứ tự ID ban đầu
      if (initialOrder.length === 0) {
        setInitialOrder(data.map((p: Project) => p.id));
      }

      // Nếu đã có thứ tự ban đầu -> sắp xếp lại theo đúng thứ tự đó
      const sortedData = [...data].sort((a, b) => {
        return initialOrder.indexOf(a.id) - initialOrder.indexOf(b.id);
      });

      // Tạo mapping giữa tên dự án và đường dẫn
      const linkMap: Record<string, string> = {
        "Ciputra": "/tuong-tac/Ciputra",
    

        // thêm các dự án khác nếu cần
      };

      // Gán link theo name
      const dataWithLink = sortedData.map((project: Project) => {
        const baseLink = linkMap[project.name] || `/Dieu-khien-${project.id}`;
        const link = `${baseLink}?id=${project.id}`;
        return { ...project, link };
      });

      setProjects(dataWithLink);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchProjects();
}, [initialOrder]);


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
          <div className={styles.cardGrid}>
             

            {projects.map((project) => (
              <Card
                key={project.id}
                shadow="sm"
                radius="md"
                withBorder
                padding="0"
                className={styles.card}
              >
                <Image
                  src={project.overview_image || "/placeholder.png"}
                  height={160}
                  alt={project.name}
                  style={{
                    borderTopLeftRadius: "var(--mantine-radius-md)",
                    borderTopRightRadius: "var(--mantine-radius-md)",
                  }}
                />
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
                      {/* <Text size="sm" c="dimmed">
                    Rank của bạn trong dự án: {project. rank_name || "Thông tin chưa có"}
                  </Text> */}
                 
                </Stack>
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
            backgroundColor: "#053c74",
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
