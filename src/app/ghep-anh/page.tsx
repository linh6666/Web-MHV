import { Metadata } from "next";
import PhotoCollage from "../../../components/PhotoCollage";

export const metadata: Metadata = {
  title: "20 năm - Ghép phông ảnh kỷ niệm",
  description:
    "Tham gia ngay hoạt động ghép phông ảnh kỷ niệm 20 năm và tạo dấu ấn của riêng bạn.",
};

export default function DangKyPage() {
  return <PhotoCollage />;
}