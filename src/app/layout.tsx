import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";

import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals"; // ✅ Thêm import ModalsProvider
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { Nunito_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Tập đoàn Ciputra",
  description: "Chào mừng bạn đến với trang web điều khiển mô hình của Ciputra",
};

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      {...mantineHtmlProps}
      className={nunito.variable}
    >
      <body>
        {/* ✅ MantineProvider bọc TẤT CẢ */}
        <MantineProvider>
          {/* ✅ Thêm ModalsProvider bọc Header, main, Footer */}
          <ModalsProvider>
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
