// "use client";

// import { useState } from "react";
// import {
//   Image,
//   SimpleGrid,
//   Modal,
//   Group,
//   Button,
// } from "@mantine/core";
// import NextImage from "next/image";
// import style from "./listimage.module.css";
// import { IconArrowLeft } from "@tabler/icons-react";
// import { useRouter } from "next/navigation";

// const images = [
//   "/Millenia/1809 VIEW6.jpg",
//   "/Millenia/1809 VIEW7.jpg",
//   "/Millenia/1809 VIEW8.jpg",
//   "/Millenia/BTSL_1.jpg",
//   "/Millenia/BTSL_D.jpg",
//   "/Millenia/BTSL_G.jpg",
//   "/Millenia/BTV_D.jpg",
//   "/Millenia/BTV_G.jpg",
//   "/Millenia/BTV.jpg",
//   "/Millenia/Cam3 BietThuVenHo.jpg",
//   "/Millenia/Cam4 TruongHoc Updated2.jpg",
//   "/Millenia/Cam5 CongVienUpdated2.jpg",
//   "/Millenia/CongVien.jpg",
//   "/Millenia/CTCC_THCS 1.png",
//   "/Millenia/CTCC_TIEU HOC 1.png",
//   "/Millenia/CTCC_TIEU HOC 2.png",
//   "/Millenia/CTCC_TIEU HOC 3.png",
//   "/Millenia/CTCC_Y TE 1.png",
//   "/Millenia/CTCC_Y TE 2.png",
//   "/Millenia/CTCC_Y TE 3.png",
//   "/Millenia/FPT school 2.jpg",
//   "/Millenia/FPT school.jpg",
//   "/Millenia/LK1 A1.jpg",
//   "/Millenia/LK1 A2.jpg",
//   "/Millenia/LK1_D.jpg",
//   "/Millenia/LK1_G.jpg",
//   "/Millenia/LK1.1.jpg",
//   "/Millenia/LK2 A1.jpg",
//   "/Millenia/LK2 A2.jpg",
//   "/Millenia/LK2_D.jpg",
//   "/Millenia/LK2_G.jpg",
//   "/Millenia/SH2.jpg",
//   "/Millenia/ShopHouse.jpg",
//   "/Millenia/SL A1.jpg",
//   "/Millenia/SL A2.jpg",
//   "/Millenia/SL A3.jpg",
//   "/Millenia/SL_D.jpg",
//   "/Millenia/SL_G.jpg",
//   "/Millenia/sl.jpg",
//   "/Millenia/T_T city Millannia (3).jpeg",
//   "/Millenia/TMB TOAN KHU.jpg",
//   "/Millenia/TMB topdown.jpeg",
//   "/Millenia/Tổng mặt bằng toàn DA_ngày.jpg",
//   "/Millenia/TruongHoc.jpg",
//   "/Millenia/TT-city-long-hậu1-min.jpeg",
//   "/Millenia/tt-city-millennia-phoi-canh.jpeg",
//   "/Millenia/tt-city-millennia1_optimized.jpeg",
//   "/Millenia/view 1.jpg",
//   "/Millenia/VIEW9.jpg",
//   "/Millenia/Bản sao của LK1_D.jpg",
//   "/Millenia/Bản sao của LK1.1.jpg",
//   "/Millenia/Bản sao của SH1_D.jpg",
//   "/Millenia/Bản sao của SH1_G.jpg",
//   "/Millenia/Bản sao của SH1.jpg",
//   "/Millenia/Bản sao của SL_D.jpg",
//   "/Millenia/Bản sao của sl.jpg",
//   "/Millenia/POOL_1.jpg",
//   "/Millenia/POOL_2.jpg",
//   "/Millenia/POOL_3.jpg",
//   "/Millenia/POOL_4.jpg",
// ];

// interface ListImageProps {
//   project_id: string | null;
// }

// export default function ListImage({ project_id }: ListImageProps) {
//   const [opened, setOpened] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const router = useRouter();

//   const handleImageClick = (src: string) => {
//     setSelectedImage(src);
//     setOpened(true);
//   };

//   return (
//     <div className={style.box}>
//       {/* Modal hiển thị ảnh lớn */}
//       <Modal
//         opened={opened}
//         onClose={() => setOpened(false)}
//         centered
//         size="70%"
//         withCloseButton
//       >
//         {selectedImage && (
//           <div style={{ textAlign: "center" }}>
//             <Image
//               src={selectedImage}
//               alt="Selected"
//               fit="contain"
//               style={{
//                 maxHeight: "60vh",
//                 margin: "0 auto 20px",
//               }}
//             />
//           </div>
//         )}

