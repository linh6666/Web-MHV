import React from "react";
import { Metadata } from "next";

import PageLogin from "../../../components/Login";
export const metadata: Metadata = {
  title: "Đăng nhập vào hệ thống điều khiển",
  description: "Hãy đăng nhập tài khoản của bạn để trải nghiệm dịch vụ tốt nhất.",
};

export default function Interactive() {
  
  return (
    <>
      <PageLogin />
    </>
  );
}
