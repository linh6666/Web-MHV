"use client";

import { Box, Group, Text, Anchor, Title } from "@mantine/core";

import classes from "./Footer.module.css";

export default function Footer() {
  return (
   
    <footer className={classes.footer}>
      <div className={classes.footerOverlay} >
         <Box className={classes.company}>
  <Title order={5}>
    Công ty cổ phần tập đoàn Sunshine
  </Title>

  <Text>
    Trụ sở Hà Nội: Tầng 12, tòa nhà Sunshine Center, 16 Phạm Hùng, P. Từ Liêm, TP. Hà Nội, Việt Nam.
  </Text>

  <Group justify="center" gap="md" mt={6}>
    <Text size="sm">Tel: 024 730 52 999</Text>
   
    <Text size="sm">
      Email:{" "}
      <Anchor
        href="mailto:info@sunshinegroup.vn"
        c="inherit"
        underline="hover"
      >
        
info@sunshinegroup.vn
      </Anchor>
    </Text>
  </Group>
</Box>

       
      </div>
    </footer>
  );
}
