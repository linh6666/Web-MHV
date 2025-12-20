"use client";

import { useState } from "react";
import {
  Anchor,
  Box,
  Burger,
  Group,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoneCall, IconShoppingCart } from "@tabler/icons-react";
import classes from "./DoubleHeader.module.css";
import UserIcon from "./User/index";

const mainLinks = [
  { link: "#", label: "GIỚI THIỆU" },
  { link: "#", label: "MÔ HÌNH TƯƠNG TÁC" },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(0);

  const mainItems = mainLinks.map((item, index) => (
    <Anchor
      key={item.label}
      href={item.link}
      className={classes.mainLink}
      data-active={index === active || undefined}
      onClick={(e) => {
        e.preventDefault();
        setActive(index);
      }}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <div className={classes.header}>
      <div className={classes.inner}>
        {/* Logo với padding trái/phải trực tiếp */}
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
            <IconPhoneCall size={17} color="#fff" stroke={1.5} />
          </Box>
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
            <IconShoppingCart size={17} color="#fff" stroke={1.5} />
          </Box>
          <UserIcon />
        </Box>

        {/* Burger mobile với padding trái/phải */}
        <Box hiddenFrom="sm" style={{ paddingLeft: 12, paddingRight: 12 }}>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </Box>
      </div>

      {/* Menu mobile hiển thị khi Burger mở */}
      {opened && (
        <Box className={classes.mobileMenu} hiddenFrom="sm">
          <Box className={classes.mobileLinks}>{mainItems}</Box>

          {/* Icons mobile */}
          <Box style={{ display: "flex", gap: "20px", marginTop: "20px", paddingLeft: 12, paddingRight: 12 }}>
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
              <IconPhoneCall size={17} color="#fff" stroke={1.5} />
            </Box>
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
              <IconShoppingCart size={17} color="#fff" stroke={1.5} />
            </Box>
            <UserIcon />
          </Box>
        </Box>
      )}
    </div>
  );
}
