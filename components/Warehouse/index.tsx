"use client";

import React, { useState } from "react";
import styles from "./App.module.css";
import TotalWarehouse from "./TotalWarehouse";

interface AppProps {
  projectId: string;
  projectName?: string;
  target?: string;
}

export default function Managent({ projectId, target, projectName }: AppProps) {
  const [activeView, setActiveView] = useState<string>("warehouse");

  return (
    <div className={styles.containerr}>
      <h2 className={styles.mainTitle}>
        Dự án {projectName}
      </h2>

      <div className={styles.headerList}>
        <div
          className={`${styles.titleTab} ${activeView === "warehouse" ? styles.titleTabActive : ""}`}
          onClick={() => setActiveView("warehouse")}
        >
          Kho hàng
        </div>

      </div>

      <div className={styles.contentViewWrapper}>
        {/* Nội dung view */}
        {activeView === "warehouse" && <TotalWarehouse projectId={projectId} target={target} />}
        
        {/* Các view khác nếu cần thêm nội dung */}
        
      
      </div>
    </div>
  );
}
