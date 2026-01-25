"use client";

import { Image } from "@mantine/core";
import React, { useMemo, useState,useRef, useEffect, useCallback } from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { pathsData,SvgItem } from "./Data";
import { useSearchParams } from "next/navigation";

import InfoModal from "./Infomodal/index";
interface ZoningSystemProps {
  project_id: string | null;
  layer7?: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  const [currentLayer7, setCurrentLayer7] = useState<string>("");
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

// cái này cop

  const searchParams = useSearchParams();
  const urlPhase = searchParams.get("layer3");
  const urlLayer2 = searchParams.get("layer2");

  const [currentLayer2, setCurrentLayer2] = useState(urlLayer2 || "");
  const [currentPhase, setCurrentPhase] = useState(urlPhase || "");

  const [activeMode, setActiveMode] = useState<"single" | "multi" | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const [opened, setOpened] = useState(false);
  const [clickedModel, setClickedModel] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState(project_id);
//
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
  /* ===========================
     ZOOM FUNCTION
  ============================ */
  const zoomToModel = (modelId: string) => {
    // ✅ ép kiểu về HTMLElement để giữ zoom tự động
    const el = document.querySelector(
      `[data-model="${modelId}"]`
    ) as HTMLElement | null;

    if (el && transformRef.current) {
      transformRef.current.zoomToElement(el, 1.5, 300);
    }
  };


  useEffect(() => {
    if (!transformRef.current) return;

    if (selectedModel) {
      requestAnimationFrame(() => {
        zoomToModel(selectedModel);
      });
      return;
    }

    if (!selectedModel && activeModels.length > 0) {
      requestAnimationFrame(() => {
        zoomToModel(activeModels[0]);
      });
    }
  }, [filteredPaths, selectedModel, activeModels]);

  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const model = (e.target as SVGElement).getAttribute("data-model");
    if (!model) return;

    setOpened(false);

    requestAnimationFrame(() => {
      setClickedModel(model);
      setSelectedProjectId(project_id);
      setOpened(true);
      zoomToModel(model);
    });
  };

  const handleModelSelect = (modelName: string | null) => {
    setHasUserInteracted(true);
    setActiveMode("single");

    if (!modelName) {
      setSelectedModel(null);
      setActiveModels([]);
      return;
    }

    setSelectedModel((prev) => (prev === modelName ? null : modelName));
  };



    // Zoom vào vùng SVG tương ứng (giả sử có id là modelName)
 
  return (
    <>
      <InfoModal
        opened={opened}
        onClose={() => setOpened(false)}
        clickedModel={clickedModel}
        projectId={selectedProjectId}
        initialPhase={currentPhase}
        initialLayer2={currentLayer2}
      />

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
          // onPhaseChange={handlePhaseChange}
        />
      </div>
    </div>
        </>
  );
}

