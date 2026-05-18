"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Burger,
  Group,
  Image,
  Tooltip,
  Popover,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconHeart, IconPhoneCall } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import classes from "./DoubleHeader.module.css";
import UserIcon from "./User/index";
import FavoriteHoverContent from "./favourite";

/* ============ Menu config ============ */
const mainLinks = [
  { link: "/Gioi-thieu", label: "GIỚI THIỆU" },
  { link: "/tuong-tac", label: "MÔ HÌNH TƯƠNG TÁC" },
  { link: "/thong-tin-san-pham", label: "THÔNG TIN SẢN PHẨM" },
  { link: "/quan-ly-ban-hang", label: "QUẢN LÝ BÁN HÀNG" },
  { link: "/quan-tri-du-an", label: "QUẢN TRỊ DỰ ÁN" },
  { link: "/quan-ly-he-thong", label: "QUẢN TRỊ HỆ THỐNG" },
];

/* ============ Token interface ============ */
interface DecodedToken {
  is_superuser?: boolean;
  is_active?: boolean;
  system_name?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [favoriteOpened, setFavoriteOpened] = useState(false);
  const pathname = usePathname();

  /* ============ Auth state ============ */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [systemName, setSystemName] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  /* ============ Check token ============ */
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setIsLoggedIn(false);
      setIsSuperUser(false);
      setSystemName(null);
      setIsActive(false);
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
        setSystemName(null);
        setIsActive(false);
        return;
      }

      setIsLoggedIn(true);
      setIsSuperUser(decoded?.is_superuser === true);
      setSystemName(decoded?.system_name || null);
      setIsActive(decoded?.is_active === true);
    } catch {
      setIsLoggedIn(false);
      setIsSuperUser(false);
      setSystemName(null);
      setIsActive(false);
    }
  }, []);

  /* ============ Filter menu ============ */
  const visibleLinks = mainLinks.filter((link) => {
    if (!isLoggedIn) {
      // ❌ Chưa đăng nhập -> chỉ hiển thị các mục public
      return [
        "GIỚI THIỆU",
        "MÔ HÌNH TƯƠNG TÁC",
      ].includes(link.label);
    }

    if (isSuperUser || systemName === "System Admin" || systemName === "Admin") {
      // ✅ Admin -> hiển thị tất cả ngoại trừ MÔ HÌNH TƯƠNG TÁC và GIỚI THIỆU
      return !["MÔ HÌNH TƯƠNG TÁC", "GIỚI THIỆU"].includes(link.label);
    }

    // Phân quyền dựa trên system_name (Chức vụ)
    const role = systemName?.toLowerCase();

    switch (role) {
      case "director":
      case "sale director":
      case "sale admin":
        // Giám đốc kinh doanh và Quản trị bán hàng xem được hầu hết trừ Quản trị hệ thống
        return [
          "GIỚI THIỆU",
          "THÔNG TIN SẢN PHẨM",
          "QUẢN LÝ BÁN HÀNG",
          "QUẢN TRỊ DỰ ÁN",
        ].includes(link.label);

      case "sale manager":
      case "sale staff":
      case "salesperson":
        // Trưởng phòng và nhân viên bán hàng
        return [
          "GIỚI THIỆU",
          "THÔNG TIN SẢN PHẨM",
          "QUẢN LÝ BÁN HÀNG",
        ].includes(link.label);

      case "marketing manager":
        return [
          "GIỚI THIỆU",
          "THÔNG TIN SẢN PHẨM",
        ].includes(link.label);

      case "accountant":
        return [
          "GIỚI THIỆU",
          "MÔ HÌNH TƯƠNG TÁC",
          "QUẢN LÝ BÁN HÀNG",
        ].includes(link.label);

      case "null":
      case "member":
      default:
        // Thành viên hoặc các chức vụ khác mặc định (bao gồm cả "Null" từ token)
        return [

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
  let maxWidth = "1300px";
  if (!isLoggedIn) {
    maxWidth = "1200px";
  } else if (
    isSuperUser ||
    systemName === "System Admin" ||
    systemName === "Admin" ||
    systemName === "Director" ||
    systemName === "Sale Director" ||
    systemName === "Sale Admin"
  ) {
    maxWidth = "1450px";
  }

  return (
    <div className={classes.header}>
      <div className={classes.inner} style={{ maxWidth }}>
        {/* ============ Logo ============ */}
        <Image
          src="/logo1.png"
          alt="Logo"
          w={250}
          h={60}
          
          // fit="contain"
          // style={{ paddingLeft: 12, paddingRight: 12 }}
        />

        {/* ============ Menu desktop ============ */}
        <Box className={classes.links} visibleFrom="lg">
          <Group
            className={classes.mainLinks}
            justify="center"
          >
            {mainItems}
          </Group>
        </Box>

        {/* ============ Icons desktop ============ */}
        <Box
          visibleFrom="lg"
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
                 size={14}
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
            <IconBell size={14} color="#fff" stroke={1.5} />
          </IconCircle>
          </Tooltip>
          <Popover
            width={320}
            position="bottom"
            withArrow
            shadow="md"
            opened={favoriteOpened}
            onChange={setFavoriteOpened}
          >
            <Popover.Target>
              <Tooltip 
                label="Yêu thích" 
                position="bottom"
                bg="#f1eeeeff"
                c="#294b61"
                withArrow
              >
                <IconCircle onClick={() => setFavoriteOpened((o) => !o)}>
                  <IconHeart size={14} color="#fff" stroke={1.5} />
                </IconCircle>
              </Tooltip>
            </Popover.Target>

            <Popover.Dropdown>
              <FavoriteHoverContent />
            </Popover.Dropdown>
          </Popover>

          <UserIcon />
        </Box>

        {/* ============ Burger mobile ============ */}
        <Box
          hiddenFrom="lg"
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
          hiddenFrom="lg"
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

            <Popover
              width={320}
              position="bottom"
              withArrow
              shadow="md"
              opened={favoriteOpened}
              onChange={setFavoriteOpened}
            >
              <Popover.Target>
                <Tooltip 
                  label="Yêu thích" 
                  position="bottom"
                  bg="#f1eeeeff"
                  c="#294b61"
                  withArrow
                >
                  <IconCircle onClick={() => setFavoriteOpened((o) => !o)}>
                    <IconHeart size={17} color="#fff" stroke={1.5} />
                  </IconCircle>
                </Tooltip>
              </Popover.Target>

              <Popover.Dropdown>
                <FavoriteHoverContent />
              </Popover.Dropdown>
            </Popover>

            <UserIcon />
          </Group>
        </Box>
      )}
    </div>
  );
}

/* ============ Icon wrapper dùng chung ============ */
const IconCircle = React.forwardRef<HTMLDivElement, { children: React.ReactNode } & React.ComponentPropsWithoutRef<"div">>(
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