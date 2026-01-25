"use client";

import { Image, Modal, Text } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createNodeAttribute } from "../../../api/apifilter3";
import { Getlisthome } from "../../../api/apiGetListHome";

/* ===================== INTERFACES ===================== */

export interface NodeAttributeItem {
  id: string;
  unit_code: string;
  layer1?: string;
  layer2?: string;
  layer3?: string;
  zone?: string;
  building_type?: string;
  bedroom?: number | string;
  bathroom?: number | string;
  view?: string;
  status_unit?: string;
  price?: number;
  describe?: string;
  describe_vi?: string;
  main_door_direction?: string;
  balcony_direction?: string;
  direction?: string;
  url?: string;
  name_vi?: string;
  name_en?: string;
  description_en?: string;
}

export interface HomeDetailItem {
  id: string;
  unit_code: string;
  name_vi?: string;
  name_en?: string;
  describe_vi?: string;
  description_en?: string;
  url?: string;
  direction?: string;
  bedroom?: number;
  bathroom?: string;
  price?: number;
}

interface InfoModalProps {
  opened: boolean;
  onClose: () => void;
  clickedModel: string | null;
  projectId: string | null;
  initialPhase?: string | null;
  initialLayer2?: string | null;
}

/* ===================== COMPONENT ===================== */

export default function InfoModal({
  opened,
  onClose,
  clickedModel,
  projectId,
  initialPhase,
  initialLayer2,
}: InfoModalProps) {
  const searchParams = useSearchParams();

  /* ====== LAYER PARAM ====== */
  const phase =
    searchParams.get("layer3") || initialPhase || "";
  const layer2 =
    searchParams.get("layer2") || initialLayer2 || "";

  /* ====== STATE ====== */
  const [apiData, setApiData] = useState<NodeAttributeItem[]>([]);
  const [homeData, setHomeData] = useState<HomeDetailItem[]>([]);
  const [index, setIndex] = useState(0);

  /* ===================== API CALLS ===================== */

  // 🔹 createNodeAttribute
  const fetchNodeData = useCallback(
    async (layer1: string) => {
      if (!projectId) return;

      try {
        const data = await createNodeAttribute({
          project_id: projectId,
          filters: [
            { values: ["ct"] },
            { label: "layer3", values: [phase] },
            { label: "layer2", values: [layer2] },
            { label: "layer1", values: [layer1] },
          ],
        });

        if (Array.isArray(data)) {
          setApiData(data);
        } else if (Array.isArray(data?.data)) {
          setApiData(data.data);
        } else {
          setApiData([]);
        }

        setIndex(0);
      } catch (error) {
        console.error("❌ createNodeAttribute error:", error);
        setApiData([]);
      }
    },
    [projectId, phase, layer2]
  );

  // 🔹 Getlisthome
  const fetchHomeData = useCallback(async () => {
    if (!projectId || !clickedModel) return;

    try {
      const response = await Getlisthome({
        project_id: projectId,
        unit_code: clickedModel,
      });
      setHomeData(response as HomeDetailItem[]);
    } catch (error) {
      console.error("❌ Getlisthome error:", error);
      setHomeData([]);
    }
  }, [projectId, clickedModel]);

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    if (!opened || !clickedModel) return;

    fetchNodeData(clickedModel); // ✅ FIX LỖI
    fetchHomeData();
  }, [opened, clickedModel, fetchNodeData, fetchHomeData]);

  /* ===================== DATA PROCESS ===================== */

  const filteredData = apiData.filter(
    (item) => item.layer1 === clickedModel
  );

  const imageData = filteredData.filter((item) =>
    item.url?.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  const pdfData = filteredData.filter((item) =>
    item.url?.match(/\.pdf$/i)
  );

  const currentImage = imageData[index];

  /* ===================== SLIDER HANDLER ===================== */

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

  /* ===================== RENDER ===================== */

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thông Tin Chi Tiết"
      size="70%"
    >
      {filteredData.length === 0 ? (
        <Text>Không có dữ liệu phù hợp</Text>
      ) : (
        <div style={{ display: "flex", gap: "20px", height: "80vh" }}>
          {/* ================= LEFT ================= */}
          <div style={{ flex: 1 }}>
            {filteredData.map((item) => (
              <div key={item.id}>
                <Text fw={700} mb={12} fz={18}>
                  Chi tiết căn hộ: {item.unit_code}
                </Text>

                <Text>Tòa: {item.layer3}</Text>

                <Text>
                  {item.building_type
                    ? `Loại công trình: ${item.building_type}`
                    : `Vị trí: ${item.layer2}`}
                </Text>

                <Text>Phòng ngủ: {item.bedroom}</Text>

                <Text>
                  Phòng tắm:{" "}
                  {item.bathroom?.toString().trim().toLowerCase() === "skip"
                    ? "chưa có"
                    : item.bathroom}
                </Text>

                <Text>Cảnh quan: {item.view}</Text>
                <Text>Trạng thái: {item.status_unit}</Text>

                <Text>
                  Giá:{" "}
                  {item.price
                    ? `${item.price.toLocaleString()}đ`
                    : "Chưa có"}
                </Text>

                <Text mt={8}>
                  <b>Mô tả:</b> {item.describe_vi || item.describe}
                </Text>
              </div>
            ))}

            {/* ====== Getlisthome ====== */}
            {homeData.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <Text fw={600}>Thông tin bổ sung:</Text>
                {homeData.map((h) => (
                  <Text key={h.id}>
                    👉 {h.name_vi || h.name_en}
                  </Text>
                ))}
              </div>
            )}

            {/* ====== PDF ====== */}
            {pdfData.map((pdf) => (
              <div key={pdf.id} style={{ marginTop: "10px" }}>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {pdf.name_vi || pdf.name_en || pdf.id}
                </a>
              </div>
            ))}
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
            {currentImage && (
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <Image
                  src={currentImage.url || ""}
                  alt={currentImage.description_en || ""}
                  width={800}
                  height={600}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />

                <button
                  onClick={goPrev}
                  disabled={index === 0}
                  style={{ position: "absolute", left: 10, top: "50%" }}
                >
                  ◀
                </button>

                <button
                  onClick={goNext}
                  disabled={index === imageData.length - 1}
                  style={{ position: "absolute", right: 10, top: "50%" }}
                >
                  ▶
                </button>
              </div>
            )}

            {/* ====== THUMBNAIL ====== */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {imageData.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setIndex(i)}
                  style={{
                    border:
                      i === index
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: "4px",
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
          </div>
        </div>
      )}
    </Modal>
  );
}
