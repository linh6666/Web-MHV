"use client";

import React from "react";
import styles from "./Menu.module.css";
import { Button, Group, Image, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import Sun from "./Sun";
import { IconArrowLeft } from "@tabler/icons-react";

interface MenuProps {
  project_id: string | null;
}

export default function Menu({ project_id }: MenuProps) {
  const router = useRouter();
  // const [active, setActive] = useState(false);

  // 🧠 Tạo sẵn link kèm project_id (nếu có)
  const menuItems = [
   
      { label: "GIỚI THIỆU TỔNG THỂ", link: `/tuong-tac/Ciputra/Gioi-thieu-du-an${project_id ? `?id=${project_id}` : ""}` },
    { label: "DỰ ÁN TIÊU BIÊU", link: `/tuong-tac/Ciputra/Du-an-tieu-bieu${project_id ? `?id=${project_id}` : ""}` },
     { label: "TIỆN ÍCH TIÊU BIÊU", link: `/tuong-tac/Ciputra/Tien-ich${project_id ? `?id=${project_id}` : ""}` } ,
    { label: "HIỆU ỨNG ÁNH SÁNG", link: `/tuong-tac/Ciputra/Hieu-ung-anh-sang${project_id ? `?id=${project_id}` : ""}` },
    { label: "THƯ VIỆN ẢNH", link: `/tuong-tac/Ciputra/Thu-vien-anh${project_id ? `?id=${project_id}` : ""}` },
    { label: "HƯỚNG DẪN SỬ DỤNG", link: `/tuong-tac/Ciputra/Huong-dan-su-dung${project_id ? `?id=${project_id}` : ""}` },
  
  ];


  return (
    <div className={styles.box}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          className={styles.imgea}
        />
      </div>

      {/* Tiêu đề */}
      <div className={styles.title}>
        <h1>MÔ HÌNH TƯƠNG TÁC</h1>
      </div>

      {/* Danh sách nút */}
     <div className={styles.Function}>
  <Stack align="center" className={styles.menuStack}>
    {menuItems.map((item) => (
      <Button
        key={item.link}
        className={styles.menuBtn}
        onClick={() => router.push(item.link)}
        variant="outline"
      >
        {item.label}
      </Button>
    ))}
  </Stack>
</div>

      {/* Footer */}
      <div className={styles.footer}>
        <Group gap="xs">
          <Sun project_id={project_id} />
         <Button
  onClick={() => router.push("/tuong-tac")} // ← Quay về trang /Tuong-tac
  variant="filled"
  style={{
    width: 30,
    height: 30,
    padding: 0,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    transition: "background 0.3s",
    background: "#234374",
    color: "#EEEEEE",
    border: "1.5px solid #EEEEEE",
  }}
>
  <Group gap={0} align="center">
    <IconArrowLeft size={18} color="#EEEEEE" />
  </Group>
</Button>
        </Group>
      </div>
    </div>
  );
}
