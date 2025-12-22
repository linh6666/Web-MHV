import React from "react";
import { Metadata } from "next";

import PageAbout from "../../../components/PegaAbout";
export const metadata: Metadata = {
  title: "Giới thiệu Dự án ",
  description: "Tìm hiểu về Dự án ",
};

export default function Interactive() {
  
  return (
    <>
      <PageAbout />
    </>
  );
}
