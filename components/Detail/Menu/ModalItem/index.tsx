"use client";

import { Image, Modal, Text, Loader, Center } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { Getlisthome } from "../../../../api/apiGetListHome";

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
    <Modal opened={opened} onClose={onClose} title="Chi tiết căn hộ" size="70%">
      {!data ? (
        <Text size="lg" fw={500}>
          Không có dữ liệu
        </Text>
      ) : (
        <div style={{ display: "flex", gap: 20, height: "80vh" }}>
          {/* ================= LEFT ================= */}
          <div style={{ flex: 1 }}>
            <Text fw={700} mb={12} fz={18}>
              Chi tiết căn hộ: {data.layer6}
            </Text>

            <Text mt={8}>
              <b>Mô tả:</b> {data.describe_vi || data.describe || "Chưa có"}
            </Text>

            {/* ===== thông tin bổ sung ===== */}
            {/* {homeData.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text fw={600}>Thông tin bổ sung:</Text>

                {homeData.map((item) => (
                  <Text key={item.id}>
                    👉 {item.name_vi || item.name_en || "Không có tên"}
                  </Text>
                ))}
              </div>
            )} */}
          </div>

          {/* ================= RIGHT ================= */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Center style={{ height: "400px" }}>
                <Loader />
              </Center>
            ) : (
              <>
                {/* ====== IMAGE ====== */}
                {currentImage && (
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    <Image
                      src={currentImage.url || ""}
                      alt=""
                      width={800}
                      height={600}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 8,
                      }}
                    />

                    {/* prev */}
                    <button
                      onClick={goPrev}
                      disabled={index === 0}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        cursor: "pointer",
                      }}
                    >
                      ◀
                    </button>

                    {/* next */}
                    <button
                      onClick={goNext}
                      disabled={index === imageData.length - 1}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        cursor: "pointer",
                      }}
                    >
                      ▶
                    </button>
                  </div>
                )}

                {/* ===== THUMBNAIL ===== */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {imageData.map((img, i) => (
                    <div
                      key={img.id}
                      onClick={() => setIndex(i)}
                      style={{
                        border:
                          i === index
                            ? "2px solid #3d6985"
                            : "1px solid #ccc",
                        cursor: "pointer",
                        borderRadius: 4,
                        padding: 2,
                      }}
                    >
                      <Image
                        src={img.url || ""}
                        width={80}
                        height={60}
                        alt=""
                        style={{ objectFit: "cover" }}
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