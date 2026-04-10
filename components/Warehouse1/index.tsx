"use client";

import React from "react";
import styles from "./App.module.css";
import TotalWarehouse from "./TotalWarehouse";
import MyOder from "./MyOder";
import { useRouter, useSearchParams } from "next/navigation";
// import { Group } from "@mantine/core";

interface AppProps {
  projectId: string;
  projectName?: string;
  target?: string;
}

export default function Managent({ projectId, target, projectName }: AppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy view hiện tại từ URL, mặc định là 'warehouse'
  const activeView = searchParams.get("view") || "warehouse";

  const handleTabClick = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.containerr}>
      <h2 style={{ fontWeight: "800", color: "#762f0b", fontSize: "28px", marginBottom: "10px" }}>
        Dự án {projectName}
      </h2>

      <div className={styles.headerList}>
        <div
          className={`${styles.titleTab} ${activeView === "warehouse" ? styles.titleTabActive : ""}`}
          onClick={() => handleTabClick("warehouse")}
        >
          Kho hàng
        </div>
        <div
          className={`${styles.titleTab} ${activeView === "amenities" ? styles.titleTabActive : ""}`}
          onClick={() => handleTabClick("amenities")}
        >
          Tài liệu
        </div>
        <div
          className={`${styles.titleTab} ${activeView === "houseType" ? styles.titleTabActive : ""}`}
          onClick={() => handleTabClick("houseType")}
        >
          Ghi chú
        </div>
        <div
          className={`${styles.titleTab} ${activeView === "note" ? styles.titleTabActive : ""}`}
          onClick={() => handleTabClick("note")}
        >
          Đơn hàng
        </div>
      </div>

      <div className={styles.contentViewWrapper}>
        {/* Nội dung view */}
        {activeView === "warehouse" && <TotalWarehouse projectId={projectId} target={target} />}
        {activeView === "note" && <MyOder projectId={projectId} />}
        
        {/* Các view khác nếu cần thêm nội dung */}
        {activeView === "amenities" && (
          <div style={{ padding: "40px", textAlign: "center", color: "#762f0b" }}>
            <h3>Nội dung Tài liệu đang được cập nhật...</h3>
          </div>
        )}
        {activeView === "houseType" && (
          <div style={{ padding: "40px", textAlign: "center", color: "#762f0b" }}>
            <h3>Nội dung Ghi chú đang được cập nhật...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
