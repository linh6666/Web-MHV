"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import styles from "./PdfViewer.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button, Group } from "@mantine/core";

export default function PdfViewer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("id");

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/tuong-tac/Ciputra?id=${project_id}`);
  };

  return (
    <div className={styles.pdfContainer}>
      <object
        data="/huong-dan/hdsd_ciputra_nen.pdf"
        type="application/pdf"
        className={styles.pdfFrame}
      >
        {/* fallback nếu không load được */}
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Trình duyệt không hỗ trợ hiển thị PDF.</p>
          <a
            href="/huong-dan/hdsd_ciputra_nen.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mở file PDF
          </a>
        </div>
      </object>

      <Group justify="flex-end">
        <Button
          className={styles.backButton}
          onClick={handleBack}
          variant="filled"
        >
          <IconArrowLeft size={18} color="#EEEEEE" />
        </Button>
      </Group>
    </div>
  );
}