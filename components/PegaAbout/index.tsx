"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Stack,
  Text,
  Loader,
  Center,
  Badge,
} from "@mantine/core";
import styles from "./Interact.module.css";
import { getListProject } from "../../api/apigetlistProjectControl";

interface ProjectType {
  id: string;
  name: string;
  address?: string | null;
  overview_image?: string | null;
  investor?: string | null;
  project_template_id: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
  rank_name?: string | null;
  type?: string | null;
  link?: string;
}

export default function DetailInteractive() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await getListProject({
          token,
          skip: 0,
          limit: 20,
          lang: "vi",
        });

        setProjects(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.introWrapper}></div>

        {/* ===== Danh sách dự án ===== */}
        <div className={styles.cardGrid}>
          {loading ? (
            <Center w="100%" py="xl">
              <Loader />
            </Center>
          ) : (
            projects.map((project) => (
              <a
                key={project.id}
                href="https://sunshinegroup.vn/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Card
                  shadow="sm"
                  radius="md"
                  withBorder
                  padding="0"
                  className={styles.card}
                  style={{ cursor: "pointer" }}
                >
                  {/* ===== Ảnh ===== */}
                  <Image
                    src={project.overview_image ?? "/image/default-project.jpg"}
                    height={180}
                    alt={project.name}
                    fallbackSrc="/image/default-project.jpg"
                    style={{
                      borderTopLeftRadius: "var(--mantine-radius-md)",
                      borderTopRightRadius: "var(--mantine-radius-md)",
                    }}
                  />

                  {/* ===== Nội dung ===== */}
                  <Stack gap={6} p="md" style={{ flexGrow: 1 }}>
                    <Text fw={600} size="md" lineClamp={1}>
                      Tên dự án: {project.name}
                    </Text>

                    <Text size="sm">
                      <Text span c="dimmed">
                        Loại dự án: {project.type ?? "Thông tin chưa có"}
                      </Text>
                    </Text>

                    <Text size="sm">
                      <Text span c="dimmed">
                        Địa chỉ: {project.address ?? "Địa chỉ chưa có"}
                      </Text>
                    </Text>

                    <Text size="sm">
                      <Text span c="dimmed">
                        Nhà đầu tư: {project.investor ?? "Thông tin chưa có"}
                      </Text>
                    </Text>

                    {project.rank_name && (
                      <Badge mt={4} size="sm" variant="light" color="blue">
                        Hạng: {project.rank_name}
                      </Badge>
                    )}
                  </Stack>
                </Card>
              </a>
            ))
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className={styles.footerwrapper}>
          <Text
            className={styles.footersubtex}
            fw={600}
            size="lg"
            ta="center"
            mb="sm"
            c="#053c74"
          >
            Giới thiệu mô hình dự án
          </Text>

          <p className={styles.footerline}>
            Mô hình quy hoạch các dự án của Sunshine Group tại khu đô thị
            Ciputra (Nam Thăng Long, Hà Nội) là kết quả của sự hợp tác chiến
            lược và tin cậy giữa Sunshine Group và Công ty TNHH Mô hình Việt –
            đơn vị tiên phong trong lĩnh vực thiết kế và thi công mô hình
            kiến trúc cao cấp tại Việt Nam. Mỗi mô hình được nghiên cứu và
            triển khai với yêu cầu khắt khe về độ chính xác, tỷ lệ chuẩn xác,
            tính thẩm mỹ tinh tế và khả năng mô phỏng sát thực không gian đô
            thị hiện tại và tương lai. Không dừng lại ở giá trị trưng bày, mô
            hình còn được tích hợp hệ thống điều khiển ánh sáng thông minh
            thông qua nền tảng website, cho phép người dùng chủ động theo dõi,
            vận hành và cập nhật từng hạng mục một cách trực quan, sinh động,
            mọi lúc mọi nơi. Đây không chỉ là công cụ minh họa dự án, mà còn
            là giải pháp trình diễn hiện đại, góp phần nâng tầm trải nghiệm và
            thể hiện tầm nhìn phát triển bền vững, công nghệ hóa của Sunshine
            Group.
          </p>
        </div>
      </div>
    </div>
  );
}
