"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Container } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import styles from "./VideoPage.module.css";
import { useEffect } from "react";
import { createNodeAttribute } from "../../api/apiLighting";

export default function VideoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("id");

  const handleBack = () => {
    if (!project_id) return;
    router.push(`/Tuong-tac/Millennia-City?id=${project_id}`);
  };

  // 🟢 Khi trang vừa load, tự động gọi API
  useEffect(() => {
    const callApiOnLoad = async () => {
      if (!project_id) {
        console.warn("⚠️ Không có project_id để gọi API.");
        return;
      }

      try {
        const body = { project_id };
        const response = await createNodeAttribute(body, {
          type_control: "eff",
          value: 1,
          rs: 0,
          id: 7,
        });

        console.log("✅ Đã tự động gửi hiệu ứng Chiều (ID: 7)", response);
      } catch (error) {
        console.error("❌ Lỗi khi tự động gọi hiệu ứng Chiều:", error);
      }
    };

    callApiOnLoad();
  }, [project_id]); // Chạy lại nếu project_id thay đổi

  return (
    <Container className={styles.videoContainer}>
      <iframe
        className={styles.videoIframe}
        src="https://www.youtube.com/embed/KwxqLtMP4jk?autoplay=1&mute=1"
        title="Video giới thiệu"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <Button
        className={styles.backButton}
        onClick={handleBack}
        variant="filled"
      >
        <IconArrowLeft size={18} color="#752E0B" />
      </Button>
    </Container>
  );
}
