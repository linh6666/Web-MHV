import React, { useState } from "react";
import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,

  Textarea,
  Stack,
  Image,
  SimpleGrid,
  ActionIcon,
  Text,
  Paper,
  rem,
  Center,
} from "@mantine/core";
import {
  IconCheck,
  IconPlus,
  IconPhotoPlus,
  IconX,

} from "@tabler/icons-react";
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

  // danh sách file và mô tả tương ứng
  const [items, setItems] = useState<{ file: File | null; description: string }[]>([
    { file: null, description: "" },
  ]);

  const handleFileChange = (index: number, payload: File | File[] | null) => {
    if (!payload) return;
    const files = Array.isArray(payload) ? payload : [payload];
    if (files.length === 0) return;

    // Chuyển đổi các file được chọn thành danh sách các item mới
    const newItems = files.map((file) => ({ file, description: "" }));

    setItems((prev) => {
      const result = [...prev];
      // Thay thế ô hiện tại bằng danh sách các ảnh mới chọn
      result.splice(index, 1, ...newItems);
      return result;
    });
  };

  const handleDescriptionChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index].description = val;
    setItems(updated);
  };

  const handleAddInput = () => {
    setItems([...items, { file: null, description: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      setItems([{ file: null, description: "" }]);
    }
  };

  const handleSubmit = async () => {
    const validItems = items.filter((item) => item.file !== null);

    if (validItems.length === 0) {
      NotificationExtension.Fails("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    open();
    try {
      // Gọi API cho từng hình ảnh để có mô tả riêng
      for (const item of validItems) {
        await createImg(projectId, unitCode, {
          files: [item.file as File],
          description_vi: item.description.trim(),
        });
      }

      NotificationExtension.Success("Tạo ảnh chi tiết nhà thành công!");
      setItems([{ file: null, description: "" }]);
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
      style={{ maxWidth: rem(900) }}
    >
      <LoadingOverlay visible={visible} zIndex={1000} />

      <Stack gap="md">
        {/* ===== List of image cards with individual descriptions ===== */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {items.map((item, index) => (
            <Paper
              key={index}
              shadow="xs"
              radius="md"
              p={0}
              style={{
                backgroundColor: "#1c1c1e",
                border: "1px solid #2c2c2e",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image / Input Area */}
              <Box
                style={{
                  height: "150px",
                  position: "relative",
                  backgroundColor: "#1c1c1e",
                }}
              >
                {item.file ? (
                  <>
                    <Image
                      src={URL.createObjectURL(item.file)}
                      alt={`Selected ${index}`}
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      size="xs"
                      pos="absolute"
                      top={5}
                      right={5}
                      onClick={() => removeItem(index)}
                      radius="xl"
                    >
                      <IconX size={rem(10)} />
                    </ActionIcon>
                  </>
                ) : (
                  <Center style={{ height: "100%" }}>
                    <FileInput
                      multiple
                      placeholder="Chọn ảnh"
                      accept="image/*"
                      value={item.file ? [item.file] : []}
                      onChange={(f) => handleFileChange(index, f)}
                      variant="unstyled"
                      label={
                        <Stack align="center" gap={2} style={{ cursor: "pointer" }}>
                          <IconPhotoPlus size={24} stroke={1.5} color="#909296" />
                          <Text c="#909296" size="10px">Tải nhiều ảnh</Text>
                        </Stack>
                      }
                    />
                  </Center>
                )}
              </Box>

              {/* Description Input Area (Integrated) */}
              <Box p="md" style={{ flex: 1 }}>
                <Textarea
                  placeholder="Mô tả (bắt buộc)"
                  value={item.description}
                  onChange={(e) => handleDescriptionChange(index, e.currentTarget.value)}
                  minRows={2}
                  autosize
                  styles={{
                    input: {
                      backgroundColor: "#2c2c2e",
                      border: "1px solid #3a3a3c",
                      borderRadius: rem(4),
                      color: "#fff",
                      padding: "6px 10px",
                      fontSize: rem(12),
                      "&:focus": {
                        borderColor: "#3598dc",
                      },
                    },
                  }}
                />
                
              </Box>
            </Paper>
          ))}
        </SimpleGrid>

        {/* ===== ORIGINAL BUTTONS ===== */}
        <Group justify="space-between" mt="sm">
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
      </Stack>
    </Box>
  );
};

export default CreateImg;
