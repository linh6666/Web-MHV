
"use client";

import { useEffect, useState } from "react";
import { Card, Image, Stack, Text, Loader, Title } from "@mantine/core";
import styles from "./Interact.module.css";
import { getListProject } from "../../../api/apigetlistProjectControl";

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
}

export default function DetailInteractive() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token") ?? "";

    async function fetchProjects() {
      try {
        const { data } = await getListProject({
          token,
          skip: 0,
          limit: 100,
        });

        setProjects(data);
      } catch (error) {
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
    <div className={styles.background}>
      <div className={styles.container}>
          <Title order={2} c="#294b61" ta="center" mb="lg">
        Dự án
       </Title>
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

              <Stack gap="xs" p="md">
                <Text fw={500} style={{ fontSize: "15px" }}> {project.name} </Text>

                <Text size="xs" c="dimmed">
                  Loại dự án: {project.type || "Thông tin chưa có"}
                </Text>

                <Text size="xs" c="dimmed">
                  Địa chỉ: {project.address || "Địa chỉ chưa có"}
                </Text>

                <Text size="xs" c="dimmed">
                  Nhà đầu tư: {project.investor || "Thông tin chưa có"}
                </Text>
              </Stack>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
