"use client";

import { useState } from "react";
import { Image, SimpleGrid, Modal, Group, Button } from "@mantine/core";
import style from "./listimage.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";


const images = [
  "/Millenia/1809 VIEW6.jpg",
  "/Millenia/1809 VIEW7.jpg",
  "/Millenia/1809 VIEW8.jpg",
  "/Millenia/BTSL_1.jpg",
  "/Millenia/BTSL_D.jpg",
  "/Millenia/BTSL_G.jpg",
  "/Millenia/BTV_D.jpg",
  "/Millenia/BTV_G.jpg",
  "/Millenia/BTV.jpg",
  "/Millenia/Cam3 BietThuVenHo.jpg",
    "/Millenia/Cam4 TruongHoc Updated2.jpg",
     "/Millenia/Cam5 CongVienUpdated2.jpg",
       "/Millenia/CongVien.jpg",
       "/Millenia/CTCC_THCS 1.png",
       "/Millenia/CTCC_TIEU HOC 1.png",
       "/Millenia/CTCC_TIEU HOC 2.png",
       "/Millenia/CTCC_TIEU HOC 3.png",
       "/Millenia/CTCC_Y TE 1.png",
       "/Millenia/CTCC_Y TE 2.png",
       "/Millenia/CTCC_Y TE 3.png",
       "/Millenia/FPT school 2.jpg",
       "/Millenia/FPT school.jpg",
       "/Millenia/LK1 A1.jpg",
       "/Millenia/LK1 A2.jpg",
       "/Millenia/LK1_D.jpg",
       "/Millenia/LK1_G.jpg",
       "/Millenia/LK1.1.jpg",
       "/Millenia/LK2 A1.jpg",
       "/Millenia/LK2 A2.jpg",
       "/Millenia/LK2_D.jpg",
       "/Millenia/LK2_G.jpg",
       "/Millenia/SH2.jpg",
       "/Millenia/ShopHouse.jpg",
       "/Millenia/SL A1.jpg",
       "/Millenia/SL A2.jpg",
       "/Millenia/SL A3.jpg",
       "/Millenia/SL_D.jpg",
       "/Millenia/SL_G.jpg",
       "/Millenia/sl.jpg",
       "/Millenia/T_T city Millannia (3).jpeg",
       "/Millenia/TMB TOAN KHU.jpg",
       "/Millenia/TMB topdown.jpeg",
       "/Millenia/Tổng mặt bằng toàn DA_ngày.jpg",
       "/Millenia/TruongHoc.jpg",
       "/Millenia/TT-city-long-hậu1-min.jpeg",
       "/Millenia/tt-city-millennia-phoi-canh.jpeg",
       "/Millenia/tt-city-millennia1_optimized.jpeg",
       "/Millenia/view 1.jpg",
       "/Millenia/VIEW9.jpg",
       "/Millenia/Bản sao của LK1_D.jpg",
        "/Millenia/Bản sao của LK1.1.jpg",
         "/Millenia/Bản sao của SH1_D.jpg",
          "/Millenia/Bản sao của SH1_G.jpg",
           "/Millenia/Bản sao của SH1.jpg",
            "/Millenia/Bản sao của SL_D.jpg",
             "/Millenia/Bản sao của sl.jpg",
              "/Millenia/POOL_1.jpg",
               "/Millenia/POOL_2.jpg",
                "/Millenia/POOL_3.jpg",
                 "/Millenia/POOL_4.jpg",
];
interface ListImageProps {
  project_id: string | null;
}

export default function ListImage({ project_id }: ListImageProps) {
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setOpened(true);
  };

  return (
    <div className={style.box}>
      {/* Modal hiển thị ảnh lớn */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        size="70%"
        withCloseButton
      >
        {selectedImage && (
          <div style={{ textAlign: "center" }}>
            <Image
              src={selectedImage}
              alt="Selected"
              fit="contain"
              style={{
                maxHeight: "60vh",
                margin: "0 auto 20px",
              }}
            />
          </div>
        )}

        {/* Thumbnail nhỏ bên dưới */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImage(src)}
              style={{
                height: "60px",
                cursor: "pointer",
                border:
                  selectedImage === src ? "2px solid red" : "0.5px solid #ccc",
                borderRadius: "5px",
              }}
              loading="lazy"
            />
          ))}
        </div>
      </Modal>

      {/* Hiển thị list ảnh ngoài */}
      <SimpleGrid cols={5} spacing="md">
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              width: "90%",
              height: "120px",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
            onClick={() => handleImageClick(src)}
          >
            <Image
              src={src}
              alt={`image-${index}`}
              fit="cover"
              width="100%"
              height="100%"
              radius="md"
            />
          </div>
        ))}
      </SimpleGrid>

      {/* Nút quay lại và truyền project_id đúng cách */}
   <Group gap="xs" mt="md" justify="flex-end">
  <Button
    onClick={() => router.push(`/Tuong-tac/Millennia-City?id=${project_id}`)}
    variant="filled"
    style={{
      width: 30,
      height: 30,
      padding: 0,
      borderRadius: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FFFAEE",
      color: "#752E0B",
      border: "1.5px solid #752E0B",
    }}
  >
    <IconArrowLeft size={18} color="#752E0B" />
  </Button>
</Group>

    </div>
  );
}