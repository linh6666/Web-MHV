"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconBellRinging, IconUser } from "@tabler/icons-react";
import styles from "./Announcement.module.css";

import { getListProject } from "../../../api/apigetlistProject";
import { GetJoinProject } from "../../../api/apigetlistJoinProject";
import { getListRoles } from "../../../api/getlistrole";
import { updateRequest } from "../../../api/apiEdiJoinProject";
import { NotificationExtension } from "../../../extension/NotificationExtension";

// ============================================
// ⭐ TẠO TYPE RÕ RÀNG
// ============================================

interface Project {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface JoinRequestItem {
  id: number;
  project_id: number;
  role_id: number;
  request_message: string;
  created_at: string;
  status: string;
}

interface JoinRequestResponse {
  data: JoinRequestItem[];
}

export default function HomePage() {
  const [requests, setRequests] = useState<JoinRequestResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [projectMap, setProjectMap] = useState<Record<number, string>>({});
  const [roleMap, setRoleMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = "access_token";

        const projects = await getListProject({ token, skip: 0, limit: 100 });
        const projMap: Record<number, string> = {};
        projects.data.forEach((p: Project) => {
          projMap[p.id] = p.name;
        });
        setProjectMap(projMap);

        const roles = await getListRoles({ token, skip: 0, limit: 100 });
        const rMap: Record<number, string> = {};
        roles.data.forEach((r: Role) => {
          rMap[r.id] = r.name;
        });
        setRoleMap(rMap);

        const responses: JoinRequestResponse[] = await Promise.all(
          projects.data.map((proj: Project) =>
            GetJoinProject({
              token,
              project_id: String(proj.id),
              skip: 0,
              limit: 100,
            })
          )
        );

        setRequests(responses);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const flatRequests: JoinRequestItem[] = requests
    .flatMap((req) => req.data)
    .filter((item) => item.status === "pending");

  // ==============================
  // ⭐ HÀM DUYỆT / TỪ CHỐI + NOTIFICATION
  // ==============================
  const handleUpdate = async (
    project_id: number,
    request_id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateRequest(String(project_id), String(request_id), { status });

      // Cập nhật lại UI
      setRequests((prev) =>
        prev.map((req) => ({
          ...req,
          data: req.data.filter((r) => r.id !== request_id),
        }))
      );

      // Hiển thị thông báo thành công
      NotificationExtension.Success(
        status === "approved"
          ? "Yêu cầu đã được duyệt thành công!"
          : "Yêu cầu đã bị từ chối!"
      );
    } catch (error) {
      console.error(`Error updating request ${request_id}:`, error);
      NotificationExtension.Fails("Có lỗi xảy ra khi cập nhật yêu cầu!");
    }
  };

  return (

    <Menu
      transitionProps={{ transition: "rotate-right", duration: 150 }}
      position="bottom-end"
      offset={5}
    >
      <Tooltip label="Thông Báo" position="bottom"
      
  styles={{
    tooltip: {
      backgroundColor: "#f1eeeeff",
      color: "#000",
    },
  }}
            >
  <Menu.Target>
        <div
          style={{
            border: "1px solid #752E0B",
            borderRadius: "50%",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <IconBellRinging size={18} color="#752E0B" stroke={1.5} />

          <Badge
            size="xs"
            color="red"
            variant="filled"
            style={{ position: "absolute", top: -5, right: -5 }}
          >
            {flatRequests.length}
          </Badge>
        </div>
      </Menu.Target>

            </Tooltip>
    
      <Menu.Dropdown w={350} p={0}>
        <Group justify="space-between" px="md" py="sm">
          <Text fw={600} size="lg">
            Thông báo
          </Text>
        </Group>

        <Divider mb="sm" />

        <ScrollArea style={{ maxHeight: 400 }}>
          {loading ? (
            <Text px="sm" py="xs" size="sm" color="dimmed">
              Đang tải...
            </Text>
          ) : flatRequests.length === 0 ? (
            <Text px="sm" py="xs" size="sm" color="dimmed">
              Không có thông báo
            </Text>
          ) : (
            flatRequests.map((item) => (
              <Menu.Item
                key={item.id}
                px="sm"
                py="xs"
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                  marginBottom: 4,
                  cursor: "pointer",
                }}
              >
                <Group align="flex-start">
                  <div className={styles.userIconWrapper}>
                    <IconUser className={styles.userIcon} />
                  </div>

                  <Stack style={{ flex: 1 }}>
                    <Text fw={700}>
                      {roleMap[item.role_id] || item.role_id}
                    </Text>
                    <Text size="sm">{item.request_message}</Text>
                    <Text size="xs" color="dimmed">
                      Dự án: {projectMap[item.project_id] || "Không rõ"} •{" "}
                      {new Date(item.created_at).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>

                    <Group>
                      <Button
                        size="xs"
                        color="green.6"
                        variant="light"
                        onClick={() =>
                          handleUpdate(item.project_id, item.id, "approved")
                        }
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="xs"
                        color="red.6"
                        variant="light"
                        onClick={() =>
                          handleUpdate(item.project_id, item.id, "rejected")
                        }
                      >
                        Từ chối
                      </Button>
                    </Group>
                  </Stack>
                </Group>
              </Menu.Item>
            ))
          )}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );
}
