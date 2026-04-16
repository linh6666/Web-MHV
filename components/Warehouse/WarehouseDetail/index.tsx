
"use client";
import { useEffect, useState } from "react";
import { Text, Button, Image } from "@mantine/core";
import { IconArrowLeft, IconClipboardText } from "@tabler/icons-react";
import { Getlisthome } from "../../../api/apiGetListHome";
import styles from "./App.module.css";
import { AxiosError } from "axios";
import ImageActionButtons from "./ImageActionButtons";
import OrderButton from "./Order";

export interface WarehouseItem {
  id: string;
  unit_code: string;
  color?: string;
  zone?: string;
  building_type?: string;
  layer6?: string;
  unit_name?: string;
  view?: string;
  layer3: string;
  layer2?: string;
  main_door_direction?: string;
  balcony_direction?: string;
  describe?: string;
  describe_vi?: string;
  status_unit: string;
  bedroom?: string | number;
  bathroom?: string | number;
  direction?: string;
  price?: number;
  leaf_id?: string;
}

interface WarehouseDetailProps {
  item: WarehouseItem;
  projectId: string;
  onBack: () => void;
}

export interface WarehouseItemdeltall {
  unit_code: string;
  name_vi: string;
  name_en: string;
  describe_vi: string;
  unit_name: string;
  description_en: string;
  url: string;
  id: string;
  direction?: string;
  bedroom?: number;
  bathroom?: string;
  price?: number;
}

