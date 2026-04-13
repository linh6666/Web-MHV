import React from "react";
import { Suspense } from "react";
import { Metadata } from "next";

import PageRegister from "../../../components/FavoriteDetails";
export const metadata: Metadata = {
  title: "Yêu thích - Mô Hình Việt",
  description: "Trang chi tiết yêu thích của người dùng.",
};

export default function yeuthich() {
  
  return (
    <>
      <Suspense fallback={null}>
   <PageRegister/>
      </Suspense>
    
    </>
  );
}