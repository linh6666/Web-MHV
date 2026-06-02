"use client";
import { useEffect, useState } from "react";
import { Card, Image, Stack, Text, Button, Loader, Group } from "@mantine/core";
import { DonutChart } from '@mantine/charts';
// import '@mantine/charts/styles.css';
import { Sector } from 'recharts';
// import styles from './NotFoundTitle.module.css';
import styles from "./Interact.module.css";
import { getListProject } from "../../../api/apigetlistProject";
import { GetJoinProject } from "../../../api/apiGetJoinProject";
import { useRouter } from "next/navigation";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface Project {
  id: string;
  name: string;
  address?: string | null;
overview_image?: {
  url?: string;
} | null;
  investor?: string | null;
  project_template_id: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
  rank_name?: string | null;
  type?: string | null;
  link?: string;
  unit_status_summary?: {
    total_units: number;
    statuses: {
      id: string;
      status_name: string;
      count: number;
      percent: number;
    }[];
  };
}

interface JoinedProject {
  project_id: string;
  status: string;
}

function ProjectCard({
  project,
  joinedProjects,
}: {
  project: Project;
  joinedProjects: JoinedProject[];
}) {

  const router = useRouter();
  const joinedProject = joinedProjects.find(item => item.project_id === project.id);
  const status = joinedProject?.status;

  const [hoveredStatus, setHoveredStatus] = useState<{ name: string; color: string; percent: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getStatusColor = (name: string) => {
    const status = name.toUpperCase();
    switch (status) {
      case 'ĐANG BÁN': return '#40c057';
      case 'ĐÃ ĐẶT CỌC': return '#fab005';
      case 'ĐÃ BÁN': return '#f0441c';
      default: return '#dee2e6';
    }
  };

  const chartData = project.unit_status_summary?.statuses?.map((item) => ({
    name: item.status_name,
    value: item.percent,
    color: getStatusColor(item.status_name)
  })) || [];

  useEffect(() => {
    if (!project.unit_status_summary?.statuses?.length) return;

    const statuses = project.unit_status_summary.statuses;

    let defaultIndex = statuses.findIndex(
      (item) => item.status_name.toUpperCase() === "ĐANG BÁN"
    );

    if (defaultIndex === -1) defaultIndex = 0;

    const item = statuses[defaultIndex];

    setHoveredIndex(defaultIndex);
    setHoveredStatus({
      name: item.status_name,
      color: getStatusColor(item.status_name),
      percent: item.percent,
    });
  }, [project.unit_status_summary]);

  const resetToDefault = () => {
    if (!project.unit_status_summary?.statuses?.length) return;

    const statuses = project.unit_status_summary.statuses;

    let defaultIndex = statuses.findIndex(
      (item) => item.status_name.toUpperCase() === "ĐANG BÁN"
    );

    if (defaultIndex === -1) defaultIndex = 0;

    const item = statuses[defaultIndex];

    setHoveredIndex(defaultIndex);
    setHoveredStatus({
      name: item.status_name,
      color: getStatusColor(item.status_name),
      percent: item.percent,
    });
  };

  return (
    <Card shadow="sm" radius="md" withBorder padding="0" className={styles.card}>

      {/* ================== FIX IMAGE ONLY ================== */}
     <Image
  src={
    project.overview_image?.url
      ? project.overview_image.url.replace("http://", "https://")
      : "/placeholder.png"
  }
  className={styles.cardImage}
  alt={project.name}
  style={{
    borderTopLeftRadius: "var(--mantine-radius-md)",
    borderTopRightRadius: "var(--mantine-radius-md)",
  }}
/>
      {/* =================================================== */}

      <Text className={styles.projectName}>{project.name}</Text>

      <Group wrap="nowrap" p="xs" align="flex-start" style={{ flexGrow: 1 }}>

        <Stack gap={2} style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">Loại dự án: {project.type || "Thông tin chưa có"}</Text>
          <Text size="xs" c="dimmed">Địa chỉ: {project.address || "Địa chỉ chưa có"}</Text>
          <Text size="xs" c="dimmed">Chủ đầu tư: {project.investor || "Thông tin chưa có"}</Text>
          <Text size="sm" c="dimmed">Vai trò: {project.rank_name || "Chưa gán rank"}</Text>
        </Stack>

        <Stack align="center" gap={0} style={{ minWidth: 80 }}>

          <div className={styles.chartContainer}>
            {chartData.length > 0 ? (
              <DonutChart
                size={62}
                thickness={12}
                data={chartData}
                withTooltip={false}
                chartLabel={
                  hoveredStatus
                    ? `${hoveredStatus.percent.toFixed(1)}%`
                    : undefined
                }
                pieProps={{
                  startAngle: 90,
                  endAngle: 450,
                  activeIndex: hoveredIndex !== null ? hoveredIndex : undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  activeShape: (props: any) => (
                    <Sector
                      {...props}
                      outerRadius={(props.outerRadius as number) + 4}
                    />
                  ),
                  onMouseEnter: (_: unknown, index: number) => {
                    setHoveredIndex(index);
                    const item = project.unit_status_summary?.statuses?.[index];
                    if (item) {
                      setHoveredStatus({
                        name: item.status_name,
                        color: getStatusColor(item.status_name),
                        percent: item.percent,
                      });
                    }
                  },
                  onMouseLeave: () => {
                    resetToDefault();
                  },
                } as React.ComponentPropsWithoutRef<typeof DonutChart>['pieProps']}
              />
            ) : (
              <Text size="xs" c="dimmed">No data</Text>
            )}
          </div>

          <Text
            size="xs"
            fw={500}
            c="#752E0B"
            mt={5}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              height: 18,
              visibility: hoveredStatus ? 'visible' : 'hidden',
              opacity: hoveredStatus ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {hoveredStatus?.name ?? '\u00a0'}
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: hoveredStatus?.color ?? 'transparent',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </Text>

        </Stack>

      </Group>

      <Button
        className={`${styles.baseButton} ${styles.primaryButton}`}
        onClick={() => {
          if (status === "approved" || project.rank_name) {
            router.push(`/quan-ly-ban-hang/tong-mat-bang/${project.id}?name=${encodeURIComponent(project.name)}`);
          }
        }}
        disabled={status === "pending" || (!project.rank_name && status !== "approved")}
      >
        {status === "pending"
          ? "Đang chờ phê duyệt"
          : (project.rank_name ? "Đi tới dự án" : "Gửi yêu cầu")}
      </Button>

    </Card>
  );
}

export default function DetailInteractive() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<JoinedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("access_token") ?? "";

    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchProjects() {

      try {

        const [listProjectRes, joinedProjectRes] = await Promise.all([
          getListProject({ token, skip: 0, limit: 100 }),
          GetJoinProject({ token })
        ]);

        setProjects(listProjectRes.data);
        setJoinedProjects(joinedProjectRes.data);

      } catch (error: unknown) {

        console.error("Failed to fetch:", error);

        let errorMessage = "Có lỗi xảy ra khi tải dữ liệu";

        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as {
            response?: {
              data?: {
                detail?: string;
                message?: string;
              };
            };
          };

          errorMessage =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            errorMessage;
        }

        NotificationExtension.Fails(errorMessage);

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

          <div className={`${styles.cardGrid} ${projects.length > 0 && projects.length < 4 ? styles.centeredItems : ""}`}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                joinedProjects={joinedProjects}
              />
            ))}
          </div>

        </div>
      </div>

    </>
  );
}
