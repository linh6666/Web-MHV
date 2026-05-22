"use client";

import { Image, Modal, Text, Loader, Center, ActionIcon, Badge, ScrollArea } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { Getlisthome } from "../../../../../api/apiGetListHome";
import styles from "./ModalItem.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { IconMaximize, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export interface DataDetail {
  id: number;
  leaf_id?: string;
  unit_code?: string;
  unit_name?: string;
  layer6?: string;
  describe?: string;
  description_vi?: string;
  describe_vi?: string;
  // === Extended fields from API ===
  area?: number;
  area_range?: string;
  building_type?: string;
  construction_area_1?: number;
  construction_area_2?: number;
  lot_width?: number;
  lot_depth?: number;
  num_floor?: number;
  price?: number;
  status_unit?: string;
  zone?: string;
  view?: string;
  feature_1?: string;
  feature_2?: string;
  main_door_direction?: string;
  direction?: string;
  layer2?: string;
  layer3?: string;
}

interface HomeDetailItem {
  id: string;
  unit_code: string;
  name_vi?: string;
  name_en?: string;
  description_vi?: string;
  description_en?: string;
  url?: string;
  file_name?: string;
  file_type?: string;
}

interface ModalItemProps {
  opened: boolean;
  onClose: () => void;
  data: DataDetail | null;
  projectId: string | null;
}

