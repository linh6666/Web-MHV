"use client";

import { Container, Title } from "@mantine/core";
import styles from "./FavoritesList.module.css"; 

export default function FavoritesList() {
  // ✅ Dữ liệu mẫu (mock)
  const mockData = [
    {
      id: 1,
      zone_name: "Phân Khu 1",
      building_name: "A_SLS 9.5x20",
      bedroom: 4,
      price: 3500000000,
      direction: "Đông Nam",
      status: "Đang bán",
    },
    {
      id: 2,
      zone_name: "Phân Khu 2",
      building_name: "B_SL 8x18",
      bedroom: 3,
      price: 2900000000,
      direction: "Tây Bắc",
      status: "Đang bán",
    },
    {
      id: 3,
      zone_name: "Phân Khu 2",
      building_name: "B_SL 8x18",
      bedroom: 3,
      price: 2900000000,
      direction: "Tây Bắc",
      status: "Đang bán",
    },
    {
      id: 4,
      zone_name: "Phân Khu 2",
      building_name: "B_SL 8x18",
      bedroom: 3,
      price: 2900000000,
      direction: "Tây Bắc",
      status: "Đang bán",
    },
  ];

  interface BuildingItem {
    id: number;
    zone_name: string;
    building_name: string;
    bedroom: number;
    price: number;
    direction: string;
    status: string;
  }

  const handleGoToDetailPage = (_item: BuildingItem) => {
    // alert(`Chuyển tới trang chi tiết: ${item.building_name}`);
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} c="#053c74" ta="center" mb="lg">
        Danh sách yêu thích
      </Title>

      <div className={styles.gridContainer}>
        {mockData.map((item) => (
          <div
            key={item.id}
            className={styles.buildingCard}
            onClick={() => handleGoToDetailPage(item)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.buildingHeader}>
              <span className={styles.buildingName}>{item.zone_name}</span>
            </div>

            <div className={styles.buildingDetails}>
              <p style={{ fontSize: "14px" }}>
                Tên nhà: {item.building_name ?? "Chưa có"}
              </p>
              <p style={{ fontSize: "14px" }}>
                Phòng ngủ: {item.bedroom ?? "Chưa có"}
              </p>
              <p style={{ fontSize: "14px" }}>
                Giá:{" "}
                {item.price
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(item.price))
                  : "Chưa có"}
              </p>
              <p style={{ fontSize: "14px" }}>
                Hướng: {item.direction ?? "Chưa có"}
              </p>
            </div>

            <div
              className={styles.statusBadge}
              style={{
                backgroundColor:
                  item.status === "Đang bán"
                    ? "#4CAF50"
                    : item.status === "Đã bán"
                    ? "#F44336"
                    : item.status === "Đã đặt cọc"
                    ? "#FFC107"
                    : "#000",
                color: "#fff",
              }}
            >
              {item.status ?? "Không rõ"}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
