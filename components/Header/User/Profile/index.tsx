"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../../api/apiProfile";
import {
  Avatar,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Divider,
  Modal,
} from "@mantine/core";

interface User {
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  id: string;
  system_rank: string;
  last_logout:string;
  last_login: string;
}
interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ProfileModal({ opened, onClose }: ProfileModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!opened) return; // chỉ gọi API khi modal mở
    setLoading(true);
    getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      })
      .finally(() => setLoading(false));
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
    title={<span style={{ color: '#762f0b' }}>Hồ sơ cá nhân</span>} // ✅ đổi màu
      centered
      size="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      {loading ? (
        <Loader size="lg" />
      ) : !user ? (
        <Text c="red">Không lấy được thông tin user</Text>
      ) : (
        <Paper shadow="md" p="xl" radius="md" withBorder>
          {/* Header */}
          <Group mb="md" justify="space-between">
            <Group>
              <Avatar src={null} alt={user.full_name} size={60} radius="xl" />
              <Stack gap={2}>
                <Text fw={600}>{user.full_name || "Chưa có"}</Text>
                <Text c="dimmed" fz="sm">
                  {user.email}
                </Text>
              </Stack>
            </Group>
          </Group>
          <Divider mb="md" />
          {/* Info fields */}
          <Stack gap="sm">
            <Group justify="space-between">
              <Text c="dimmed">Tên:</Text>
              <Text>{user.full_name || "Chưa có"}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">Email: </Text>
              <Text>{user.email}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">SĐT:</Text>
              <Text>{user.phone || "Chưa có"}</Text>
            </Group>
             <Group justify="space-between">
              <Text c="dimmed">Vai trò:</Text>
             <Text>chưa có </Text>
            </Group>
             <Group justify="space-between">
              <Text c="dimmed">Dự án của bạn:</Text>
             <Text>chưa có </Text>
            </Group> 
            <Group justify="space-between">
              <Text c="dimmed">Cấp bậc:</Text>
             <Text>{user.system_rank|| "chưa có"}</Text>
            </Group>
                  <Group justify="space-between">
              <Text c="dimmed">Lần đăng nhập cuối cùng:</Text>
              <Text>{user.last_login|| "chưa có"}</Text>
            </Group>
                <Group justify="space-between">
              <Text c="dimmed">lần đăng xuất cuối cùng:</Text>
              <Text>{user.last_logout|| "chưa có"}</Text>
            </Group>
          </Stack>
        </Paper>
      )}
    </Modal>
  );
}
