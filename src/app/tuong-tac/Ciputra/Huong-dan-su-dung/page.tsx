import React from "react";
import { Metadata } from "next";
import { Suspense } from "react";

import  PdfViewer from "../../../../../components/InstructionsModel3";
export const metadata: Metadata = {
  title: "Hướng dẫn Mô hình Millennia City",
  description: "Hướng dẫn về Mô hình Millennia City",
};

export default function Viewer() {
  
  return (
   <Suspense fallback={<div>Đang tải...</div>}>
      <PdfViewer />
    </Suspense>
  );
}