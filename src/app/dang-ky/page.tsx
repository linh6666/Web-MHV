import React from "react";
import { Metadata } from "next";
import styles from "../page.module.css";
import PageRegister from "../../../components/Register";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản vào hệ thống điều khiển",
  description: "Hãy đăng ký tài khoản của bạn để trải nghiệm hệ thống tốt nhất.",
};

export default function dangky() {
  return (
    <div className={styles.page}>
      <PageRegister/>
    </div>
  );
}