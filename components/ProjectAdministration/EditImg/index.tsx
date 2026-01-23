"use client";

import React, { useEffect, useState } from "react";
import {
  FileInput,
  Button,
  LoadingOverlay,
  TextInput,
  Group,
} from "@mantine/core";

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
  };

  /* =======================
     UPLOAD / UPDATE IMAGE
  ======================= */
  const handleUpload = async () => {
    if (!file || !selectedImageId) return;

    try {
      setLoading(true);

      await createImg(projectId, selectedImageId, {
        files: [file],
      });

      await fetchListHome();
      await onSearch();
      onClose?.();
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

    const ok = window.confirm("Bạn có chắc muốn xóa ảnh này không?");
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

  /* =======================
     RENDER
  ======================= */
  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} />

      <h3>Danh sách hình ảnh</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginTop: 16,
        }}
      >
        {/* ===== LEFT: IMAGE LIST ===== */}
        <div>
          {!loading && images.length === 0 && (
            <p>Không có hình ảnh</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {images.map((item) => {
              const isActive = item.id === selectedImageId;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectImage(item.id)}
                  style={{
                    border: isActive
                      ? "2px solid #228be6"
                      : "1px solid #ddd",
                    borderRadius: 8,
                    padding: 6,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.unit_code}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== RIGHT: EDIT IMAGE ===== */}
        <div>
          <h4>Sửa ảnh</h4>

          <TextInput
            label="ID ảnh đang chọn"
            value={selectedImageId ?? ""}
            readOnly
            placeholder="Chọn ảnh bên trái"
          />

          <FileInput
            mt="md"
            label="Chọn ảnh mới"
            placeholder="Chọn file"
            accept="image/png,image/jpeg"
            value={file}
            onChange={setFile}
            disabled={!selectedImageId}
          />

          <Group mt="md" grow>
            <Button
              disabled={!file || !selectedImageId}
              onClick={handleUpload}
            >
              Sửa
            </Button>

            <Button
              color="red"
              variant="outline"
              disabled={!selectedImageId}
              onClick={handleDelete}
            >
              Xóa ảnh
            </Button>
          </Group>
        </div>
      </div>
    </div>
  );
};

export default EditImg;






