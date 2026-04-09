"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Burger,
  Group,
  Image,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconHeart, IconPhoneCall } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import classes from "./DoubleHeader.module.css";
import UserIcon from "./User/index";

/* ============ Menu config ============ */
const mainLinks = [
  { link: "/Gioi-thieu", label: "GIỚI THIỆU" },
  { link: "/tuong-tac", label: "MÔ HÌNH TƯƠNG TÁC" },
  { link: "/quan-tri-du-an", label: "QUẢN TRỊ DỰ ÁN" },
  { link: "/quan-ly-he-thong", label: "QUẢN TRỊ HỆ THỐNG" },
   { link: "/thong-tin-san-pham", label: "THÔNG TIN SẢN PHẨM" },
  { link: "/quan-ly-ban-hang", label: "QUẢN LÝ BÁN HÀNG" },
  
];

/* ============ Token interface ============ */
interface DecodedToken {
  is_superuser?: boolean;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  /* ============ Auth state ============ */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  /* ============ Check token ============ */
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setIsLoggedIn(false);
      setIsSuperUser(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Check token expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setIsSuperUser(false);
        return;
      }

      setIsLoggedIn(true);
      setIsSuperUser(decoded?.is_superuser === true);
    } catch {
      setIsLoggedIn(false);
      setIsSuperUser(false);
    }
  }, []);

  /* ============ Filter menu ============ */
  const visibleLinks = mainLinks.filter((link) => {
    if (!isLoggedIn) {
      // ❌ Chưa đăng nhập → chỉ hiển thị các mục public
      return [
        "GIỚI THIỆU",
        "MÔ HÌNH TƯƠNG TÁC",
      ].includes(link.label);
    } else if (isSuperUser) {
      // ✅ Admin → hiển thị tất cả
      return true;
    } else {
      // 👤 User thường
      return [
        "GIỚI THIỆU",
        "MÔ HÌNH TƯƠNG TÁC",
        "QUẢN LÝ BÁN HÀNG",
        "THÔNG TIN SẢN PHẨM", 
      ].includes(link.label);
    }
  });

  /* ============ Render menu ============ */
  const mainItems = visibleLinks.map((item) => (
    <Link
      key={item.label}
      href={item.link}
      className={classes.mainLink}
      data-active={
        pathname.startsWith(item.link) ? true : undefined
      }
      onClick={close}
    >
      {item.label}
    </Link>
  ));

  /* ============ Max Width Logic ============ */
  let maxWidth = "1330px";
  if (!isLoggedIn) {
    maxWidth = "1260px";
  } else if (isSuperUser) {
    maxWidth = "1400px";
  }

  return (
    <div className={classes.header}>
      <div className={classes.inner} style={{ maxWidth }}>
        {/* ============ Logo ============ */}
        <Image
          src="/logo.png"
          alt="Logo"
          w={280}
          h={70}
          
          // fit="contain"
          // style={{ paddingLeft: 12, paddingRight: 12 }}
        />

        {/* ============ Menu desktop ============ */}
        <Box className={classes.links} visibleFrom="md">
          <Group
            gap="md"
            justify="flex-end"
            className={classes.mainLinks}
          >
            {mainItems}
          </Group>
        </Box>

        {/* ============ Icons desktop ============ */}
        <Box
          visibleFrom="md"
          style={{ display: "flex", gap: "20px" }}
        >
           <Link href="/lien-he">
            <Tooltip 
              label="Liên hệ" 
              position="bottom"
              bg="#f1eeeeff"
              c="#294b61"
              withArrow
            >
             <IconCircle>
               <IconPhoneCall
                 size={17}
                 color="#fff"
                 stroke={1.5}
               />
             </IconCircle>
            </Tooltip>
          </Link>
  <Tooltip 
              label="Thông báo" 
              position="bottom"
              bg="#f1eeeeff"
              c="#294b61"
              withArrow
            >
          <IconCircle>
            <IconBell size={17} color="#fff" stroke={1.5} />
          </IconCircle>
          </Tooltip>
<Tooltip 
              label="Yêu thích" 
              position="bottom"
              bg="#f1eeeeff"
              c="#294b61"
              withArrow
            >
          <IconCircle>
            <IconHeart size={17} color="#fff" stroke={1.5} />
          </IconCircle>
          </Tooltip>

          <UserIcon />
        </Box>

        {/* ============ Burger mobile ============ */}
        <Box
          hiddenFrom="md"
          style={{ paddingLeft: 12, paddingRight: 12 }}
        >
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="white"
          />
        </Box>
      </div>

      {/* ============ Menu mobile ============ */}
      {opened && (
        <Box
          className={classes.mobileMenu}
          hiddenFrom="md"
        >
          <Box className={classes.mobileLinks}>
            {mainItems}
          </Box>

          <Group className={classes.mobileMenuIcons}>
            <Link href="/lien-he">
              <IconCircle>
                <IconPhoneCall size={17} color="#fff" stroke={1.5} />
              </IconCircle>
            </Link>

            <IconCircle>
              <IconBell size={17} color="#fff" stroke={1.5} />
            </IconCircle>

            <IconCircle>
              <IconHeart size={17} color="#fff" stroke={1.5} />
            </IconCircle>

            <UserIcon />
          </Group>
        </Box>
      )}
    </div>
  );
}

/* ============ Icon wrapper dùng chung ============ */
const IconCircle = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children, ...others }, ref) => {
    return (
      <Box
        ref={ref}
        {...others}
        style={{
          border: "1px solid #fff",
          borderRadius: "50%",
          width: 26,
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {children}
      </Box>
    );
  }
);

IconCircle.displayName = "IconCircle";