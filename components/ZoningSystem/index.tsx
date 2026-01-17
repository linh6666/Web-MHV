"use client";

import React from "react";
import { Image } from "@mantine/core";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


interface ZoningSystemProps {
  project_id: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
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

          {/* SVG 1 */}
    
        </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className={styles.right}>
        <Menu project_id={project_id} />
      </div>
    </div>
  );
}