export default function WarehouseDetail({ item, onBack, projectId }: WarehouseDetailProps) {
  const [data, setData] = useState<WarehouseItemdeltall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const imageData = data.filter((item) => item.url.match(/\.(jpg|jpeg|png|gif)$/i));
  const pdfData = data.filter((item) => item.url.match(/\.pdf$/i));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!item.leaf_id) {
          setError("Leaf ID căn hộ không hợp lệ");
          return;
        }

        const response = await Getlisthome({
          node_attribute_id: item.leaf_id,
        });

        // Xử lý dữ liệu trả về: lấy mảng từ các key phổ biến nếu response là Object
        const imagesArray = Array.isArray(response) ? response : (response.results || response.data || response.items || []);
        setData(imagesArray);
        setIndex(0); // reset slider khi đổi căn
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 404) {
            setError("Không có dữ liệu!");
          } else {
            setError(err.message || "Lỗi khi lấy dữ liệu");
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [item, projectId]);

  const goNext = () => {
    if (index < imageData.length - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const current = imageData.length > 0 ? imageData[index] : null;

  return (
    <div className={styles.container}>
      {/* Nút quay lại */}
      <Button
        onClick={onBack}
        variant="light"
        leftSection={<IconArrowLeft />}
        style={{ marginBottom: "20px" }}
      >
        Quay lại
      </Button>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.detailWrapper}>
        {/* Cột trái */}
        <div className={styles.leftColumn}>
          <>
            <Text fw={700} mb={12} style={{ fontSize: "1.2rem" }}>
              Chi tiết căn hộ: {item.zone}
            </Text>

            {/* Zone / Layer3 */}
            {/* {item.zone && item.zone.trim().toLowerCase() !== "skip" ? (
              <Text style={{ fontSize: "15px" }}>Phân khu: {item.}</Text>
            ) : item.layer3 && item.layer3.trim().toLowerCase() !== "skip" ? (
              <Text style={{ fontSize: "15px" }}>Tòa: {item.layer3}</Text>
            ) : null} */}

            {/* Building type / Layer2 */}
            {item.building_type && item.building_type.trim().toLowerCase() !== "skip" ? (
              <Text style={{ fontSize: "15px" }}>Loại công trình: {item.building_type}</Text>
            ) : item.layer2 && item.layer2.trim().toLowerCase() !== "skip" ? (
              <Text style={{ fontSize: "15px" }}>Vị trí: {item.layer2}</Text>
            ) : null}
            {item.unit_name && item.unit_name.trim().toLowerCase() !== "skip" ? (
  <Text style={{ fontSize: "15px" }}>
    Tên căn: {item.unit_name}
  </Text>
) : item.layer3 && item.layer3.trim().toLowerCase() !== "skip" ? (
  <Text style={{ fontSize: "15px" }}>
    Tòa: {item.layer3}
  </Text>
) : null}

            {/* Phòng ngủ */}
            {item.bedroom != null &&
              item.bedroom !== "" &&
              String(item.bedroom).trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>Phòng ngủ: {item.bedroom}</Text>
              )}

            {/* Phòng tắm */}
            {item.bathroom != null &&
              item.bathroom !== "" &&
              String(item.bathroom).trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>Phòng tắm: {item.bathroom}</Text>
              )}

            {/* Hướng */}
            {item.direction &&
              item.direction.trim() !== "" &&
              item.direction.trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>Hướng: {item.direction}</Text>
              )}

            {/* Hướng cửa chính */}
            {item.main_door_direction &&
              item.main_door_direction.trim() !== "" &&
              item.main_door_direction.trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>
                  Hướng cửa chính: {item.main_door_direction}
                </Text>
              )}

            {/* Hướng ban công */}
            {item.balcony_direction &&
              item.balcony_direction.trim() !== "" &&
              item.balcony_direction.trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>
                  Hướng ban công: {item.balcony_direction}
                </Text>
              )}

            {/* Cảnh quan */}
            {item.view &&
              item.view.trim() !== "" &&
              item.view.trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>Cảnh quan: {item.view}</Text>
              )}

            {/* Trạng thái */}
            {item.status_unit &&
              item.status_unit.trim() !== "" &&
              item.status_unit.trim().toLowerCase() !== "skip" && (
                <Text style={{ fontSize: "15px" }}>Trạng thái: {item.status_unit}</Text>
              )}

            {/* Giá */}
            {item.price != null && item.price !== 0 && (
              <Text style={{ fontSize: "15px" }}>
                Giá: {item.price.toLocaleString()}đ
              </Text>
            )}

            {/* Mô tả */}
            {(item.describe_vi || item.describe) && (
              <Text style={{ marginTop: "10px" }}>
                <b>Mô tả:</b> {item.describe_vi || item.describe}
              </Text>
            )}
          </>


          {/* Hiển thị PDF */}
          {pdfData.map((pdf) => (
            <div key={pdf.id} style={{ marginTop: "15px" }}>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", textDecoration: "underline", alignItems: "center", gap: "5px", color: "#228be6" }}
              >
                <IconClipboardText size={20} /> Xem tài liệu: {pdf.name_vi || pdf.name_en || pdf.id}
              </a>
            </div>
          ))}

          <div className={styles.actionButtons}>
            <ImageActionButtons
              unitCode={item.unit_code}
              projectId={projectId}
            />
            <OrderButton
              house={item}
              projectId={projectId}
            />
          </div>
        </div>

        {/* Cột phải: SLIDER */}
        <div className={styles.rightColumn}>
          <div className={styles.imageContainer}>
            <Image
              src={current?.url || "/image/test1.jpg"}
              alt={current?.description_en || "No image"}
              width={800}
              height={600}
              className={styles.sliderImage}
            />

            <button
              onClick={goPrev}
              disabled={index === 0}
              className={`${styles.navButton} ${styles.prevButton}`}
            >
              ◀
            </button>

            <button
              onClick={goNext}
              disabled={index === imageData.length - 1}
              className={`${styles.navButton} ${styles.nextButton}`}
            >
              ▶
            </button>
          </div>

          {/* Thumbnail gallery */}
          <div className={styles.thumbnailGallery}>
            {imageData.length > 0 ? (
              imageData.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setIndex(i)}
                  className={`${styles.thumbnailItem} ${i === index ? styles.thumbnailItemActive : ""}`}
                >
                  <Image 
                    src={item.url || "/image/test1.jpg"} 
                    alt={item.description_en || "No image"} 
                    width={80} 
                    height={60} 
                    className={styles.thumbnailImage}
                    style={{ maxWidth: "80px", maxHeight: "60px" }}
                  />
                </div>
              ))
            ) : (
              <div className={styles.thumbnailItem}>
                <Image 
                  src="/image/test1.jpg" 
                  alt="Fallback thumbnail"
                  width={80} 
                  height={60} 
                  fit="cover"
                  radius="sm" 
                  className={styles.thumbnailImage}
                  style={{ maxWidth: "80px", maxHeight: "60px" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
