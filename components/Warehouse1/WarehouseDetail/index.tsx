
"use client";
import { useEffect, useState } from "react";
import { Text, Button, Image } from "@mantine/core";
import { IconArrowLeft, IconClipboardText } from "@tabler/icons-react";
import { Getlisthome } from "../../../api/apiGetListHome";
import styles from "./App.module.css";
import { AxiosError } from "axios";
import ImageActionButtons from "../ImageActionButtons";
import OrderButton from "../Order";

export interface WarehouseItem {
  id: string;
  unit_code: string;
  color: string;
  zone: string;
  building_type: string;
  layer6: string;
  view: string;
  layer3: string;
  layer2: string;
  main_door_direction: string;
  balcony_direction: string;
  describe: string;
  describe_vi: string;
  status_unit: string;
  bedroom: string | number;
  bathroom: string | number;
  direction: string;
  price: number;
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
        if (!projectId || !item.unit_code) {
          setError("Project ID hoặc Unit Code không hợp lệ");
          return;
        }

        const response = await Getlisthome({
          node_attribute_id: item.id,
        });

        // Xử lý dữ liệu trả về: lấy mảng từ các key phổ biến nếu response là Object
        const imagesArray = Array.isArray(response)
          ? response
          : response.results || response.data || response.items || [];
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
    <div className={styles.container} style={{ padding: "20px" }}>
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

      <div style={{ display: "flex", height: "80vh" }}>
        {/* Cột trái */}
        <div style={{ flex: 1 }}>
        <>
  <Text fw={700} mb={12} style={{ fontSize: "18px" }}>
    Chi tiết căn hộ: {item.unit_code}
  </Text>

  {(item.zone || item.layer3) && (
    <Text style={{ fontSize: "15px" }}>
      {item.zone ? `Phân khu: ${item.zone}` : `Tòa: ${item.layer3}`}
    </Text>
  )}

  {(item.building_type || item.layer2) && (
    <Text style={{ fontSize: "15px" }}>
      {item.building_type
        ? `Loại công trình: ${item.building_type}`
        : `Vị trí: ${item.layer2}`}
    </Text>
  )}

  {item.bedroom &&
    typeof item.bedroom === "string" &&
    item.bedroom.trim().toLowerCase() !== "skip" && (
      <Text style={{ fontSize: "15px" }}>
        Phòng ngủ: {item.bedroom}
      </Text>
    )}

  {item.bathroom &&
    (typeof item.bathroom !== "string" ||
      item.bathroom.trim().toLowerCase() !== "skip") && (
      <Text style={{ fontSize: "15px" }}>
        Phòng tắm: {item.bathroom}
      </Text>
    )}

  {item.direction &&
    item.direction.trim().toLowerCase() !== "skip" && (
      <Text style={{ fontSize: "15px" }}>
        Hướng: {item.direction}
      </Text>
    )}

  {item.main_door_direction &&
    item.main_door_direction.trim().toLowerCase() !== "skip" && (
      <Text style={{ fontSize: "15px" }}>
        Hướng cửa chính: {item.main_door_direction}
      </Text>
    )}

  {item.balcony_direction &&
    item.balcony_direction.trim().toLowerCase() !== "skip" && (
      <Text style={{ fontSize: "15px" }}>
        Hướng ban công: {item.balcony_direction}
      </Text>
    )}

  {item.view && (
    <Text style={{ fontSize: "15px" }}>
      Cảnh quan: {item.view}
    </Text>
  )}

  {item.status_unit && (
    <Text style={{ fontSize: "15px" }}>
      Trạng thái: {item.status_unit}
    </Text>
  )}

{item.price !== null && (
  <Text style={{ fontSize: "15px" }}>
    Giá: {item.price.toLocaleString()}đ
  </Text>
)}

  {(item.describe_vi || item.describe) && (
    <Text>
      <b>Mô tả:</b> {item.describe_vi || item.describe}
    </Text>
  )}
</>

          {/* Hiển thị PDF */}
          {pdfData.map((pdf) => (
            <div key={pdf.id} style={{ marginTop: "10px" }}>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", textDecoration: "underline" }}
              >
                <IconClipboardText /> Xem tài liệu: {pdf.name_vi || pdf.name_en || pdf.id}
              </a>
            </div>
          ))}
<div
 style={{
    display: "flex",
    gap: "12px", // khoảng cách giữa 2 nút
    // alignItems: "center",
  }}
>
           <ImageActionButtons
  unitCode={item.unit_code}
  projectId={projectId}
/>

           <OrderButton
  unitCode={item.unit_code}
  projectId={projectId}
/>


</div>

        </div>
                       {/* Cột phải: SLIDER */}
        <div
          style={{
            flex: 2,
            paddingLeft: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <Image
              src={current?.url || "/image/test1.jpg"}
              alt={current?.description_en || "No image"}
              width={800}
              height={600}
              style={{ maxWidth: "100%", borderRadius: "8px", height: "auto" }}
            />

            <button
              onClick={goPrev}
              disabled={index === 0}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ◀
            </button>

            <button
              onClick={goNext}
              disabled={index === imageData.length - 1}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ▶
            </button>
          </div>

          {/* Thumbnail gallery */}
        <div
  style={{
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  }}
>
  {imageData.length > 0 ? (
    imageData.map((item, i) => (
      <div
        key={item.id}
        onClick={() => setIndex(i)}
        style={{
          border: i === index ? "2px solid blue" : "1px solid #ccc",
          padding: "2px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
       <Image src={item.url || "/image/test1.jpg"} alt={item.description_en || "No image"} width={80} height={60} style={{ objectFit: "cover", borderRadius: "4px", display: "block", maxWidth: "80px",  maxHeight: "60px"  }} />
      </div>
    ))
  ) : (
    // Nếu không có dữ liệu ảnh thì hiển thị thumbnail mặc định
    <div
      style={{
        border: "1px solid #ccc",
        padding: "2px",
        borderRadius: "4px",
      }}
    >
      <Image src="/image/test1.jpg" 
        alt="Fallback thumbnail"
        // ảnh mặc định trong public alt="Fallback thumbnail"
        width={80} height={60} fit="cover"
          radius="sm"  style={{ objectFit: "cover", borderRadius: "4px", display: "block", maxWidth: "80px",  maxHeight: "60px"  }} />
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}
