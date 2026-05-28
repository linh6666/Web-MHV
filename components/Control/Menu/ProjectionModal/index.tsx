"use client";

import { useState } from "react";
import { Modal, Text, Stack, Button, Group, Loader } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
} from "@tabler/icons-react";

import { startProjection } from "../../../../api/apimappingstart";
import { EndProjection } from "../../../../api/apimappingEnd";
import { NotificationExtension } from "../../../../extension/NotificationExtension";

// ✅ TYPE RESPONSE
interface ProjectionResponse {
  detail?: string;
  message?: string;
}

// ✅ TYPE ERROR (hỗ trợ Axios)
interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
  };
  message?: string;
}

interface ProjectionModalProps {
  opened: boolean;
  onClose: () => void;
  project_id: string | null;
  mappingId: string | null;
}

export default function ProjectionModal({
  opened,
  onClose,
  project_id,
  mappingId,
}: ProjectionModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  // ================= START / RESTART =================
  const handleStart = async () => {
    if (loadingStart) return;

    if (!project_id || !mappingId) {
      NotificationExtension.Fails("Thiếu project_id hoặc mappingId");
      return;
    }

    try {
      setLoadingStart(true);

      if (isPlaying) {
        NotificationExtension.Warn("Đang chạy, thực hiện chạy lại...");
      }

      const res: ProjectionResponse = await startProjection({
        project_id,
        script_id: mappingId,
      });

      console.log("Start Projection:", res);

      const message =
        res?.detail || res?.message || "Bắt đầu trình chiếu thành công";

      const isError =
        message.toLowerCase().includes("failed") ||
        message.toLowerCase().includes("error");

      if (isError) {
        NotificationExtension.Fails(message);
        return;
      }

      NotificationExtension.Success(
        isPlaying ? "Chạy lại trình chiếu thành công" : message
      );

      setIsPlaying(true);
    } catch (error: unknown) {
      console.error("Start Projection Error:", error);

      let message = "Lỗi khi bắt đầu trình chiếu";

      const err = error as ApiError;

      if (err?.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      NotificationExtension.Fails(message);
    } finally {
      setLoadingStart(false);
    }
  };

  // ================= END =================
  const handleEnd = async () => {
    if (loadingEnd) return;

    if (!project_id || !mappingId) {
      NotificationExtension.Fails("Thiếu project_id hoặc mappingId");
      return;
    }

    try {
      setLoadingEnd(true);

      const res: ProjectionResponse = await EndProjection({
        project_id,
        script_id: mappingId,
      });

      console.log("End Projection:", res);

      const message =
        res?.detail || res?.message || "Kết thúc trình chiếu thành công";

      const isError =
        message.toLowerCase().includes("failed") ||
        message.toLowerCase().includes("error");

      if (isError) {
        NotificationExtension.Fails(message);
        return;
      }

      NotificationExtension.Success(message);

      setIsPlaying(false);
      onClose();
    } catch (error: unknown) {
      console.error("End Projection Error:", error);

      let message = "Lỗi khi kết thúc trình chiếu";

      const err = error as ApiError;

      if (err?.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      NotificationExtension.Fails(message);
    } finally {
      setLoadingEnd(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      centered
      size="lg"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      styles={{
    header: {
      justifyContent: "center", // ⭐ căn giữa title thật sự
    },
    title: {
      width: "100%",
      textAlign: "center",
    },
  }}
      title={
        <Text fw={700} >
           PROJECTION MAPPING MÔ HÌNH DỰ ÁN CIPUTRA
        </Text>
      }
    >
      <Stack align="center">
        <Text ta="center">
          Một trải nghiệm trình chiếu đặc biệt sắp bắt đầu.
          <br />
          Xin mời quý khách hướng sự chú ý lên mô hình để theo dõi các hình
          ảnh, hiệu ứng ánh sáng và âm thanh được đồng bộ và trình chiếu trực
          tiếp trên bề mặt mô hình.
        </Text>

        <Group mt="md" justify="center">
          {/* START / RESTART */}
          <Button
            radius="xl"
            onClick={handleStart}
            disabled={loadingStart}
            rightSection={
              loadingStart ? (
                <Loader size={16} />
              ) : isPlaying ? (
                <IconRefresh size={18} fill="#ffff" />
              ) : (
                <IconPlayerPlay size={18} fill="#ffff" />
              )
            }
            style={{
              backgroundColor: "#294b61",
              color: "#ffff",
              border: "1px solid #ffff",
            }}
          >
            {isPlaying ? "CHẠY LẠI TRÌNH CHIẾU" : "BẮT ĐẦU TRÌNH CHIẾU"}
          </Button>

          {/* STOP */}
          <Button
            radius="xl"
            onClick={handleEnd}
            disabled={loadingEnd}
            rightSection={
              loadingEnd ? (
                <Loader size={16} />
              ) : (
                <IconPlayerStop size={18} fill="#ffff" />
              )
            }
            style={{
              backgroundColor: "#294b61",
              color: "#ffff",
              border: "1px solid #ffff",
            }}
          >
            KẾT THÚC TRÌNH CHIẾU
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}