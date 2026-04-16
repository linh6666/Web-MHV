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
  src="https://drive.google.com/file/d/14SWx-24SM1xbbbGYVP8SD1jnA_AvLnx6/preview"
  width="100%"
  className={styles.pdfFrame}
  style={{ border: "none", height: "100vh" }}
/>
      <Group justify="flex-end">
        <Button
          className={styles.backButton}
          onClick={handleBack}
          variant="filled"
        >
          <IconArrowLeft size={18} color="#294b61" />
        </Button>
      </Group>
    </div>
    
  );
}