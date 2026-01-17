"use client";

import { Image } from "@mantine/core";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useSearchParams } from "next/navigation";

interface ZoningSystemProps {
  project_id: string | null;
  layer7?: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  const searchParams = useSearchParams();
  const urlLayer7 = searchParams.get("layer7");
  const [currentLayer7, setCurrentLayer7] = useState<string>(urlLayer7 || "");
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  // ✅ Hàm pan/zoom tới layer7 tương ứng
  const panToLayer7 = (layer7: string) => {
    if (!transformRef.current) return;

    switch (layer7) {
      case "THE MARINA":
        transformRef.current.setTransform(-117, -81, 1.2);
        break;
      case "THE STELLA":
        transformRef.current.setTransform(-50, -20, 1.2); // 👉 chỉnh theo vị trí thực tế
        break;
      case "THE HERITAGE":
        transformRef.current.setTransform(-200, -150, 1.3); // 👉 chỉnh theo vị trí thực tế
        break;
      case "THE OPERA":
        transformRef.current.setTransform(-172, -157, 1.2); // 👉 chỉnh theo vị trí thực tế
        break;
      default:
        break;
    }
  };

  // ✅ Khi load URL lần đầu → tự động pan
  useEffect(() => {
    if (!transformRef.current || !urlLayer7) return;
    const timer = setTimeout(() => {
      panToLayer7(urlLayer7);
    }, 150); // chờ DOM render
    return () => clearTimeout(timer);
  }, [urlLayer7]);

  // ✅ Khi click hoặc chọn từ Menu
  const handleLayer7Change = (newLayer7: string) => {
    setCurrentLayer7(newLayer7);
    panToLayer7(newLayer7);
  };

  // ✅ Dữ liệu các phase vẽ SVG
  const phasePaths = [
    {
      name: "THE STELLA",
      fill: "rgba(237,155,0,0.3)",
      stroke: "#fcb814",
      textX: 250,
      textY: 600,
      d: "M-17923.908-22398.258l11.6,72.9,34.793,439.068s104.385-14.084,138.35-16.568s132.549,0,172.313,0s163.426,4.869,163.426,4.869s5.223-92.891,0-117.254s-3.752-25.021-28.922-52.4-41.973-28.084-71.76-57.119-79.352-74.3-93.682-95.039-100.049-61.355-114.068-105.555-20.754-104.461-47.9-121.051-32.428,7.918-99.924,23-67.873,15.082-66.365,18.854A55.6,55.6,0,0,1-17923.908-22398.258Z",
    },
    {
      name: "THE MARINA",
      fill: "rgba(223,243,79,0.3)",
      stroke: "#fcb814",
      textX: 500,
      textY: 400,
      d: "M-17394.336-21897.334s31.068.635,67.391,3.822s57.346,4.307,57.346,4.307l2.451-20.1s9.125-104.734-2.451-141.666c-.295-.939-5.441-9.023-5.742-10.154-10.715-40.312,25.574-47.367,29.314-113.432,3.824-67.551-34.412-126.812-57.99-159.951s-13.383-109.607,12.744-148.48s7.846-36.275-6.371-50.98-36.664-53.768-37.645-85.141-25.186-40.006-25.186-40.006-48.643,11.313-66.742,12.443-72.4-11.311-89.367-38.084-29.789-30.92-72.021,19.607-65.988,31.674-109.729,75.414-54.689,112.729-53.936,122.531,25.643,38.461,32.43,58.447,19.605,92.76,29.787,98.416,94.957,72.141,114.564,96.273,68.438,76.246,80.883,84.166,83.258,65.91,86.273,72.549,16.26,41.328,14,103.922S-17394.336-21897.334-17394.336-21897.334Z",
    },
    {
      name: "THE HERITAGE",
      fill: "rgba(9,147,150,0.3)",
      stroke: "#fcb814",
      textX: 930,
      textY: 700,
      d: "M-17262.254-21888.723c28.039,2.326,107.994,12.406,157.7,25.152s238.334,71.373,242.795,73.285s11.471,7.646,11.471,7.646-3.186-17.2-11.471-29.312-28.039-56.273,0-74.338,66.273-41.008,116.617-23.8,61.813,25.49,72.646,8.922,4.463-29.951-45.244-53.529-74.559-89.215-57.99-121.078,9.559-36.324,9.559-36.324-408.48-124.264-416.127-126.176-55.633-1.1-57.518,0,17.721,51.629,3.016,93.107-28.4,46.941-28.4,69.189,14.443,46.871,10.295,98.529S-17262.254-21888.723-17262.254-21888.723Z",
    },
    {
      name: "THE OPERA",
      fill: "rgba(9,150,51,0.3)",
      stroke: "#fcb814",
      textX: 950,
      textY: 400,
      d: "M-17242.842-22251.027c-3.824-.637-21.666-40.785-40.146-73.285s-31.861-44.605-23.578-85.391,43.969-98.777,45.881-98.139,57.988,8.924,86.029,24.217,57.992,36.961,88.58,37.6,155.49-40.783,180.98-42.059,56.713,12.746,129.361,59.9,184.8,108.334,221.766,167.6,12.107,80.293,12.107,80.293-86.668-32.5-120.441-22.939-85.391,66.91-91.764,77.744-417.4-123.627-437.158-125.539S-17239.018-22250.391-17242.842-22251.027Z",
    },
  ];

  return (
    <div className={styles.box}>
      <div className={styles.left}>
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          maxScale={5}
          wheel={{ step: 0.2 }}
          doubleClick={{ disabled: true }}
                 onPanningStop={(ref) => {
            const { positionX, positionY } = ref.state;
            console.log("📍 Vị trí sau khi kéo:", positionX, positionY);
          }}
        >
          <TransformComponent>
            <div className={styles.imageWrapper}>
              <Image src="/HOME_BG.png" alt="Ảnh" className={styles.img} />

              {phasePaths.map(({ name, fill, stroke, d, textX, textY }) => {
                const active = name === currentLayer7;
                return (
                  <svg
                    key={name}
                    className={styles.overlaySvg}
                    xmlns="http://www.w3.org/2000/svg"
                    width="950"
                    height="730"
                    viewBox="0 0 1397.691 930.346"
                  >
                    <path
                      d={d}
                      transform="translate(17928.861 22706.727)"
                      fill={active ? fill : "none"}
                      stroke={active ? stroke : "none"}
                      strokeWidth={5}
                      className={styles.hoverablePath}
                      onClick={() => handleLayer7Change(name)}
                    />
                    {active && (
                      <text
                        x={textX}
                        y={textY}
                        fontSize="36"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{
                          pointerEvents: "none",
                          fill: "white",
                          stroke: "white",
                          strokeWidth: 1,
                        }}
                      >
                        {name}
                      </text>
                    )}
                  </svg>
                );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className={styles.right}>
        <Menu
          project_id={project_id}
          initialLayer7={currentLayer7}
          onLayer7Change={handleLayer7Change}
        />
      </div>
    </div>
  );
}