//         {/* Thumbnail bên dưới (FIX <img> -> next/image) */}
//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             overflowX: "auto",
//             paddingBottom: "8px",
//             marginTop: "10px",
//           }}
//         >
//           {images.map((src, index) => (
//             <div
//               key={index}
//               onClick={() => setSelectedImage(src)}
//               style={{
//                 height: "60px",
//                 border:
//                   selectedImage === src
//                     ? "2px solid red"
//                     : "0.5px solid #ccc",
//                 borderRadius: "5px",
//                 overflow: "hidden",
//                 cursor: "pointer",
//                 flexShrink: 0,
//               }}
//             >
//               <NextImage
//                 src={src}
//                 alt={`thumb-${index}`}
//                 width={100}
//                 height={60}
//                 style={{
//                   objectFit: "cover",
//                   height: "100%",
//                   width: "auto",
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       </Modal>

//       {/* Grid ảnh ngoài */}
//       <SimpleGrid cols={5} spacing="md">
//         {images.map((src, index) => (
//           <div
//             key={index}
//             style={{
//               width: "90%",
//               height: "120px",
//               overflow: "hidden",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "#f5f5f5",
//               borderRadius: "8px",
//             }}
//             onClick={() => handleImageClick(src)}
//           >
//             <Image
//               src={src}
//               alt={`image-${index}`}
//               fit="cover"
//               width="100%"
//               height="100%"
//               radius="md"
//             />
//           </div>
//         ))}
//       </SimpleGrid>

//       {/* Nút quay lại */}
//       <Group gap="xs" mt="md" justify="flex-end">
//         <Button
//           onClick={() =>
//             router.push(`/Tuong-tac/Millennia-City?id=${project_id}`)
//           }
//           variant="filled"
//           style={{
//             width: 30,
//             height: 30,
//             padding: 0,
//             borderRadius: 40,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "#FFFAEE",
//             color: "#752E0B",
//             border: "1.5px solid #752E0B",
//           }}
//         >
//           <IconArrowLeft size={18} color="#752E0B" />
//         </Button>
//       </Group>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  Image,
  SimpleGrid,
  Modal,
  Group,
  Button,
  Card,
  Text,
} from "@mantine/core";
import NextImage from "next/image";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import style from "./listimage.module.css";

/* ===================== DATA ===================== */
 interface ListImageProps {
  project_id: string | null;
 }
const FOLDERS: Record<string, string[]> = {
  "BOUTIQUE VILLAS": [
    "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (1).jpg",
    "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (2).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (3).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (4).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (5).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (6).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (7).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (8).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (9).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (10).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (11).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (12).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (13).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (14).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (15).jpg",
    "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (16).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (17).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (18).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (19).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (20).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (21).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (22).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (23).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (24).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (25).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (26).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (27).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (28).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (29).jpg",
    "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (30).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (31).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (32).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (33).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (34).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (35).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (36).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (37).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (38).jpg",
     "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (39).jpg",
      "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (40).jpg",
       "/BOUTIQUE VILLAS/BOUTIQUE VILLAS (41).jpg",
     
    
    
  ],
  EMPIRE: [
    "/EMPIRE/EMPIRE_001.jpg",
    "/EMPIRE/EMPIRE_002.jpg",
    "/EMPIRE/EMPIRE_003.jpg",
    "/EMPIRE/EMPIRE_004.jpg",
    "/EMPIRE/EMPIRE_005.jpg",
    "/EMPIRE/EMPIRE_006.jpg",
    "/EMPIRE/EMPIRE_007.jpg",
    "/EMPIRE/EMPIRE_008.jpg",
    "/EMPIRE/EMPIRE_009.jpg",
    "/EMPIRE/EMPIRE_010.jpg",
    "/EMPIRE/EMPIRE_011.jpg",
    "/EMPIRE/EMPIRE_012.jpg",
   
  ],
  "SUNSHINE CITY": [
    "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (1).jpg",
     "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (2).jpg",
      "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (3).jpg",
       "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (4).jpg",
        "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (5).jpg",
         "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (6).jpg",
          "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (7).jpg",
           "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (8).jpg",
            "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (9).jpg",
             "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (10).jpg",
              "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (11).jpg",
               "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (12).jpg",
                "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (13).jpg",
                 "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (14).jpg",
                  "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (15).jpg",
                   "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (16).jpg",
                        "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (17).jpg",
        "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (18).jpg",
         "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (19).jpg",
          "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (20).jpg",
           "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (21).jpg",
            "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (22).jpg",
             "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (23).jpg",
              "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (24).jpg",
               "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (25).jpg",
                "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (26).jpg",
                 "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (27).jpg",
                  "/SUNSHINE CITY/CAO TANG/SUNSHINE CITY CT (28).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (1).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (2).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (3).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (4).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (5).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (6).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (7).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (8).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (9).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (10).jpg",
                   "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (11).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (12).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (13).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (14).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (15).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (16).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (17).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (18).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (19).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (20).jpg",
                   "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (21).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (22).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (23).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (24).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (25).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (26).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (27).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (28).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (29).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (30).jpg",
                        "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (31).jpg",
                   "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (32).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (33).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (34).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (35).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (36).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (37).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (38).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (39).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (40).jpg",
                  "/SUNSHINE CITY/THAP TANG/SUNSHINE CITY (41).jpg",

                  
                  

                

                
   
  ],
   "SUNSHINE INTERNATIONAL SCHOOL": [
    "/SUNSHINE INTERNATIONAL SCHOOL/241209 -TuyenCQSHTruonghoc-GolfVillas-01.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/241209 -TuyenCQSHTruonghoc-GolfVillas-02.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/241209 -TuyenCQSHTruonghoc-GolfVillas-03.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/241209 -TuyenCQSHTruonghoc-GolfVillas-04.jpg",
  
    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-02.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-03.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-04.jpg",
    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-05.png",
    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-06 2.png",
      "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-07 2.png",
        "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-08 2.png",
          "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-09.jpg",
            "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-10.jpg",
                "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-11.jpg",
                "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-12.jpg",
                   "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-13.jpg",
                    "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-14.jpg",
                         "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-15.jpg",
                           "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-16.jpg",
                              "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-17.jpg",
                                 "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-18 2.png",
                                  "/SUNSHINE INTERNATIONAL SCHOOL/250105_S SCHOOL-19.jpg",





   
   
  ],
};

