"use client";

import React, { useEffect, useState } from "react";
import {
  FileInput,
  Button,
  LoadingOverlay,
  Textarea,
  Group,
  Paper,
  Text,
  Title,
  SimpleGrid,
  Image,
  Stack,
  Divider,
  Box,
  Center,
  AspectRatio,
  ScrollArea,
} from "@mantine/core";
import {
  IconUpload,
  IconTrash,
  IconCheck,
  IconPhotoOff,
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

export interface CreateImgProps {
  projectId: string;
  unitCode: string;
  idItem?: string[];
  onSearch: () => Promise<void> | void;
  onClose?: () => void;
}

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

  const fetchListHome = async () => {
    try {
      setLoading(true);
      const data = await Getlisthome({ project_id: projectId, unit_code: unitCode });
      setImages(data || []);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListHome();
  }, [projectId, unitCode]);

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
    setFile(null);
    const img = images.find((i) => i.id === id);
    setDescriptionVi(img?.description_vi || "");
  };

  const handleUpload = async () => {
    if (!selectedImageId) return;
    try {
      setLoading(true);
      await createImg(projectId, selectedImageId, { 
        files: file ? [file] : [], 
        description_vi: descriptionVi 
      });
      await fetchListHome();
      await onSearch();
    } catch (error) {
      console.error("Lỗi upload:", error);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedImageId) return;
    if (window.confirm("Xác nhận xóa hình ảnh này?")) {
      try {
        setLoading(true);
        await deleteImg(projectId, selectedImageId);
        setSelectedImageId(null);
        setFile(null);
        await fetchListHome();
        await onSearch();
      } catch (error) {
        console.error("Lỗi xóa:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box pos="relative" p="sm" bg="gray.1" style={{ borderRadius: 8 }}>
      <LoadingOverlay visible={loading} overlayProps={{ blur: 0, opacity: 0.3 }} />

      <Group justify="space-between" mb="xs">
        <Title order={4}>Căn hộ: {unitCode} ({images.length} ảnh)</Title>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 10 }} spacing="sm">
        {/* THƯ VIỆN - TỐI ƯU DIỆN TÍCH */}
        <Box style={{ gridColumn: "span 7" }}>
          <Paper withBorder p={4} radius="xs">
            <ScrollArea h={620} offsetScrollbars>
              {images.length === 0 ? (
                <Center h={200}><Text c="dimmed">Chưa có ảnh</Text></Center>
              ) : (
                <SimpleGrid cols={{ base: 3, sm: 4, md: 5, lg: 6 }} spacing={4}>
                  {images.map((item) => {
                    const isActive = item.id === selectedImageId;
                    return (
                      <Box
                        key={item.id}
                        onClick={() => handleSelectImage(item.id)}
                        style={{
                          cursor: "pointer",
                          border: isActive ? "3px solid #007bff" : "1px solid #eee",
                          padding: 2,
                          backgroundColor: isActive ? "#e7f5ff" : "white",
                        }}
                      >
                        <AspectRatio ratio={1 / 1}>
                          <Image src={item.url} fallbackSrc="https://placehold.co/200x200" />
                        </AspectRatio>
                        <Text size="9px" truncate mt={1} ta="center" fw={isActive ? 800 : 400}>
                           {item.description_vi || "---"}
                        </Text>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
            </ScrollArea>
          </Paper>
        </Box>

        {/* BẢNG ĐIỀU KHIỂN - TRỰC DIỆN */}
        <Box style={{ gridColumn: "span 3" }}>
          <Paper withBorder p="sm" radius="xs" pos="sticky" top={0} bg="white">
            {!selectedImageId ? (
              <Center h={200}><Text size="xs" c="dimmed">Bấm chọn 1 ảnh bên trái</Text></Center>
            ) : (
              <Stack gap="xs">
                <AspectRatio ratio={16 / 10} style={{ border: "1px solid #eee" }}>
                  <Image src={file ? URL.createObjectURL(file) : selectedImg?.url} />
                </AspectRatio>

                <FileInput
                  label="Thay ảnh mới"
                  placeholder="Chọn file..."
                  value={file}
                  onChange={setFile}
                  accept="image/*"
                  size="xs"
                  styles={{ label: { fontWeight: 700 } }}
                />

                <Textarea
                  label="Mô tả"
                  placeholder="Nhập ghi chú nhanh..."
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  size="xs"
                  autosize
                  minRows={3}
                  maxRows={6}
                  styles={{ label: { fontWeight: 700 } }}
                />

                <Divider my={4} />

                <Button 
                  fullWidth 
                  color="blue" 
                  size="md"
                  leftSection={<IconCheck size={18} />} 
                  onClick={handleUpload}
                >
                  CẬP NHẬT
                </Button>

                <Button 
                  fullWidth 
                  variant="subtle" 
                  color="red" 
                  size="xs" 
                  leftSection={<IconTrash size={14} />} 
                  onClick={handleDelete}
                >
                  XÓA ẢNH
                </Button>
              </Stack>
            )}
          </Paper>
        </Box>
      </SimpleGrid>

    </Box>
  );
};

export default EditImg;



