import React, { useState } from "react";
import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { NotificationExtension } from "../../../../extension/NotificationExtension";
import { createImg } from "../../../../api/apiCreateImg";

interface Props {
  unitCode: string;
  projectId: string;
  idItem?: string[];
  onSearch: () => void;
  onClose?: () => void;
}

const CreateImg = ({ unitCode, projectId, onSearch, onClose }: Props) => {
  const [visible, { open, close }] = useDisclosure(false);

  // danh sách file
  const [files, setFiles] = useState<(File | null)[]>([null]);

  // RID / description_en
  const [descriptionEn, setDescriptionEn] = useState("");

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...files];
    updated[index] = file;
    setFiles(updated);
  };

  const handleAddInput = () => {
    setFiles([...files, null]);
  };

  const handleSubmit = async () => {
    const validFiles = files.filter((f): f is File => f !== null);

    if (validFiles.length === 0) {
      NotificationExtension.Fails("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    if (!descriptionEn.trim()) {
      NotificationExtension.Fails("Vui lòng nhập RID (description_en).");
      return;
    }

    open();
    try {
      await createImg(projectId, unitCode, {
        files: validFiles,
        description_vi: descriptionEn.trim(),
      });

      NotificationExtension.Success("Tạo ảnh chi tiết nhà thành công!");
      setFiles([null]);
      setDescriptionEn("");
      onSearch();
      onClose?.();
    } catch (error) {
      console.error(error);
      NotificationExtension.Fails("Tạo ảnh thất bại!");
    } finally {
      close();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      pos="relative"
    >
      <LoadingOverlay visible={visible} />

      {/* ===== RID / description_en ===== */}
      <TextInput
        label="Mô tả"
        placeholder="Nhập Mô Tả"
        value={descriptionEn}
        onChange={(e) => setDescriptionEn(e.currentTarget.value)}
        withAsterisk
        mt="md"
      />

      {/* ===== File inputs ===== */}
      {files.map((file, index) => (
        <FileInput
          key={index}
          label={`Ảnh ${index + 1}`}
          placeholder="Chọn ảnh"
          accept="image/*"
          value={file}
          onChange={(f) => handleFileChange(index, f)}
          withAsterisk
          clearable
          mt="md"
        />
      ))}

      <Group justify="space-between" mt="lg">
        <Button
          variant="light"
          color="gray"
          onClick={handleAddInput}
          leftSection={<IconPlus size={18} />}
        >
          Thêm ảnh
        </Button>

        <Button
          type="submit"
          color="#3598dc"
          loading={visible}
          leftSection={<IconCheck size={18} />}
        >
          Tạo ảnh
        </Button>
      </Group>
    </Box>
  );
};

export default CreateImg;