/* ===================== COMPONENT ===================== */

export default function GalleryByFolder({ project_id }: ListImageProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const images = selectedFolder ? FOLDERS[selectedFolder] : [];

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setOpened(true);
  };

  /* ===================== VIEW: FOLDER LIST ===================== */
  if (!selectedFolder) {
    return (
      <div className={style.box}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: "md", lg: "xl" }}
        >
          {Object.keys(FOLDERS).map((folder) => (
            <Card
              key={folder}
              withBorder
              shadow="sm"
              padding="xl"
              radius="md"
              className={style.folderCard}
              onClick={() => setSelectedFolder(folder)}
            >
              <Text fw={600} className={style.folderTitle}>
                📁 {folder}
              </Text>
              <Text size="sm" c="dimmed">
                {FOLDERS[folder].length} ảnh
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Group gap="xs" mt="xl" justify="flex-end">
          <Button
            onClick={() => router.push(`/tuong-tac/Ciputra?id=${project_id}`)}
            variant="filled"
            className={style.backBtn}
          >
            <IconArrowLeft size={20} color="#294b61" />
          </Button>
        </Group>
      </div>
    );
  }

  /* ===================== VIEW: IMAGE GALLERY ===================== */
  return (
    <div className={style.box}>
      {/* Modal ảnh lớn */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        size="90%"
        radius="md"
        withCloseButton
        styles={{
          body: { padding: "clamp(10px, 2vw, 20px)" },
          title: { fontWeight: 700 },
        }}
      >
        {selectedImage && (
          <div className={style.modalImageWrapper}>
            <Image
              src={selectedImage}
              alt="Selected"
              className={style.modalMainImage}
            />
          </div>
        )}

        {/* Thumbnail */}
        <div className={style.thumbList}>
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(src)}
              className={`${style.thumbItem} ${
                selectedImage === src ? style.thumbItemActive : ""
              }`}
            >
              <NextImage
                src={src}
                alt={`thumb-${index}`}
                width={100}
                height={75}
                className={style.thumbImg}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Grid ảnh */}
      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing="md"
        className={style.galleryGrid}
      >
        {images.map((src, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(src)}
            className={style.imageItem}
          >
            <Image src={src} alt="" fit="cover" h="100%" />
          </div>
        ))}
      </SimpleGrid>

      {/* Nút quay lại */}
      <Group justify="flex-end" mt="xl">
        <Button
          onClick={() => setSelectedFolder(null)}
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          radius="md"
        >
          Quay lại thư mục
        </Button>
      </Group>
    </div>
  );
}
