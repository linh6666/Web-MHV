"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface UploadExcelProps {
  id: string;
}

export default function UploadExcel({ id }: UploadExcelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const handleUpload = async () => {
    if (!file) {
      NotificationExtension.Fails("Vui lòng chọn file Excel.");
      return;
    }

    if (!token) {
      NotificationExtension.Fails("Bạn chưa đăng nhập hoặc token đã hết hạn.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_API}/api/v1/node_attribute/import-excel?project_id=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.detail || "Upload thất bại.");
      }

      NotificationExtension.Success(
        result?.message || "Import file Excel thành công!"
      );

      setFile(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra.";

      NotificationExtension.Fails(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative" maw={500}>
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      <FileInput
        label="Chọn file Excel"
        placeholder="Chọn file .xlsx"
        accept=".xlsx,.xls"
        value={file}
        onChange={setFile}
        clearable
        leftSection={<IconUpload size={16} />}
      />

      <Group mt="md">
        <Button onClick={handleUpload} disabled={!file || loading}>
          Upload
        </Button>
      </Group>
    </Box>
  );
}