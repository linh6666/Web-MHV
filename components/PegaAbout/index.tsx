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
import { NotificationExtension } from "../../extension/NotificationExtension";

// ===========================
// ✅ TYPE
// ===========================

interface OverviewImage {
  url: string;
  thumbnail_url: string;
}

interface ProjectType {
  id: string;
  name: string;
  address?: string | null;
  overview_image?: OverviewImage | null; // ✅ FIX
  investor?: string | null;
  project_template_id: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
  rank_name?: string | null;
  type?: string | null;
  link?: string;
}

// ===========================
// 🔥 HELPER
// ===========================

const getImageUrl = (img?: OverviewImage | null) => {
  if (!img?.thumbnail_url) return "/image/default-project.jpg";
  return img.thumbnail_url.replace("http://", "https://");
};

// ===========================
// COMPONENT
// ===========================

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
        NotificationExtension.Success("Tải dữ liệu dự án thành công");
      } catch (error) {
        const axiosError = error as {
          response?: { data?: { detail?: string } };
        };

        const errorMessage =
          axiosError?.response?.data?.detail ||
          "Lỗi khi tải dữ liệu dự án";

        NotificationExtension.Fails(errorMessage);
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
                href="https://www.mohinhviet.com/"
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
  src={
    project.overview_image?.url
      ? project.overview_image.url.replace("http://", "https://")
      : "/image/default-project.jpg"
  }
  height={180}
  alt={project.name}
  fallbackSrc="/image/default-project.jpg"
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
            className={styles.footersubtext}
            fw={600}
            size="md"
            ta="center"
            mb="xl"
            c="#294B61"
          >
            Giới thiệu
          </Text>

           <div className={styles.footerline} style={{ display: "block", textAlign: "justify" }}>
            <Text size="sm" mb="sm">
              Được khởi đầu từ năm 2001, Công ty TNHH Mô hình Việt tự hào là một
              trong những công ty sản xuất mô hình chuyên nghiệp, uy tín nhất
              tại Việt Nam, và là đơn vị tiên phong mang mô hình kiến trúc Việt
              Nam ra thị trường thế giới.
            </Text>
            <Text size="sm" mb="sm">
              Mô hình dự án Khu đô thị mới Nam Thăng Long (Ciputra Hanoi
              International City) là một trong những dự án tiêu biểu của Mô hình
              Việt, nổi bật với quy mô ấn tượng và được ứng dụng nhiều giải pháp
              công nghệ hiện đại, tiên tiến.
            </Text>
            <Text size="sm" mb="sm">
              Ở tỷ lệ 1:1000, mô hình tái hiện tổng thể không gian đô thị với bố
              cục quy hoạch rõ ràng và trực quan. Các khu chức năng, hệ thống
              cây xanh được Mô hình Việt thể hiện một cách tinh xảo, từ màu sắc
              đến từng chi tiết mô hình được xử lý tỉ mỉ, làm nổi bật lên cấu
              trúc cảnh quan và định hướng quy hoạch của toàn khu đô thị.
            </Text>
            <Text size="sm" mb="sm">
              Không chỉ được thực hiện với độ chính xác cao, mô hình Ciputra
              Hanoi mà còn được ứng dụng nhiều giải pháp công nghệ sáng tạo do
              Mô hình Việt nghiên cứu & phát triển, bao gồm:
            </Text>

            <Text size="sm" mb="xs" fw={700}>
              (1) Công nghệ Điều khiển Ánh sáng bằng website
            </Text>
            <Text size="sm" mb="sm" ml="md">
              Không chỉ đơn thuần thắp sáng mô hình, chúng tôi mang đến giải
              pháp điều khiển ánh sáng thông minh qua website, với kịch bản được
              thiết kế riêng cho Ciputra Hanoi. Để tối ưu sự linh hoạt và thuận
              tiện khi vận hành, hệ thống cũng cho phép người dùng dễ dàng điều
              khiển từ xa trên nhiều thiết bị.
            </Text>

            <Text size="sm" mb="xs" fw={700}>
              (2) Công nghệ trình chiếu trên mô hình Projection Mapping
            </Text>
            <Text size="sm" mb="sm" ml="md">
              Công nghệ Projection Mapping tạo nên những hiệu ứng ánh sáng sống
              động cùng khả năng tương tác đa chiều, mang đến trải nghiệm trực
              quan, độc đáo và ấn tượng trong thời gian thực cho người xem.
            </Text>

            <Text size="sm" mb="xs" fw={700}>
              (3) Hệ thống Quản lý Bán hàng (Sales Management System)
            </Text>
            <Text size="sm" mb="sm" ml="md">
              Hệ thống cung cấp các tính năng Quản lý Dự án & Quản lý Khách
              hàng, tất cả được tích hợp trên một nền tảng duy nhất, giúp việc
              theo dõi và vận hành của Chủ đầu tư trở nên thuận tiện và hiệu quả
              hơn.
            </Text>

            <Text size="sm" mt="lg" ta="left">
              Khám phá thêm những công nghệ mới nhất được ứng dụng cho mô hình
              dự án{" "}
              <a
                href=" https://www.mohinhviet.com/mohinhtuongtac"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#294B61",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Mô hình Việt!
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}