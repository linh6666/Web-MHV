import React from "react";
import { Metadata } from "next";

import PageContact from "../../../components/Contact";
export const metadata: Metadata = {
  title: "Liên hệ Mô Hình Việt",
  description: "Tìm hiểu về Mô Hình Việt",
};

export default function lienhe() {
  
  return (
    <>
      <PageContact/>
    </>
  );
}
