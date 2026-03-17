"use client";

import { Image, Modal, Text, Loader, Center } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { Getlisthome } from "../../../../api/apiGetListHome";
import styles from "./ModalItem.module.css";

interface DataDetail {
  id: number;
  unit_code: string;
  layer6?: string;
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
        <Text size="lg" fw={500}>
          Không có dữ liệu
        </Text>
      ) : (
        <div className={styles.container}>
          {/* ================= LEFT ================= */}
          <div className={styles.leftPanel}>
            <Text fw={700} mb={12} className={styles.unitTitle}>
              Chi tiết: {data.layer6}
            </Text>

            <Text className={styles.descriptionText}>
              <b>Mô tả:</b> {data.describe_vi || data.describe || "Chưa có"}
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
  );
}