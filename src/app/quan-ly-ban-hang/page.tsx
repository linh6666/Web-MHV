import React from "react";
import { Metadata } from "next";

import NotFoundTitle from "../../../components/AdminSell";
export const metadata: Metadata = {
  title: "Quản lý bán hàng T&T Group",
  description: "Quản lý bán hàng  về T&T Group",
};

export default function quanlybanhang() {
  
  return (
    <>
      <NotFoundTitle/>
    </>
  );
}
