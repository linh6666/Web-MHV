"use client";

import { Image } from "@mantine/core";
import React, {useMemo,useState} from "react";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index"; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { pathsData,SvgItem } from "./Data";


interface ZoningSystemProps {
  project_id: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  const [activeModels, setActiveModels] = useState<string[]>([]);
        const filteredPaths = useMemo(() => {
           if (!activeModels || activeModels.length === 0) return [];
    
     const result = pathsData.map((item: SvgItem) => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(item.svg, "image/svg+xml");
    
          Array.from(svgDoc.querySelectorAll("rect, path")).forEach((el) => {
            const elPrefix = el.id?.split(".").slice(0, 2).join(".");
            if (!elPrefix || !activeModels.includes(elPrefix)) {
              el.setAttribute("style", "display:none");
            } else {
              el.removeAttribute("style");
            }
          });
    
          return {
            ...item,
            svg: svgDoc.documentElement.outerHTML,
          };
        });
    
        return result;
      }, [activeModels]);
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
          <Image src="/HOME_BG.png" alt="Ảnh" className={styles.img} />

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
        {/* 👇 Truyền project_id sang Menu */}
        <Menu project_id={project_id} 
           onModelsLoaded={setActiveModels}
        />
      </div>
    </div>
  );
}
