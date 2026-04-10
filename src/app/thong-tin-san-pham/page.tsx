import React from "react";
import { Metadata } from "next";

import PageInteract from "../../../components/InteractBasic";
export const metadata: Metadata = {
  title: "Thông tin sản phẩm",
  description: "Trang thông tin sản phẩm cung cấp chi tiết về các dự án, bao gồm tên, loại, địa chỉ và nhà đầu tư. Người dùng có thể xem thông tin chi tiết về từng dự án để hiểu rõ hơn về sản phẩm và dịch vụ mà công ty cung cấp.",
};

export default function quantrihethong() {
  
  return (
    <>
      <PageInteract/>
    </>
  );
}