import { Metadata } from "next";
import PhotoCollage from "../../../components/PhotoCollage";

export const metadata: Metadata = {
  title: "Chào mừng Kỷ niệm 20 năm Thành lập Mô hình Việt",
  description:
    "Khung ảnh đại diện 20 năm Vững Bước đặc biệt dành riêng cho các MHVers, hãy cùng Mô hình Việt lan tỏa tinh thần Vững Bước nhé!",
};

export default function DangKyPage() {
  return <PhotoCollage />;
}