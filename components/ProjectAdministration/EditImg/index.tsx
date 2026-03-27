"use client";

import React, { useEffect, useState } from "react";
import {
  FileInput,
  Button,
  LoadingOverlay,
  TextInput,
  Textarea, // 👈 Thêm vào đây để sử dụng
  Group,
  Paper,
  Text,
  Title,
  SimpleGrid,
  Image,
  Badge,
  Stack,
  Divider,
  ActionIcon,
  Tooltip,
  Box,
  Center,
  AspectRatio,
  ScrollArea,
  Overlay,
  Transition,
} from "@mantine/core";
import {
  IconUpload,
  IconTrash,
  IconPhoto,
  IconCheck,
  IconAlertCircle,
  IconPhotoOff,
  IconEdit,
  IconInfoCircle,
  IconAdjustments
} from "@tabler/icons-react";

import { Getlisthome } from "../../../api/apiGetListHome";
import { createImg } from "../../../api/apiEditimg";
import { deleteImg } from "../../../api/apiDeleteImg";

/* =======================
   TYPES
======================= */
interface HomeImage {
  id: string;
  unit_code: string;
  url: string;
  name_vi?: string | null;
  name_en?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
}

/* =======================
   PROPS (GIỮ NGUYÊN)
======================= */
export interface CreateImgProps {
  projectId: string;
  unitCode: string;
  idItem?: string[];
  onSearch: () => Promise<void> | void;
  onClose?: () => void;
}

