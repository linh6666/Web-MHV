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
      <iframe
        src="/huong-dan/hdsd_ciputra_nen.pdf"
        width="100%"
        className={styles.pdfFrame}
        style={{ border: "none" }}
      ></iframe>
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