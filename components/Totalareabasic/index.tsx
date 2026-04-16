"use client";
import { Button, Group } from "@mantine/core";
import styles from "./App.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

interface WarehouseDetailProps {
  projectId: string;
  projectName?: string;
}

const folderImages = [
  "mhvciputra.jpg",
  
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/\s+/g, "");
}

function findImageByProjectName(projectName?: string) {
  if (!projectName) return null;
  const normalizedName = normalizeText(projectName);
  return folderImages.find((img) => normalizeText(img).includes(normalizedName));
}

export default function Totalarea({
  projectId,
  projectName,
}: WarehouseDetailProps) {
  const matchedImage = findImageByProjectName(projectName);
   const router = useRouter();

  const handleSvgClick = (target: string) => {
    // Ví dụ: chuyển sang trang /details/[target]
  router.push(
  `/thong-tin-san-pham/Kho-hang/${projectId}?target=${encodeURIComponent(target)}&name=${encodeURIComponent(projectName || "")}`
);


  };

const handleBack = () => {
  router.push("/thong-tin-san-pham");
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tổng mặt bằng: {projectName || "Chưa có tên dự án"}
      </h1>

      {matchedImage ? (
        <div className={styles.imageWrapper}>
          
          <Image
            src={`/Sales/${matchedImage}`}
            alt={projectName || "Hình ảnh dự án"}
            width={1000}
            height={500}
            className={styles.projectImage}
          />

          {/* HIỆN SVG CHỈ CHO ttcitymillennia.png */}
    {matchedImage === "mhvciputra.jpg" && (
 


  <svg
   xmlns="http://www.w3.org/2000/svg"
     className={styles.overlaySvg}
    width="1154.229" height="707.119" 
    viewBox="0 0 1154.229 707.119">
  <path 
  id="NOBLE_PALACE_TAY_HO_-_PHÂN_KHU_THE_GOLF_MANSION" 
  data-name="NOBLE PALACE TAY HO - PHÂN KHU THE GOLF MANSION" 
  d="M-17452.367-22397.033c3.2,0,66.881-12.8,70.082-11.375s2.129,3.295,4.975,22.5,7.471,53,5.691,57.623-89.992,16.717-108.133,21.342-49.443,19.564-67.939-21.342-15.854-38.3-15.854-38.3l83.793-23.85,3.9,12.109,26.053-5.871Z" transform="translate(17787.811 22547.275)" fill="#0082c0" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="VIETINBANK_TOWER" data-name="VIETINBANK TOWER"
    onClick={() => handleSvgClick("VIETINBANK TOWER")}
   d="M-17658.561-22256.7l18.662,76.3-40.225-13.27-18.248-7.051-9.537-72.156,27.785,4.977Z" transform="translate(17784.539 22549.08)" fill="#64bc4e" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="ĐÔNG_ĐÔ_GREEN" 
    onClick={() => handleSvgClick("ĐÔNG ĐÔ GREEN")}
  data-name="ĐÔNG ĐÔ GREEN" d="M-17780.074-22378.77c-8.467,10.6-4.658,40.322,29.348,82.621s62.844,25.52,62.844,25.52,47.881-16.111,53.273-30.625-46.895-42.107-46.895-42.107-10.574-15.338-13.133-31.113c-1.236-7.629-4.139-24.238-26.74-24.393S-17771.607-22389.371-17780.074-22378.77Z" transform="translate(17784.539 22549.08)" fill="#090" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="SUNSHINE_CITY" 
  data-name="SUNSHINE CITY"
  onClick={() => handleSvgClick("SUNSHINE CITY")}
   d="M-17679.373-22406.846s-15.246,8.5-13.4,19.141,11.188,35.795,11.188,35.795,5.549-2.311,11.1,3.238,5.547,10.174,5.086,13.41,65.871,38.262,68.646,36.875,35.146-60.078,9.252-90.6S-17679.373-22406.846-17679.373-22406.846Z" transform="translate(17780.811 22549.08)" fill="#04ab57" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NOBLE_PALACE_TAY_HO_-_PHÂN_KHU_THE_BOUTIQUE_MANSION" 
  onClick={() => handleSvgClick("NOBLE PALACE TAY HO - PHÂN KHU THE BOUTIQUE MANSION")}
  data-name="NOBLE PALACE TAY HO - PHÂN KHU THE BOUTIQUE MANSION" d="M-17384.391-22450.572l8.816,58.732,145.145-23.605-11.166-55.824Z" transform="translate(17784.539 22549.08)" fill="#03ae88" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="GRAND_GARDEN_VILLE_TAY_HO" 
  onClick={() => handleSvgClick("GRAND GARDEN VILLE TAY HO")}
  data-name="GRAND GARDEN VILLE TAY HO" d="M-17373.664-22385.934l8.525,55.373,369.129-53.877s-.994,44.391,28.031,72.807,88.461,38.953,88.461,38.953l7.279-12.379s-69.166-17.836-88.824-38.223-22.248-76.309-22.248-76.309l-53.949,6.625-5.205-42.119Z" transform="translate(17784.539 22549.08)" fill="#01686d" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NOBLE_CRYSTAL_TAY_HO_WORLDHOTELS_RESIDENCES" 
  onClick={() => handleSvgClick("NOBLE CRYSTAL TAY HO WORLDHOTELS RESIDENCES")}
  data-name="NOBLE CRYSTAL TAY HO WORLDHOTELS RESIDENCES" d="M-17223.256-22444.627l3.477,24.309,28.578-4.863,85.127-12.77,59.822-10.2-2.049-25.682-9.08-8.59-157.041,24.053Z" transform="translate(17783.787 22527.557)" fill="#0082bf" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NOBLE_PALACE_TAY_HO_-_PHÂN_KHU_THE_RIVER_MANSION" 
  onClick={() => handleSvgClick("NOBLE PALACE TAY HO - PHÂN KHU THE RIVER MANSION")}
  data-name="NOBLE PALACE TAY HO - PHÂN KHU THE RIVER MANSION" d="M-17219.844-22437.234l2.186,13.742,7.607,5.4,160.48-25.521,4.172-4.662-1.717-16.2Z" transform="translate(17784.539 22549.08)" fill="#0065cd" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="CENTER_PARK" 
  onClick={() => handleSvgClick("CENTER PARK")}
  data-name="CENTER PARK" d="M-17296.742-22272.732l6.553,25.846-8.01,3.277-4.941-28.191-68.594,9.988,1.457,16.746-65.162,4.732s-34.947-11.65-34.947,20.021,36.768,20.75,36.768,20.75l70.258-8.373,2.184,12.742,68.074-8.01-3.639-28.758,12.012-3.641,8.77,29.773,90.977-29.773-27.3-64.8Z" transform="translate(17784.539 22549.08)" fill="#fbd4d2" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="CENTER_PARK_2" 
  onClick={() => handleSvgClick("CENTER PARK 2")}
  data-name="CENTER PARK 2" d="M-30.016,15c2.445-9.106,2.281-18.641,6.94-24.737,4.089-5.353,13.071-7.5,13.071-7.5L30.542-.027l58.64,37.94,54.844,18.93s34.678,6.81,24.68,32.227-38.762.947-38.762.947L54.588,56.053-28.349,54.86S-34.783,32.75-30.016,15Z" transform="translate(607.254 414.711) rotate(157)" fill="#b5cc81" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="BIỆT_THỰ_KHU_B" 
  onClick={() => handleSvgClick("BIỆT THỰ KHU B")}
  data-name="BIỆT THỰ KHU B" d="M-10.825-13.663l46.064.765L43.672,0,23.611,245.987l-51.329-3.43Z" transform="translate(633.49 484.672) rotate(94)" fill="#ffd67e" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <rect id="BIỆT_THỰ_KHU_A" 
  onClick={() => handleSvgClick("BIỆT THỰ KHU A")}
  data-name="BIỆT THỰ KHU A" width="35.118" height="202.211" transform="translate(351.977 609.008) rotate(-82)" fill="#8c9345" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="BIỆT_THỰ_KHU_A-2" 
  onClick={() => handleSvgClick("BIỆT THỰ KHU A")}
  data-name="BIỆT THỰ KHU A" d="M0,0H18.068l.912,31.592,15.4.012.742,55.92H0Z" transform="translate(151.99 584.504) rotate(-82)" fill="#8c9345" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NHÀ_Ở_HỖN_HỢP" 
  onClick={() => handleSvgClick("NHÀ Ở HỖN HỢP")}
  data-name="NHÀ Ở HỖN HỢP" d="M-17121.512-21939.621l-90.283-13.824-7.982,3.051-4.168,22.5,2.377,7.684,96.395,13.328,7.324-3.447,3.445-23.264Z" transform="translate(17462.953 22513.689)" fill="#dc8e3b" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="PARKLANE" 
  data-name="PARKLANE"
  onClick={() => handleSvgClick("PARKLANE")}
  d="M0,0S-.044-6.347,5.178-6.747,20.888-1.6,20.888-1.6,71.882,13.843,71.783,30.551s-14.7,36.281-14.7,36.281l.4,92.283H0Z" transform="translate(198.629 531.564) rotate(-82)" fill="#1ebab7" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="CIPUTRA_TOWER" 
  onClick={() => handleSvgClick("CIPUTRA TOWER")}
  data-name="CIPUTRA TOWER" d="M-12.225-16.057l23.562,2.111L22.517.8,18.872,32.693l-41.842-6.37Z" transform="translate(283.707 452.514) rotate(-89)" fill="#00686d" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="SUNSHINE_EMPIRE"
  onClick={() => handleSvgClick("SUNSHINE EMPIRE")}
   data-name="SUNSHINE EMPIRE" d="M-17689-22043.418c7.465,12.441,15.74,17.295,43.129,21.564s57.516,4.119,65.342-34.3-4.787-76.354-23.863-92.525-46.631-17.209-74.24,8.633c-12.148,11.371-16.926,34.906-18.27,50.7C-17698.57-22069.758-17693.184-22050.385-17689-22043.418Z" transform="translate(17780.811 22542.934)" fill="#66cb01" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="THE_LINK_CIPUTRA" 
  onClick={() => handleSvgClick("THE LINK CIPUTRA")}
  data-name="THE LINK CIPUTRA" d="M-18.2,19.247A186.641,186.641,0,0,1,35.888-2.1c3.052-.662,10-1.793,10-1.793l-.53,36.982,42.5,1.529.576-36.731s5.323,1.3,8.168,2.127c36.418,10.54,68.424,34.408,68.424,34.408l-23.643,24.4S104.5,41.179,67.23,36.918-6.9,41.988-6.9,41.988Z" transform="translate(209.131 426.936) rotate(-105)" fill="#f37976" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <rect id="SUNSHINE_GOLDEN_RIVER"
    onClick={() => handleSvgClick("SUNSHINE GOLDEN RIVER")}
   data-name="SUNSHINE GOLDEN RIVER" width="34.971" height="50.252" transform="translate(793.5 41.781) rotate(-7)" fill="#b96b95" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <rect id="SUNSHINE_GOLDEN_RIVER-2" 
  onClick={() => handleSvgClick("SUNSHINE GOLDEN RIVER")}
  data-name="SUNSHINE GOLDEN RIVER" width="98.488" height="33.483" transform="translate(836.123 36.523) rotate(-9)" fill="#b96b95" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <rect id="LẠC_HỒNG_WESTLAKE" 
  onClick={() => handleSvgClick("LẠC HỒNG WESTLAKE")}
  data-name="LẠC HỒNG WESTLAKE" width="27.195" height="29.808" transform="translate(949.607 14.965) rotate(-8)" fill="#d3a0a4" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="SUNSHINE_RIVERSIDE" 
  onClick={() => handleSvgClick("SUNSHINE RIVERSIDE")}
  data-name="SUNSHINE RIVERSIDE" d="M-16773.508-22545.936l4.869,35.756-54.844,6.678,3.23,21.326s148.646-22.182,151.492-22.537,6.4-4.621,3.2-8.535-20.271-36.65-42.682-38.074S-16768.639-22547.8-16773.508-22545.936Z" transform="translate(17774.811 22552.08)" fill="#af384e" stroke="#fffefb" stroke-width="1" opacity="0.6"/>
  <path id="TM01" 
  data-name="TM01"
  onClick={() => handleSvgClick("TM01")}
  d="M-16701.613-22445.885s1.936,34.756,13.354,40.787,42,11.848,42,11.848,21.754-37.912,13.57-51.482S-16701.613-22445.885-16701.613-22445.885Z" transform="translate(17784.539 22549.08)" fill="#f37976" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="GIA_BY_KITA" 
  onClick={() => handleSvgClick("GIA BY KITA")}
  data-name="GIA BY KITA" d="M-16813.443-22383.32l2.758,20.766,111.395-17.838-2.912-20.021,2.912-6.553-10.557-83.727-274.117,44.047,15.652,107.391,37.5,27.3,50.6,18.564,25.117,6.189,10.557-3.277,2.549-5.1-31.92-14.066-16.8-130.105,71.082-10.555,1.293,10.555,54.928-8.186-1.723-9.908,28.865-4.309,7.107,37.7,7.107,3.23,2.586,18.74-13.785,3.016-11.418,23.479-22.186,3.877-12.924-17.447Z" transform="translate(17784.539 22549.08)" fill="#f8e5be" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="BIỆT_THỰ_KHU_D" 
  onClick={() => handleSvgClick("BIỆT THỰ KHU D")}
  data-name="BIỆT THỰ KHU D" d="M-16811.977-22359.211l8.953,66.574,91.008,8.373,12.014-93.92Z" transform="translate(17784.539 22549.08)" fill="#ffe14f" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="UDIC_WESTLAKE" 
  onClick={() => handleSvgClick("UDIC WESTLAKE")}
  data-name="UDIC WESTLAKE" d="M-16694.275-22397.527l-13.721,97.145,29.963,6.16,23.521-95.209Z" transform="translate(17784.539 22549.08)" fill="#ffd67e" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NOBLE_WEST_LAKE_HA_NOI" 
  onClick={() => handleSvgClick("NOBLE WEST LAKE HA NOI")}
  data-name="NOBLE WEST LAKE HA NOI" d="M18162.117,22983.34c-22.055-1.781-85.8-16.631-85.8-16.631s-31.666-5.1-41.133-20.75-23.664-50.969-23.664-50.969,8.371,6.283,11.285,6.191c4.176-.139,4.6-6.242,9.83-2.551,8.283,5.85,7.279,25.486,17.109,22.205s13.471-19.291,23.3-17.105,3.479,20.1,17.838,22.205c7.418,1.084,9.893-4.322,11.076-9.727,1.1-5.055,1.078-10.107,2.895-9.854,41.334,5.785,77.033,7.76,85.4,11.762s-2.543,51.385-5.094,59.875c-1.549,5.16-1.58,6.68-6.311,6.68C18175.791,22984.672,18170.773,22984.037,18162.117,22983.34Zm19.459-68.02c-18.1-2.947-76.727-8.965-76.727-8.965s5.943-12.062,1.316-14.088c-2.129-.928-5.424-.3-8.764.318-3.928.738-7.926,1.471-10.164-.318-3.2-2.561-1.875-9.512-6.189-11.838-2.078-1.119-4.857-.473-7.656.18-3.057.709-6.148,1.418-8.365-.18-7.846-5.67-1.459-11.682-18.928-22.2-3.869-2.822-5.145-1.166-10.557-5.1s-8.006-2.914-8.006-2.914,18.7-26.52,55.328-24.385,129.234,18.928,129.234,18.928-2.48,28.867-9.1,47.512c-5.678,16-4.059,23.68-14.916,23.68A41.317,41.317,0,0,1,18181.576,22915.32Z" transform="translate(-17103.938 -22567.248)" fill="#fc9900" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="NHÀ_Ở_HỖN_HỢP-2" 
  onClick={() => handleSvgClick("NHÀ Ở HỖN HỢP")}
  data-name="NHÀ Ở HỖN HỢP" d="M-16730.627-22096.121l-21.637,159.488-21.252-1.689-2.584,21.971-4.094,28.648-431.6-65.742-7.982,3.051-4.168,22.5,2.377,7.684,470.662,69.111,10.555-3.23,3.662-22.187-9.084-7.037,3.32-25.068,17.361-11.76,1.379-11.07,27.105-194.77-28.395-4.732Z" transform="translate(17782.557 22557.703)" fill="#dc8e3b" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="BIỆT_THỰ_KHU_C" 
  onClick={() => handleSvgClick("BIỆT THỰ KHU C")}
  data-name="BIỆT THỰ KHU C" d="M0,0H184.607L184.4,23.685l-37.943-.55-4.5,59.356-31.539.486,6.308,69.757,33.967.908-1.108,46.123-48.178,1.488.546,19.371-72.607.113s-26.832.268-42.362-16.438-19.757-50.388-19.757-50.388l16.619-2.041.768-20.634,7.948-.976s-3.709,22.279,3.029,39.606c5.316,13.671,20.346,22.7,27.309,25.255,31.271,11.459,69.409,4.624,69.409,4.624L98.515,15.518H0Z" transform="translate(1054.154 424.158) rotate(97)" fill="#8b9345" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <rect id="GRAND_GARDEN_VILLE_TAY_HO-2" 
  onClick={() => handleSvgClick("GRAND GARDEN VILLE TAY HO")}
  data-name="GRAND GARDEN VILLE TAY HO" width="56.398" height="169.162" transform="translate(832.965 500.689) rotate(98)" fill="#01686d" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="GREEN_CENTER_VILLAS" 
  onClick={() => handleSvgClick("GREEN CENTER VILLAS")}
  data-name="GREEN CENTER VILLAS" d="M7.476-.825,120.268-3.006l49.876-44.818,17.878,18.678-79.772,74.61L0,45.869Z" transform="translate(661.203 414.404) rotate(-11)" fill="#9dd0cb" stroke="#fff" stroke-width="1" opacity="0.6"/>
  <path id="GOLF_APARTMENT" 
  onClick={() => handleSvgClick("GOLF APARTMENT")}
  data-name="GOLF APARTMENT" d="M4.967,1.475C8.5-1.229,14.13,0,14.13,0H119.338S130.33,1.7,138.27,8.036,151.1,25.353,151.1,25.353l.08,46.031s-4.2,15.493-9.106,21.546-21.058,10.293-21.058,10.293L12.066,100.165S4.89,98.6,1.874,94.746,0,84.76,0,84.76V10.817S1.435,4.18,4.967,1.475Z" transform="matrix(0.883, -0.469, 0.469, 0.883, 620.441, 299.996)" fill="#d1a0a3" stroke="#fff" stroke-width="1" opacity="0.6"/>
</svg>

)}


 



        </div>
      ) : (
        <p className={styles.noImage}>Chưa có hình ảnh dự án</p>
      )}
  <div className={styles.footer}>
        <Group gap="xs"justify="flex-end">
          <Button
            onClick={handleBack}
            variant="filled"
            style={{
              width: 30,
              height: 30,
              padding: 0,
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "background 0.3s",
              background: "#EEEEEE",
              color: "#294b61",
              border: "1.5px solid #294b61",
            }}
          >
            <IconArrowLeft size={18} color="#294b61" />
          </Button>
        </Group>
      </div>
    </div>
  );
}
