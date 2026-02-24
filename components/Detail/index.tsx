"use client";

import { Image } from "@mantine/core";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { pathsData, SvgItem } from "./Data";
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

  // ===== URL PARAMS =====
  const searchParams = useSearchParams();
  const urlPhase = searchParams.get("layer3");
  const urlLayer2 = searchParams.get("layer2");

  const [currentLayer2] = useState(urlLayer2 || "");
  const [currentPhase] = useState(urlPhase || "");

  const [activeMode, setActiveMode] =
    useState<"single" | "multi" | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const [opened, setOpened] = useState(false);
  const [clickedModel, setClickedModel] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] =
    useState(project_id);

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  // =============================
  // LAYER 7 CHANGE
  // =============================
  const handleLayer7Change = (newLayer7: string) => {
    setCurrentLayer7(newLayer7);
  };

  // =============================
  // FILTER SVG PATHS
  // =============================
  const filteredPaths = useMemo(() => {
    if (!activeModels || activeModels.length === 0) {
      console.log("❌ Không có activeModels → Không hiển thị SVG");
      return [];
    }

    const result = pathsData.map((item: SvgItem) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(
        item.svg,
        "image/svg+xml"
      );

      Array.from(
        svgDoc.querySelectorAll("rect, path, circle")
      ).forEach((el) => {
        const elId = el.id || "";
        const cleanElId = elId
          .replace(/\s+/g, "_")
          .toUpperCase();

        const isMatch = activeModels.some((model) => {
          const cleanModel = (model || "")
            .replace(/\s+/g, "_")
            .toUpperCase();
          return (
            cleanElId.includes(cleanModel) ||
            cleanModel.includes(cleanElId)
          );
        });

        if (isMatch) {
          el.removeAttribute("style");

          // ✅ ADD — BẮT BUỘC để zoom & click
          el.setAttribute("data-model", elId);
          el.setAttribute("cursor", "pointer");

          if (
            selectedModel &&
            cleanElId.includes(
              selectedModel
                .replace(/\s+/g, "_")
                .toUpperCase()
            )
          ) {
            el.setAttribute("fill", "#bb8d38");
            el.setAttribute("stroke", "white");
          } else {
            const originalFill =
              el.getAttribute("data-original-fill") ||
              el.getAttribute("fill") ||
              "#fff";

            if (!el.hasAttribute("data-original-fill")) {
              el.setAttribute(
                "data-original-fill",
                originalFill
              );
            }

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

  // =============================
  // ZOOM FUNCTION (GIỮ NGUYÊN)
  // =============================
  const zoomToModel = (modelId: string) => {
    const el = document.querySelector(
      `[data-model="${modelId}"]`
    ) as HTMLElement | null;

    if (el && transformRef.current) {
      transformRef.current.zoomToElement(el, 1.5, 300);
    }
  };

  // =============================
  // ZOOM KHI SELECT MODEL (GIỮ NGUYÊN)
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
  // ✅ ADD: AUTO ZOOM VÀO RECT / PATH / CIRCLE ĐANG HIỂN THỊ
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

  // =============================
  // SVG CLICK
  // =============================
  const handleSvgClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const model = (e.target as SVGElement).getAttribute(
      "data-model"
    );
    if (!model) return;

    setOpened(false);

    requestAnimationFrame(() => {
      setClickedModel(model);
      setSelectedProjectId(project_id);
      setOpened(true);
      zoomToModel(model);
    });
  };

  // =============================
  // MENU SELECT MODEL
  // =============================
  const handleModelSelect = (modelName: string | null) => {
    setHasUserInteracted(true);
    setActiveMode("single");

    if (!modelName) {
      setSelectedModel(null);
      setActiveModels([]);
      return;
    }

    setSelectedModel((prev) =>
      prev === modelName ? null : modelName
    );
  };

  // =============================
  // RENDER
  // =============================
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
          >
            <TransformComponent>
              <div
                className={styles.imageWrapper}
                onClick={handleSvgClick}
              >
                <Image
                  src="/HOME_BG.png"
                  alt="Ảnh"
                  className={styles.img}
                />

                {filteredPaths.map((item) => (
                  <div
                    key={item.id}
                    className={styles.overlaySvg}
                    dangerouslySetInnerHTML={{
                      __html: item.svg,
                    }}
                  />
                ))}
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
    </>
  );
}

