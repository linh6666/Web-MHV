"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Stack,
  Text,
  Loader,
  Title,

} from "@mantine/core";
import styles from "./Interact.module.css";
import { getListProject } from "../../../api/apigetlistProject";
import ProjectDetail from "./ProjectDetail";

/* =======================
   TYPE
======================= */
export interface Project {
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

/* =======================
   COMPONENT
======================= */
export default function Listcustomer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const token = localStorage.getItem("access_token") ?? "";

    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchProjects() {
      try {
        const { data } = await getListProject({
          token,
          skip: 0,
          limit: 100,
        });

        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Loader />
      </div>
    );
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className={styles.background}>
      <div className={styles.container}>
     {!selectedProject && (
      <Title order={2} c="#294b61" ta="center" mb="lg">
        Dự án
      </Title>
    )}

        {/* ===== DETAIL VIEW ===== */}
        {selectedProject ? (
          <>
            

            <ProjectDetail project={selectedProject} />
          </>
        ) : (
          
          /* ===== LIST PROJECT ===== */
          <div className={styles.cardGrid}>
            {projects.map((project) => (
              <Card
                key={project.id}
                shadow="sm"
                radius="md"
                withBorder
                padding="0"
                className={styles.card}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedProject(project)}
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
                  <Text fw={500} style={{ fontSize: 15 }}>
                    {project.name}
                  </Text>

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
        )}
      </div>
    </div>
  );
}
