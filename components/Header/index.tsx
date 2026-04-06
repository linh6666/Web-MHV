"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Burger,
  Group,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoneCall } from "@tabler/icons-react";
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
  const [isSuperUser, setIsSuperUser] = useState(false);

  /* ============ Check token ============ */
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setIsSuperUser(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Check token expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        setIsSuperUser(false);
        return;
      }

      setIsSuperUser(decoded?.is_superuser === true);
    } catch {
      setIsSuperUser(false);
    }
  }, []);

  /* ============ Filter menu ============ */
  const publicLabels = [
    "GIỚI THIỆU",
    "MÔ HÌNH TƯƠNG TÁC",
  ];

  const visibleLinks = mainLinks.filter((link) => {
    if (!isSuperUser) {
      return publicLabels.includes(link.label);
    }
    return true;
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

  return (
    <div className={classes.header}>
      <div className={classes.inner}>
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
        <Box className={classes.links} visibleFrom="sm">
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
          visibleFrom="sm"
          style={{ display: "flex", gap: "20px" }}
        >
           <Link href="/lien-he">
             <IconCircle>
               <IconPhoneCall
                 size={17}
                 color="#fff"
                 stroke={1.5}
            />
          </IconCircle>
          </Link>

          <UserIcon />
        </Box>

        {/* ============ Burger mobile ============ */}
        <Box
          hiddenFrom="sm"
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
          hiddenFrom="sm"
        >
          <Box className={classes.mobileLinks}>
            {mainItems}
          </Box>

          <Box
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            <IconCircle>
              <IconPhoneCall
                size={17}
                color="#fff"
                stroke={1.5}
              />
            </IconCircle>

            <UserIcon />
          </Box>
        </Box>
      )}
    </div>
  );
}

/* ============ Icon wrapper dùng chung ============ */
function IconCircle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      style={{
        border: "1px solid #fff",
        borderRadius: "50%",
        width: 26,
        height: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}