"use client";

import { Image } from "@mantine/core";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import styles from "../Detail/ZoningSystem.module.css"; // Dùng chung style với Detail
import MenuBuilding from "./Menu/index";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { pathsData, SvgItem } from "../Detail/Data";
import { useSearchParams } from "next/navigation";

interface DetailBuildingProps {
  project_id: string | null;
  layer2?: string | null;
  layer3?: string | null;
}

export default function DetailBuilding({
  project_id,
  layer2,
  layer3,
}: DetailBuildingProps) {
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [highlightedCodes, setHighlightedCodes] = useState<string[]>([]);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const searchParams = useSearchParams();
  const urlLayer3 = searchParams.get("layer3");
  const urlLayer2 = searchParams.get("layer2");

  const currentLayer2 = layer2 || urlLayer2 || "";
  const currentLayer3 = layer3 || urlLayer3 || "";

  // =============================
  // FILTER SVG PATHS
  // =============================
  const filteredPaths = useMemo(() => {
    if (!activeModels || activeModels.length === 0) return [];

    return pathsData.map((item: SvgItem) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(item.svg, "image/svg+xml");

      Array.from(svgDoc.querySelectorAll("rect, path, circle")).forEach((el) => {
        const elIdentifier = el.getAttribute("data-name") || "";
        const cleanElId = elIdentifier.trim().toUpperCase();

        const isMatch = activeModels.some((model) => {
          const cleanModel = (model || "").trim().toUpperCase();
          return cleanElId === cleanModel;
        });

        if (isMatch) {
          el.removeAttribute("style");
          el.setAttribute("data-model", elIdentifier);
          el.setAttribute("cursor", "pointer");

          // Kiểm tra xem ID có thuộc danh sách được chọn để highlight không
          const isHighlighted = highlightedCodes.some((code) => {
            const cleanCode = (code || "").trim().toUpperCase();
            return cleanElId === cleanCode;
          });

          const cleanSelected = selectedModel 
            ? selectedModel.trim().toUpperCase() 
            : null;

          if (isHighlighted || (cleanSelected && cleanElId === cleanSelected)) {
            el.setAttribute("fill", "red");
            el.setAttribute("stroke", "red");
            el.setAttribute("stroke-width", "2");
          } else {
            const originalFill = el.getAttribute("data-original-fill") || el.getAttribute("fill") || "#fff";
            if (!el.hasAttribute("data-original-fill")) {
              el.setAttribute("data-original-fill", originalFill);
            }
            el.setAttribute("fill", originalFill);
            el.removeAttribute("stroke");
          }
        } else {
          el.setAttribute("style", "display:none");
        }
      });

      const svgRoot = svgDoc.documentElement;
      svgRoot.setAttribute("preserveAspectRatio", "none");
      svgRoot.setAttribute("width", "100%");
      svgRoot.setAttribute("height", "100%");

      return { ...item, svg: svgRoot.outerHTML };
    });
  }, [activeModels, selectedModel, highlightedCodes]);

  const zoomToModel = (modelId: string) => {
    const el = document.querySelector(`[data-model="${modelId}"]`) as HTMLElement | null;
    if (el && transformRef.current) {
      transformRef.current.zoomToElement(el, 1.5, 300);
    }
  };

  // =============================
  // ZOOM KHI SELECT MODEL
  // =============================
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

  // =============================
  // AUTO ZOOM FIRST ELEMENT
  // =============================
  useEffect(() => {
    if (!transformRef.current) return;
    if (hasUserInteracted) return;

    requestAnimationFrame(() => {
      const firstVisibleEl = document.querySelector(
        "[data-model]"
      ) as HTMLElement | null;

      if (firstVisibleEl) {
        transformRef.current!.zoomToElement(
          firstVisibleEl,
          1.5,
          300
        );
      }
    });
  }, [filteredPaths, hasUserInteracted]);

  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const model = (e.target as SVGElement).getAttribute("data-model");
    if (!model) return;
    setHasUserInteracted(true);
    setSelectedModel(model);
    zoomToModel(model);
  };

  const handleModelSelect = (modelName: string | null) => {
    setHasUserInteracted(true);
    setSelectedModel((prev) => (prev === modelName ? null : modelName));
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
          onPanningStart={() => setHasUserInteracted(true)}
          onZoomStart={() => setHasUserInteracted(true)}
        >
          <TransformComponent>
            <div className={styles.imageWrapper} onClick={handleSvgClick}>
              <Image src="/HOME_BG.jpg" alt="Ảnh" fit="contain" className={styles.img} />
              {filteredPaths.map((item) => (
                <div
                  key={item.id}
                  className={styles.overlaySvg}
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className={styles.right}>
        <MenuBuilding
          project_id={project_id}
          initialLayer2={currentLayer2}
          initialLayer3={currentLayer3}
          onModelsLoaded={setActiveModels}
          onHighlightCodes={setHighlightedCodes}
          onSelectModel={handleModelSelect}
        />
      </div>
    </div>
  );
}
