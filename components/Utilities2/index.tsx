"use client";

import { Image } from "@mantine/core";
import React, {useMemo,useState} from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index"; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { pathsData,SvgItem } from "./Data";


interface ZoningSystemProps {
  project_id: string | null;
  initialBuildingType?: string | null;
}

export default function ZoningSystem({ project_id, initialBuildingType }: ZoningSystemProps) {
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [highlightedCodes, setHighlightedCodes] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const filteredPaths = useMemo(() => {
    if (!activeModels || activeModels.length === 0) {
      return [];
    }

    return pathsData.map((item: SvgItem) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(item.svg, "image/svg+xml");

      Array.from(svgDoc.querySelectorAll("rect, path, circle")).forEach((el) => {
        const elId = el.id || "";
        const cleanElId = elId.replace(/\s+/g, "_").toUpperCase();

        // Kiểm tra xem ID có thuộc danh sách hiển thị chung không
        const isMatch = activeModels.some((model) => {
          const cleanModel = (model || "").trim().replace(/\s+/g, "_").toUpperCase();
          return cleanElId.includes(cleanModel) || cleanModel.includes(cleanElId);
        });

        // Kiểm tra xem ID có thuộc danh sách được chọn để highlight không
        const isHighlighted = highlightedCodes.some((code) => {
          const cleanCode = (code || "").trim().replace(/\s+/g, "_").toUpperCase();
          return cleanElId.includes(cleanCode) || cleanCode.includes(cleanElId);
        });

        if (isMatch) {
          el.removeAttribute("style"); // Luôn hiển thị nếu thuộc activeModels
          
          if (isHighlighted) {
            // Tô màu vàng nhạt cho phần được chọn
            el.setAttribute("fill", "#c2923f");
            el.setAttribute("stroke", "#C2923F");
            el.setAttribute("stroke-width", "2");
          } else {
            // Trả về màu gốc nếu không được chọn
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
      
      // ✅ Ép SVG co giãn tuyệt đối theo wrapper (giống hệt ảnh)
      const svgRoot = svgDoc.documentElement;
      svgRoot.setAttribute("preserveAspectRatio", "none");
      svgRoot.setAttribute("width", "100%");
      svgRoot.setAttribute("height", "100%");

      return {
        ...item,
        svg: svgRoot.outerHTML,
      };
    });
  }, [activeModels, highlightedCodes]);

  const handleModelSelect = (modelName: string) => {
    setSelectedModel((prev) => (prev === modelName ? null : modelName));
  };

  return (
    <div className={styles.box}>
      <div className={styles.left}>
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={5}
          wheel={{ step: 0.2 }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent>
            <div className={styles.imageWrapper}>
              <img src="/HOME_BG.png" alt="Ảnh" className={styles.img} />
              {filteredPaths.length > 0 ? (
                filteredPaths.map((item) => (
                  <div
                    key={item.id}
                    className={styles.overlaySvg}
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                ))
              ) : (
                <p>Không có SVG nào để hiển thị.</p>
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className={styles.right}>
        <Menu
          project_id={project_id}
          initialBuildingType={initialBuildingType}
          selectedModel={selectedModel} // Truyền state xuống đây
          onModelsLoaded={setActiveModels}
          onHighlightCodes={setHighlightedCodes}
          onSelectModel={handleModelSelect}
        />
      </div>
    </div>
  );
}
