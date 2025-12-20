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
import { IconPhoneCall, IconShoppingCart, IconUser } from "@tabler/icons-react";
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
        {/* Logo */}
        <Image
          src="/Ciputra.png"
          alt="Logo"
          w={150}
          h={70}
          fit="contain"
        />

        {/* Menu desktop + Icon user */}
        <Box className={classes.links} visibleFrom="sm">
          <Group gap="md" justify="flex-end" className={classes.mainLinks}>
            {mainItems}

            {/* User icon */}
           
          </Group>
        </Box>
        <div  style={{ display: "flex", gap: "20px" }}>

             <div
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
          </div>
          <div
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
          </div>
  
            <UserIcon />

        </div>
       

        {/* Burger mobile */}
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </div>
    </div>
  );
}
