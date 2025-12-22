"use client";

import {
  Anchor,
  Box,
  Burger,
  Group,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoneCall, IconShoppingCart } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import classes from "./DoubleHeader.module.css";
import UserIcon from "./User/index";

const mainLinks = [
  { link: "/gioi-thieu", label: "GIỚI THIỆU" },
  { link: "/tuong-tac", label: "MÔ HÌNH TƯƠNG TÁC" },
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname(); // ✅ LẤY PATH HIỆN TẠI

  const mainItems = mainLinks.map((item) => (
    <Anchor
      key={item.label}
      href={item.link}
      className={classes.mainLink}
      data-active={pathname === item.link || undefined}
      onClick={close} // mobile click → đóng menu
    >
      {item.label}
    </Anchor>
  ));

  return (
    <div className={classes.header}>
      <div className={classes.inner}>
        {/* Logo */}
        <Image
          src="/Ciputra.png"
          alt="Logo"
          w={150}
          h={70}
          fit="contain"
          style={{ paddingLeft: 12, paddingRight: 12 }}
        />

        {/* Menu desktop */}
        <Box className={classes.links} visibleFrom="sm">
          <Group gap="md" justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>

        {/* Icons desktop */}
        <Box visibleFrom="sm" style={{ display: "flex", gap: "20px" }}>
          <IconCircle>
            <IconPhoneCall size={17} color="#fff" stroke={1.5} />
          </IconCircle>

          <IconCircle>
            <IconShoppingCart size={17} color="#fff" stroke={1.5} />
          </IconCircle>

          <UserIcon />
        </Box>

        {/* Burger mobile */}
        <Box hiddenFrom="sm" style={{ paddingLeft: 12, paddingRight: 12 }}>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="white"
          />
        </Box>
      </div>

      {/* Menu mobile */}
      {opened && (
        <Box className={classes.mobileMenu} hiddenFrom="sm">
          <Box className={classes.mobileLinks}>{mainItems}</Box>

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
              <IconPhoneCall size={17} color="#fff" stroke={1.5} />
            </IconCircle>

            <IconCircle>
              <IconShoppingCart size={17} color="#fff" stroke={1.5} />
            </IconCircle>

            <UserIcon />
          </Box>
        </Box>
      )}
    </div>
  );
}

/* ============ Icon wrapper dùng chung ============ */
function IconCircle({ children }: { children: React.ReactNode }) {
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
