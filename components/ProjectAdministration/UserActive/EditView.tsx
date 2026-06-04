"use client";

import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
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
        NotificationExtension.Fails("Không thể tải thông tin chi tiết trạng thái.");
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
    <Box miw={320} mx="auto" style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />

      {userDetail && (
        <>
          <TextInput
            label="Họ và tên"
            value={userDetail.user_name || ""}
            readOnly
            mt="md"
          />

          <TextInput
            label="Email"
            value={email || ""}
            readOnly
            mt="md"
          />

          <TextInput
            label="Trạng thái kết nối"
            value={userDetail.is_online ? "Đang kết nối (Trực tuyến)" : "Mất kết nối (Ngoại tuyến)"}
            readOnly
            mt="md"
          />

          <TextInput
            label="Trạng thái chi tiết"
            value={userDetail.status || ""}
            readOnly
            mt="md"
          />
        </>
      )}

      {/* ===== ACTION ===== */}
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

