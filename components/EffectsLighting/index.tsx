"use client";

import React from "react";
import { Image } from "@mantine/core";
import styles from "./ZoningSystem.module.css";
import Menu from "./Menu/index";

interface ZoningSystemProps {
  project_id: string | null;
}

export default function ZoningSystem({ project_id }: ZoningSystemProps) {
  return (
    <div className={styles.box}>
      <div className={styles.left}>
        <div className={styles.imageWrapper}>
          <Image src="/HOME_BG.png" alt="Ảnh" className={styles.img} />
        </div>
      </div>

      <div className={styles.right}>
        <Menu project_id={project_id} />
      </div>
    </div>
  );
}

