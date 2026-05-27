"use client";

import { Image, Modal, Text, Loader, Center, ActionIcon } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { Getlisthome } from "../../../../api/apiGetListHome";
import styles from "./ModalItem.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { IconMaximize, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface DataDetail {
  id: number;
  leaf_id?: string;
  unit_code: string;
  layer2?: string;
  layer3?: string;
  layer6?: string;
  zone?: string;
  building_type?: string;
  bedroom?: number | string;
  bathroom?: number | string;
  view?: string;
  status_unit?: string;
  price?: number | string;
  describe?: string;
  describe_vi?: string;
  main_door_direction?: string;
  balcony_direction?: string;
  direction?: string;
  construction_area_1?: number | string;
  construction_area_2?: number | string;
  feature_1?: string;
  feature_2?: string;
  num_floor?: number | string;
  lot_depth?: number | string;
  lot_width?: number | string;
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
const formatDirection = (dir?: string) => {
  if (!dir) return "";
  const cleanDir = dir.trim().toUpperCase();
  if (cleanDir === "SKIP") return "";

  switch (cleanDir) {
    case "B":
      return "Bắc";
    case "ĐB":
      return "Đông Bắc";
    case "Đ":
      return "Đông";
    case "TB":
      return "Tây Bắc";
    case "ĐN":
      return "Đông Nam";
    case "T":
      return "Tây";
    case "TN":
      return "Tây Nam";
    case "N":
      return "Nam";
    default:
      return dir;
  }
};
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

  const hasValue = (value?: string | number) => {
    if (value == null) return false;
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed !== "" && trimmed.toLowerCase() !== "skip";
    }
    return true;
  };

  const formatPrice = (value?: string | number) => {
    if (!hasValue(value)) return "";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return "";
    return `${new Intl.NumberFormat("vi-VN").format(numericValue)} VNĐ`;
  };

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
              <Text fw={700} mb={12} className={styles.unitTitle}>
                CHI TIẾT: {data.layer2 }
              </Text>

              <div className={styles.infoGrid}>
                {/* {hasValue(data.unit_code) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Mã căn:</span>
                    <span className={styles.infoValue}>{data.unit_code}</span>
                  </div>
                )} */}
                {/* {hasValue(data.zone || data.layer3) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phân khu:</span>
                    <span className={styles.infoValue}>{data.zone || data.layer3}</span>
                  </div>
                )}
                {hasValue(data.layer3) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Tòa:</span>
                    <span className={styles.infoValue}>{data.layer3}</span>
                  </div>
                )} */}
                {hasValue(data.layer3) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Tên căn:</span>
                    <span className={styles.infoValue}>{data.layer3}</span>
                  </div>
                )}
                {hasValue(data.building_type) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Loại công trình:</span>
                    <span className={styles.infoValue}>{data.building_type}</span>
                  </div>
                )}
                {hasValue(data.construction_area_1) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>DT xây dựng T1:</span>
                    <span className={styles.infoValue}>{data.construction_area_1} m²</span>
                  </div>
                )}
                {hasValue(data.construction_area_2) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>DT xây dựng T2:</span>
                    <span className={styles.infoValue}>{data.construction_area_2} m²</span>
                  </div>
                )}
                {hasValue(data.num_floor) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Số tầng:</span>
                    <span className={styles.infoValue}>{data.num_floor}</span>
                  </div>
                )}
                {(hasValue(data.lot_width) || hasValue(data.lot_depth)) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Kích thước:</span>
                    <span className={styles.infoValue}>
                      {hasValue(data.lot_width) ? `${data.lot_width}m` : "-"} x {hasValue(data.lot_depth) ? `${data.lot_depth}m` : "-"}
                    </span>
                  </div>
                )}
                {hasValue(data.bedroom) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phòng ngủ:</span>
                    <span className={styles.infoValue}>{data.bedroom}</span>
                  </div>
                )}
                {hasValue(data.bathroom) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phòng tắm:</span>
                    <span className={styles.infoValue}>{data.bathroom}</span>
                  </div>
                )}
                {/* {hasValue(data.direction) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Hướng:</span>
                    <span className={styles.infoValue}>{data.direction}</span>
                  </div>
                )} */}
                {hasValue(data.main_door_direction) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Hướng cửa chính:</span>
                    <span className={styles.infoValue}>{data.main_door_direction}</span>
                  </div>
                )}
                {hasValue(data.balcony_direction) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Hướng ban công:</span>
                    <span className={styles.infoValue}>{data.balcony_direction}</span>
                  </div>
                )}
                {hasValue(data.view) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cảnh quan:</span>
                    <span className={styles.infoValue}>{data.view}</span>
                  </div>
                )}
                {formatPrice(data.price) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Giá:</span>
                    <span className={styles.infoValue}>{formatPrice(data.price)}</span>
                  </div>
                )}
                {hasValue(data.status_unit) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Trạng thái:</span>
                    <span className={styles.infoValue}>{data.status_unit}</span>
                  </div>
                )}
                {hasValue(data.feature_1) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Tiện ích:</span>
                    <span className={styles.infoValue}>{data.feature_1}</span>
                  </div>
                )}
                {hasValue(data.feature_2) && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Hướng:</span>
                    <span className={styles.infoValue}>{formatDirection(data.feature_2)}</span>
                  </div>
                )}
              </div>

              <Text className={styles.descriptionText}>
                <b>Mô tả:</b> {currentImage?.description_vi || data.describe_vi || data.describe || "Chưa có"}
              </Text>
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
                        className={`${styles.thumbItem} ${
                          i === index ? styles.thumbItemActive : ""
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
