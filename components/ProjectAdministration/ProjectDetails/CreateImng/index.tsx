import React, { useState } from "react";
import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
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
  const [files, setFiles] = useState<(File | null)[]>([null]);

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

    open();
    try {
      // ✅ truyền đúng kiểu payload: { files: File[] }
      await createImg(projectId, unitCode, { files: validFiles });

      NotificationExtension.Success("Tạo ảnh chi tiết nhà thành công!");
      setFiles([null]);
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