"use client";

import { Image } from "@mantine/core";
import React, {useMemo,useState} from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index"; 
import { pathsData,SvgItem } from "./Data";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


interface ZoningSystemProps {
  project_id: string | null;
  initialBuildingType?: string | null; // thêm prop mới
}

export default function ZoningSystem({ project_id, initialBuildingType }: ZoningSystemProps) {
    const [activeModels, setActiveModels] = useState<string[]>([]);
      const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const filteredPaths = useMemo(() => {
             if (!activeModels || activeModels.length === 0) return [];
      
       const result = pathsData.map((item: SvgItem) => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(item.svg, "image/svg+xml");
      
            Array.from(svgDoc.querySelectorAll("rect, path")).forEach((el) => {
              
              const elPrefix = el.id?.split(".").slice(0, 2).join(".");
    const originalFill = el.getAttribute("data-original-fill") || el.getAttribute("fill") || "#fff";
   if (!el.hasAttribute("data-original-fill")) el.setAttribute("data-original-fill", originalFill);
              if (!elPrefix || !activeModels.includes(elPrefix)) {
                el.setAttribute("style", "display:none");
              } else {
                el.removeAttribute("style");
                if (selectedModel && elPrefix === selectedModel) {
        el.setAttribute("fill", "#bb8d38");
        el.setAttribute("stroke", "white");
      } else {
        el.setAttribute("fill", originalFill);
        el.removeAttribute("stroke");
      }
              }
            });
      
            return {
              ...item,
              svg: svgDoc.documentElement.outerHTML,
            };
          });
      
          return result;
        }, [activeModels,selectedModel]);
        const handleModelSelect = (modelName: string) => {
    // Nhấp lần 2 vào model đã chọn → bỏ highlight
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
          <Image src="/image/home_bg.png" alt="Ảnh" className={styles.img} />

         {filteredPaths.length > 0 ? (
                filteredPaths.map((item) => (
                  <div
                    key={item.id}
                    className={styles.overlaySvg}
                    style={{
                      top: `${item.topPercent}%`,
                      left: `${item.leftPercent}%`,
                    }}
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
        {/* 👇 Truyền project_id và initialBuildingType sang Menu */}
        <Menu project_id={project_id} initialBuildingType={initialBuildingType} 
         onModelsLoaded={setActiveModels}
         onSelectModel={handleModelSelect}
        />
      </div>
    </div>
  );
}
