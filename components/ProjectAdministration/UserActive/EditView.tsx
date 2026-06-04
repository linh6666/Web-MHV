"use client";

import {
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getUserStatusDetail } from "../../../api/apiGetDeatlie";
import { NotificationExtension } from "../../../extension/NotificationExtension";
import type { UserStatusDetail } from "../../../api/apiGetDeatlie";

interface EditViewProps {
  email: string;
}

const EditView = ({ email }: EditViewProps) => {
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<UserStatusDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getUserStatusDetail(email);
        setUserDetail(res);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết trạng thái:", error);
        NotificationExtension.Fails(
          "Không thể tải thông tin chi tiết trạng thái."
        );
        modals.closeAll();
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchDetail();
    }
  }, [email]);

  return (
    <Box miw={360} mx="auto" style={{ position: "relative" }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
      />

      {userDetail && (
        <Stack gap="sm" mt="md">
          <Box
            p="md"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: 8,
              backgroundColor: "#f8fafc",
            }}
          >
            <Group justify="space-between" align="flex-start" gap="md">
              <Box>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  Người dùng
                </Text>
                <Text fw={700} size="lg" mt={4}>
                  {userDetail.user_name || "-"}
                </Text>
                <Text size="sm" c="dimmed" mt={2}>
                  {email || "-"}
                </Text>
              </Box>

              <Badge
                color={userDetail.is_online ? "green" : "gray"}
                variant="light"
                size="lg"
              >
                {userDetail.is_online ? "Trực tuyến" : "Ngoại tuyến"}
              </Badge>
            </Group>
          </Box>

          <Box
            p="md"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: 8,
              backgroundColor: "#ffffff",
            }}
          >
            <Group justify="space-between" gap="md" wrap="nowrap">
              <Text size="sm" c="dimmed">
                Trạng thái chi tiết
              </Text>
              <Text size="sm" fw={600} ta="right">
                {userDetail.status || "-"}
              </Text>
            </Group>
          </Box>
        </Stack>
      )}

      <Group justify="flex-end" mt="lg">
        <Button
          variant="outline"
          color="black"
          type="button"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Đóng
        </Button>
      </Group>
    </Box>
  );
};

export default EditView;
