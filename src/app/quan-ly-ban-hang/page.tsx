import React from "react";
import { Metadata } from "next";

import NotFoundTitle from "../../../components/AdminSell";
export const metadata: Metadata = {
  title: "Quản lý bán hàng",
  description: "Quản lý bán hàng",
};

export default function quanlybanhang() {
  
  return (
    <>
      <NotFoundTitle/>
    </>
  );
}
