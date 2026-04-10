"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Select,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";

import { getListRoles } from "../../../api/getlistrole";
import { createJoinProject } from "../../../api/apiCreateJoinProject";

interface RequestModalProps {
  opened: boolean;
  onClose: () => void;
  projectName?: string;
  projectId?: string;
  onConfirm?: () => void; // thêm callback từ ngoài
}

export default function RequestModal({
  opened,
  onClose,
  projectName,
  projectId,
  onConfirm,
}: RequestModalProps) {
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [requestContent, setRequestContent] = useState<string>("");

  const [loading, setLoading] = useState(false);

  /* =========================
   * Fetch roles khi mở modal
   * ========================= */
  useEffect(() => {
    if (!opened) return;

    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await getListRoles({ token });

        // Đảm bảo lấy đúng id (UUID) và name
        const roleOptions = response.data.map(
          (role: { id: string; name: string }) => ({
            value: role.id,   // UUID
            label: role.name, // tên hiển thị
          })
        );

        setRoles(roleOptions);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, [opened]);

  /* =========================
   * Gửi yêu cầu tham gia
   * ========================= */
  const handleConfirm = async () => {
    if (!selectedRole) {
      alert("Vui lòng chọn vai trò");
      return;
    }

    if (!projectId) {
      alert("Không tìm thấy project");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        role_id: selectedRole, // giờ là UUID
        request_message: requestContent,
      };

      console.log("Gửi yêu cầu tham gia:", projectId, payload);

      await createJoinProject(projectId, payload);

      alert("Gửi yêu cầu tham gia thành công");

      // gọi callback từ ngoài nếu có
      if (onConfirm) {
        onConfirm();
      }

      onClose();
    } catch (error) {
      console.error("Lỗi gửi yêu cầu tham gia:", error);
      alert("Gửi yêu cầu tham gia thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text fw={500} size="lg">
          Tham gia dự án <span>{projectName}</span>
        </Text>
      }
    >
      <LoadingOverlay visible={loading} />

      <Select
        label="Vai trò"
        placeholder="Chọn vai trò của bạn trong dự án"
        data={roles}
        value={selectedRole}
        onChange={setSelectedRole}
        clearable
      />

      <Textarea
        label="Nội dung yêu cầu"
        placeholder="Nhập nội dung yêu cầu của bạn"
        value={requestContent}
        onChange={(event) =>
          setRequestContent(event.currentTarget.value)
        }
        mt="md"
      />

      <Button
        fullWidth
        mt="md"
        color="yellow"
        onClick={handleConfirm}
        loading={loading}
      >
        Gửi yêu cầu tham gia
      </Button>
    </Modal>
  );
}
