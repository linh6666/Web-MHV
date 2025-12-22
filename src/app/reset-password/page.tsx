
import React from "react";
import PageContact from "../../../components/ResetPassword";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Lấy lại mật khẩu - T&T Group",
  description: "lấy lại mật khẩu với email đã đăng ký",
};


export default function ResePassword() {
  return (
    <>
     <Suspense fallback={<div>Đang tải...</div>}>

     <PageContact />
     </Suspense>
      
    </>
  );
}
