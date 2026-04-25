"use client";

import React, { useMemo, useState } from "react";

import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import { pathsData,SvgItem } from "./Data";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


interface ZoningSystemProps {
  project_id: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [selectedModel] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ name: string; x: number; y: number } | null>(null);

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
        const elIdentifier = el.getAttribute("data-name") || "";
        // Chuẩn hóa: chỉ trim và viết hoa, giữ nguyên dấu chấm để phân biệt 2.12 và 21.2
        const cleanElId = elIdentifier.trim().toUpperCase();
  
        // So sánh tuyệt đối với activeModels
        const isMatch = activeModels.some((model) => {
          const cleanModel = (model || "").trim().toUpperCase();
          return cleanElId === cleanModel;
        });
  
        if (elIdentifier) {
          console.log(
            isMatch ? "✅ MATCH → SVG hiển thị:" : "⛔ HIDE →",
            elIdentifier
          );
        }
  
        if (isMatch) {
          el.removeAttribute("style");
          const cleanSelected = selectedModel ? selectedModel.trim().toUpperCase() : null;
          if (cleanSelected && cleanElId === cleanSelected) {
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
  
    return result;
  }, [activeModels, selectedModel]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("[data-name]");
    const dataName = target?.getAttribute("data-name");

    if (dataName) {
      setHoverInfo({
        name: dataName,
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      setHoverInfo(null);
    }
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
          onPanningStop={(ref) => {
            const { positionX, positionY } = ref.state;
            console.log("📍 Vị trí sau khi kéo:", positionX, positionY);
          }}
        >
          <TransformComponent>
        <div
          className={styles.imageWrapper}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverInfo(null)}
        >
          <img src="/HOME_BG.jpg" alt="Ảnh" className={styles.img} />
            {filteredPaths.map((item) => {
              console.log("🟩 SVG được render lên UI:", item.id);

              return (
                <div
                  key={item.id}
                  className={styles.overlaySvg}
                  style={{ 
                    cursor: "pointer", 
                    pointerEvents: "all",
                    zIndex: 10
                  }}
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                />
              );
            })}

        </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {hoverInfo && (
        <div
          style={{
            position: "fixed",
            top: hoverInfo.y + 15,
            left: hoverInfo.x + 15,
            backgroundColor: "#294b61",
            color: "#bb8d38",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 600,
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            whiteSpace: "nowrap",
          }}
        >
          {hoverInfo.name}
        </div>
      )}

      <div className={styles.right}>
        <Menu project_id={project_id}
            onModelsLoaded={setActiveModels}
        
        />
      </div>
    </div>
  );
}