/* =======================
   COMPONENT
======================= */
const EditImg: React.FC<CreateImgProps> = ({
  projectId,
  unitCode,
  onSearch,
  onClose,
}) => {
  const [images, setImages] = useState<HomeImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [descriptionVi, setDescriptionVi] = useState("");

  const selectedImg = images.find((img) => img.id === selectedImageId);

  /* =======================
     FETCH LIST IMAGE
  ======================= */
  const fetchListHome = async () => {
    try {
      setLoading(true);
      const data = await Getlisthome({
        project_id: projectId,
        unit_code: unitCode,
      });
      setImages(data || []);
    } catch (error) {
      console.error("Lỗi khi gọi Getlisthome:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListHome();
  }, [projectId, unitCode]);

  /* =======================
     SELECT IMAGE
  ======================= */
  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
    setFile(null);
    const img = images.find((i) => i.id === id);
    setDescriptionVi(img?.description_vi || "");
  };

  /* =======================
     UPLOAD / UPDATE IMAGE
  ======================= */
  const handleUpload = async () => {
    if (!selectedImageId) return;

    try {
      setLoading(true);
      await createImg(projectId, selectedImageId, {
        files: file ? [file] : [],
        description_vi: descriptionVi,
      });
      await fetchListHome();
      await onSearch();
      // Sau khi cập nhật xong, có thể để người dùng ở lại hoặc đóng tùy nhu cầu
      // onClose?.();
    } catch (error) {
      console.error("Upload lỗi:", error);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  /* =======================
     DELETE IMAGE
  ======================= */
  const handleDelete = async () => {
    if (!selectedImageId) return;

    const ok = window.confirm("Xác nhận xóa hình ảnh này?");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteImg(projectId, selectedImageId);
      setSelectedImageId(null);
      setFile(null);
      await fetchListHome();
      await onSearch();
    } catch (error) {
      console.error("Xóa ảnh lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 1, radius: "lg" }} />

      {/* HEADER SECTION - WORKSPACE STYLE */}
      <Paper p="lg" mb="xl" radius="md" bg="gray.0" withBorder>
        <Group justify="space-between">
          <Stack gap={4}>
            <Group gap="xs">
              <IconAdjustments size={24} color="var(--mantine-color-blue-6)" />
              <Title order={3} fw={800}>Tùy chỉnh Thư viện Ảnh</Title>
            </Group>
            <Text c="dimmed" size="xs" fw={500} ml={32}>
              Đang chỉnh sửa cho căn: <Badge color="blue" variant="outline" size="sm">{unitCode}</Badge>
            </Text>
          </Stack>
          <Group gap="xl">
             <Divider orientation="vertical" />
             <Box style={{ textAlign: "right" }}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Trạng thái lưu</Text>
                <Text size="sm" fw={700} c="green.7">Bản ghi đã đồng bộ</Text>
             </Box>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {/* LEFT COLUMN: SCROLLABLE GALLERY */}
        <Box style={{ gridColumn: "span 2" }}>
          <Group mb="md" justify="space-between">
            <Stack gap={0}>
              <Text fw={900} size="sm" tt="uppercase" lts={1} c="dark.5">Phòng Trưng Bày</Text>
              <Text size="10px" c="dimmed" fw={600}>Chọn ảnh bạn muốn hiệu chỉnh</Text>
            </Stack>
            <Badge variant="dot" color="blue" size="sm">Ảnh: {images.length}</Badge>
          </Group>
          
          <ScrollArea h={550} offsetScrollbars scrollbarSize={4} type="hover">
            {!loading && images.length === 0 ? (
              <Center py={80} style={{ border: "2px dashed var(--mantine-color-gray-2)", borderRadius: 16 }}>
                 <Stack align="center" gap="xs">
                    <IconPhotoOff size={40} color="var(--mantine-color-gray-3)" stroke={1.5} />
                    <Text c="dimmed" size="xs" fw={600}>Chưa có ảnh nào được tải lên</Text>
                 </Stack>
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" pr="sm">
                {images.map((item) => {
                  const isActive = item.id === selectedImageId;
                  return (
                    <Paper
                      key={item.id}
                      onClick={() => handleSelectImage(item.id)}
                      radius="md"
                      p={isActive ? 4 : 2}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isActive ? "var(--mantine-color-blue-6)" : "#fff",
                        border: isActive ? "none" : "1px solid var(--mantine-color-gray-1)",
                        transition: "all 0.2s ease",
                        boxShadow: isActive ? "0 8px 16px -8px rgba(34, 139, 230, 0.4)" : "none",
                      }}
                    >
                      <Box style={{ borderRadius: 8, overflow: "hidden", position: "relative" }}>
                        <AspectRatio ratio={1 / 1}>
                          <Image src={item.url} fallbackSrc="https://placehold.co/400x400" />
                        </AspectRatio>
                        {isActive && (
                          <Box pos="absolute" top={6} right={6} style={{ zIndex: 10 }}>
                             <Box bg="white" p={2} style={{ borderRadius: "50%", display: "flex", boxShadow: "var(--mantine-shadow-xs)" }}>
                                <IconCheck size={10} color="var(--mantine-color-blue-6)" stroke={4} />
                             </Box>
                          </Box>
                        )}
                      </Box>
                      <Box p={4} ta="center">
                        <Text size="9px" fw={isActive ? 800 : 700} c={isActive ? "white" : "dark.4"} truncate="end">
                          {item.description_vi || "---"}
                        </Text>
                      </Box>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            )}
          </ScrollArea>
        </Box>

        {/* RIGHT COLUMN: PREMIUM EDITOR PANEL */}
        <Box>
          <Paper withBorder p="md" radius="md" shadow="xs" bg="white" pos="sticky" top={10}>
            <Title order={5} mb="md" c="blue.8">Hiệu Chỉnh</Title>

            {!selectedImageId ? (
              <Center py={60} style={{ border: "2px dashed var(--mantine-color-gray-1)", borderRadius: 10 }}>
                <Stack align="center" gap={4}>
                  <IconInfoCircle size={24} color="var(--mantine-color-gray-4)" />
                  <Text size="11px" c="dimmed" ta="center">Chọn ảnh bên trái</Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap="md">
                <Box>
                  <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={file ? URL.createObjectURL(file) : selectedImg?.url}
                        fallbackSrc="https://placehold.co/600x400"
                      />
                    </AspectRatio>
                  </Paper>
                </Box>

                <Stack gap={8}>
                  <Textarea
                    label="Mô tả tiêu đề"
                    placeholder="Nhập mô tả chi tiết tại đây..."
                    value={descriptionVi}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescriptionVi(e.target.value)}
                    radius="sm"
                    size="xs"
                    autosize
                    minRows={2}
                    maxRows={6}
                    styles={{ 
                      label: { fontWeight: 700, fontSize: 11, marginBottom: 4 },
                      input: { fontSize: 12, lineHeight: 1.4 }
                    }}
                  />
                  <FileInput
                    label="Ảnh mới"
                    placeholder="Chọn file"
                    value={file}
                    onChange={setFile}
                    accept="image/*"
                    radius="sm"
                    size="xs"
                    leftSection={<IconUpload size={14} />}
                    styles={{ label: { fontWeight: 700, fontSize: 11, marginBottom: 4 } }}
                  />
                </Stack>

                <Divider />

                <Stack gap={6}>
                  <Button
                    size="xs"
                    radius="sm"
                    leftSection={<IconCheck size={14} />}
                    onClick={handleUpload}
                    variant="filled"
                    color="blue.6"
                    fullWidth
                  >
                    Lưu Thay Đổi
                  </Button>
                  
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    radius="sm"
                    leftSection={<IconTrash size={14} />}
                    onClick={handleDelete}
                    fullWidth
                  >
                    Xóa tệp tin
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default EditImg;






