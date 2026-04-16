import React from "react";
import { Metadata } from "next";
import { Suspense } from "react";

import  PdfViewer from "../../../../../components/InstructionsModel3";
export const metadata: Metadata = {
  title: "Hướng dẫn Mô hình Ciputra",
  description: "Hướng dẫn về Mô hình Ciputra",
};

export default function Viewer() {
  
  return (
   <Suspense fallback={<div>Đang tải...</div>}>
      <PdfViewer />
    </Suspense>
  );
}