export default function ModalItem({
  opened,
  onClose,
  data,
  projectId,
}: ModalItemProps) {
  const [homeData, setHomeData] = useState<HomeDetailItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [zoomOpened, setZoomOpened] = useState(false);

  // ================= FETCH API =================
  const fetchHomeData = useCallback(async () => {
    const targetId = data?.leaf_id || data?.id;
    if (!targetId || !projectId) return;

    try {
      setLoading(true);

      const response = await Getlisthome({
        node_attribute_id: String(targetId),
        project_id: projectId,
      });

      // Xử lý dữ liệu trả về: lấy mảng từ các key phổ biến nếu response là Object
      const homeArray = Array.isArray(response)
        ? response
        : response?.results || response?.data || [];
      setHomeData(homeArray || []);
    } catch (error) {
      console.error("Getlisthome error:", error);
      setHomeData([]);
    } finally {
      setLoading(false);
    }
  }, [data, projectId]);

  useEffect(() => {
    if (!opened || !data) return;

    fetchHomeData();
    setIndex(0);
  }, [opened, data, fetchHomeData]);

  // ================= IMAGE DATA =================
  const imageData = homeData.filter((item) =>
    (item.file_type && item.file_type.startsWith("image/")) ||
    (item.file_name && item.file_name.match(/\.(jpg|jpeg|png|gif)$/i)) ||
    (item.url && item.url?.match(/\.(jpg|jpeg|png|gif)$/i))
  );

  const currentImage = imageData[index];

  // ================= SLIDER =================
  const goNext = () => {
    if (index < imageData.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        // title="Chi tiết căn hộ"
        size="70%"
        radius="md"
        styles={{
          title: {
            fontSize: "calc(16px + 0.5vw)",
            fontWeight: 700,
          },
          content: {
            height: "auto",
            maxHeight: "95vh",
            display: "flex",
            flexDirection: "column",
          },
          body: {
            padding: "clamp(10px, 2vw, 24px)",
            flex: 1,
            overflow: "hidden",
          },
        }}
      >
        {!data ? (
          <Center style={{ height: "200px" }}>
            <Text size="lg" fw={500}>
              Không có dữ liệu
            </Text>
          </Center>
        ) : (
          <div className={styles.container}>
            {/* ================= LEFT ================= */}
            <div className={styles.leftPanel}>
              <ScrollArea h="100%" offsetScrollbars pr={8}>

                {/* Tiêu đề */}
                <Text fw={700} mb={6} className={styles.unitTitle}>
                  Chi tiết {data.layer3 || ""}
                </Text>

                {/* Badge trạng thái */}
                {data.status_unit && data.status_unit.toLowerCase() !== "skip" && (
                  <Badge
                    size="sm"
                    variant="filled"
                    mb={14}
                    color={(() => {
                      switch (data.status_unit!.trim().toUpperCase()) {
                        case "QUAN TÂM": return "#b8893c";
                        case "ĐANG BÁN": return "#3d6985";
                        case "ĐÃ ĐẶT CỌC": return "#cc5c34";
                        case "ĐÃ BÁN": return "#b32f1f";
                        default: return "gray";
                      }
                    })()}
                  >
                    {data.status_unit}
                  </Badge>
                )}

                {/* === THÔNG TIN CHI TIẾT === */}
                <div className={styles.infoGrid}>
                  {data.building_type && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Loại công trình</span>
                      <span className={styles.infoValue}>{data.building_type}</span>
                    </div>
                  )}
                  {data.zone && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Phân khu</span>
                      <span className={styles.infoValue}>{data.zone}</span>
                    </div>
                  )}
                  {data.area != null && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Diện tích đất</span>
                      <span className={styles.infoValue}>{data.area} m²</span>
                    </div>
                  )}
                  {data.construction_area_1 != null && data.construction_area_1 > 0 && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>DT xây dựng T1</span>
                      <span className={styles.infoValue}>{data.construction_area_1} m²</span>
                    </div>
                  )}
                  {data.construction_area_2 != null && data.construction_area_2 > 0 && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>DT xây dựng T2</span>
                      <span className={styles.infoValue}>{data.construction_area_2} m²</span>
                    </div>
                  )}
                  {data.lot_width != null && data.lot_depth != null && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Kích thước</span>
                      <span className={styles.infoValue}>{data.lot_width}m × {data.lot_depth}m</span>
                    </div>
                  )}
                  {data.num_floor != null && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Số tầng</span>
                      <span className={styles.infoValue}>{data.num_floor}</span>
                    </div>
                  )}
                  {(data.main_door_direction || data.direction) && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Hướng</span>
                      <span className={styles.infoValue}>{data.main_door_direction || data.direction}</span>
                    </div>
                  )}
                  {data.view && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>View</span>
                      <span className={styles.infoValue}>{data.view}</span>
                    </div>
                  )}
                  {data.price != null && data.price > 0 && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Giá</span>
                      <span className={styles.infoValue} style={{ color: '#b8893c', fontWeight: 700 }}>
                        {new Intl.NumberFormat('vi-VN').format(data.price)} VNĐ
                      </span>
                    </div>
                  )}
                </div>

                {/* === TIỆN ÍCH === */}
                {(data.feature_1 || data.feature_2) && (
                  <div className={styles.featureSection}>
                    <Text fw={600} size="sm" mb={4} style={{ color: '#294b61' }}>Tiện ích</Text>
                    {data.feature_1 && <Text size="xs" className={styles.featureText}>• {data.feature_1}</Text>}
                    {data.feature_2 && <Text size="xs" className={styles.featureText}>• {data.feature_2}</Text>}
                  </div>
                )}

                {/* === MÔ TẢ === */}
                <Text className={styles.descriptionText} mt={14}>
                  <b>Mô tả:</b> {currentImage?.description_vi || data?.describe_vi || data?.describe || "Chưa có"}
                </Text>

              </ScrollArea>
            </div>

            {/* ================= RIGHT ================= */}
            <div className={styles.rightPanel}>
              {loading ? (
                <Center style={{ height: "400px" }}>
                  <Loader />
                </Center>
              ) : (
                <>
                  {/* ====== IMAGE ====== */}
                  {currentImage && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={currentImage.url || ""}
                        alt=""
                        className={styles.mainImage}
                      />

                      {/* Nút phóng to */}
                      <ActionIcon
                        className={styles.zoomBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomOpened(true);
                        }}
                        variant="filled"
                      >
                        <IconMaximize size={20} />
                      </ActionIcon>

                      {/* prev */}
                      <button
                        className={`${styles.sliderBtn} ${styles.prevBtn}`}
                        onClick={goPrev}
                        disabled={index === 0}
                      >
                        ◀
                      </button>

                      {/* next */}
                      <button
                        className={`${styles.sliderBtn} ${styles.nextBtn}`}
                        onClick={goNext}
                        disabled={index === imageData.length - 1}
                      >
                        ▶
                      </button>
                    </div>
                  )}

                  {/* ===== THUMBNAIL ===== */}
                  <div className={`${styles.thumbList} ${styles.thumbScroll}`}>
                    {imageData.map((img, i) => (
                      <div
                        key={img.id}
                        onClick={() => setIndex(i)}
                        className={`${styles.thumbItem} ${i === index ? styles.thumbItemActive : ""
                          }`}
                      >
                        <Image
                          src={img.url || ""}
                          alt=""
                          className={styles.thumbImage}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ================= FULLSCREEN ZOOM MODAL ================= */}
      <Modal
        opened={zoomOpened}
        onClose={() => setZoomOpened(false)}
        fullScreen
        zIndex={2000}
        withCloseButton={false}
        styles={{
          content: { background: "rgba(22, 42, 54, 0.92)", backdropFilter: "blur(5px)" },
          body: { padding: 0, height: "100vh", position: "relative" }
        }}
      >
        <ActionIcon
          onClick={() => setZoomOpened(false)}
          variant="transparent"
          style={{ position: "fixed", top: 20, right: 20, zIndex: 2010 }}
        >
          <IconX size={40} color="white" />
        </ActionIcon>

        <div className={styles.zoomContainer}>
          {/* Cột trái (Image Zoom) */}
          <div className={styles.zoomLeftPanel}>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={5}
              centerOnInit
            >
              {({ resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: "100%", height: "100%" }}
                  >
                    <div className={styles.zoomOverlay}>
                      <img
                        src={currentImage?.url || ""}
                        alt="Zoomed"
                        className={styles.zoomImg}
                      />
                    </div>
                  </TransformComponent>

                  {/* Phím điều hướng trong zoom */}
                  {imageData.length > 1 && (
                    <>
                      <ActionIcon
                        className={`${styles.zoomNavBtn} ${styles.zoomPrevBtn}`}
                        onClick={() => {
                          resetTransform();
                          goPrev();
                        }}
                        disabled={index === 0}
                      >
                        <IconChevronLeft size={48} />
                      </ActionIcon>

                      <ActionIcon
                        className={`${styles.zoomNavBtn} ${styles.zoomNextBtn}`}
                        onClick={() => {
                          resetTransform();
                          goNext();
                        }}
                        disabled={index === imageData.length - 1}
                      >
                        <IconChevronRight size={48} />
                      </ActionIcon>
                    </>
                  )}
                </>
              )}
            </TransformWrapper>
          </div>

          {/* Cột phải (Description) */}
          <div className={styles.zoomRightPanel}>
            <Text size="lg" fw={600} mb="md" style={{ color: "#D4B068", textTransform: "uppercase" }}>
              {currentImage?.name_vi || data?.layer6 || "CHI TIẾT MÔ HÌNH"}
            </Text>
            <Text size="sm" style={{ color: "white", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              Mô tả: {currentImage?.description_vi || data?.describe_vi || data?.describe || ""}
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
}
