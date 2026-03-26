"use client";

import { Image, Modal, Text, Loader, Center, ActionIcon } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { Getlisthome } from "../../../../api/apiGetListHome";
import styles from "./ModalItem.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { IconMaximize, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface DataDetail {
  id: number;
  unit_code: string;
  layer6?: string;
  layer7?: string;
  describe?: string;
  describe_vi?: string;
}

interface HomeDetailItem {
  id: string;
  unit_code: string;
  name_vi?: string;
  name_en?: string;
  description_vi?: string;
  description_en?: string;
  url?: string;
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
    if (!projectId || !data?.unit_code) return;

    try {
      setLoading(true);

      const response = await Getlisthome({
        project_id: projectId,
        unit_code: data.unit_code,
      });

      setHomeData(response || []);
    } catch (error) {
      console.error("Getlisthome error:", error);
      setHomeData([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, data?.unit_code]);

  useEffect(() => {
    if (!opened || !data) return;

    fetchHomeData();
    setIndex(0);
  }, [opened, data, fetchHomeData]);

  // ================= IMAGE DATA =================
  const imageData = homeData.filter((item) =>
    item.url?.match(/\.(jpg|jpeg|png|gif)$/i)
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
                Chi tiết: {data.layer7 || data.layer6}
              </Text>

              <Text className={styles.descriptionText}>
                <b>Mô tả:</b> {data.describe_vi || data.describe || "Chưa có tiện ích"}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                        disabled={index === 0}
                      >
                        ◀
                      </button>

                      {/* next */}
                      <button
                        className={`${styles.sliderBtn} ${styles.nextBtn}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goNext();
                        }}
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
              {currentImage?.name_vi || data?.layer7 || data?.layer6 || "CHI TIẾT TIỆN ÍCH"}
            </Text>
            <Text size="sm" style={{ color: "white", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              Mô tả : {currentImage?.description_vi || "Chưa có nội dung"}
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
}
