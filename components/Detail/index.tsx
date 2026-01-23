"use client";

import { Image } from "@mantine/core";
import React, { useMemo, useState,useRef } from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { pathsData,SvgItem } from "./Data";

interface ZoningSystemProps {
  project_id: string | null;
  layer7?: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  const [currentLayer7, setCurrentLayer7] = useState<string>("");
   const [activeModels, setActiveModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);


  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  // ✅ Chỉ update state, KHÔNG pan
  const handleLayer7Change = (newLayer7: string) => {
    setCurrentLayer7(newLayer7);
  };
   const filteredPaths = useMemo(() => {
    if (!activeModels || activeModels.length === 0) {
      console.log("❌ Không có activeModels → Không hiển thị SVG");
      return [];
    }
  
    console.log("👉 activeModels từ API:", activeModels);
  
    const result = pathsData.map((item: SvgItem) => {
      console.log("🟦 SVG đang xử lý:", item.id);
  
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(item.svg, "image/svg+xml");
  
      Array.from(svgDoc.querySelectorAll("rect, path,circle")).forEach((el) => {
        const elId = el.id || "";
        const cleanElId = elId.replace(/\s+/g, "_").toUpperCase();
  
        // So sánh với activeModels → chuẩn hóa tên
        const isMatch = activeModels.some((model) => {
          const cleanModel = (model || "").replace(/\s+/g, "_").toUpperCase();
          return cleanElId.includes(cleanModel) || cleanModel.includes(cleanElId);
        });
  
        if (elId) {
          console.log(
            isMatch ? "✅ MATCH → SVG hiển thị:" : "⛔ HIDE →",
            elId
          );
        }
  
        if (isMatch) {
          el.removeAttribute("style");
          if (selectedModel && cleanElId.includes(selectedModel.replace(/\s+/g, "_").toUpperCase())) {
            el.setAttribute("fill", "#bb8d38");
            el.setAttribute("stroke", "white");
          } else {
            const originalFill =
              el.getAttribute("data-original-fill") || el.getAttribute("fill") || "#fff";
            if (!el.hasAttribute("data-original-fill")) el.setAttribute("data-original-fill", originalFill);
            el.setAttribute("fill", originalFill);
            el.removeAttribute("stroke");
          }
        } else {
          el.setAttribute("style", "display:none");
        }
      });
  
      return {
        ...item,
        svg: svgDoc.documentElement.outerHTML,
      };
    });
  
    return result;
  }, [activeModels, selectedModel]);
    const handleModelSelect = (modelName: string) => {
    setSelectedModel((prev) => (prev === modelName ? null : modelName));

    // Zoom vào vùng SVG tương ứng (giả sử có id là modelName)
 
  };

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
              <Image
                src="/HOME_BG.png"
                alt="Ảnh"
                className={styles.img}
              />
              {filteredPaths.map((item) => {
  console.log("🟩 SVG được render lên UI:", item.id);

  return (
    <div
      key={item.id}
      className={styles.overlaySvg}
      style={{
        top: `${item.topPercent}%`,
        left: `${item.leftPercent}%`,
      }}
      dangerouslySetInnerHTML={{ __html: item.svg }}
    />
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
           onModelsLoaded={setActiveModels}
             onSelectModel={handleModelSelect} 

        />
      </div>
    </div>
  );
}

