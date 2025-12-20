"use client";

import { Box, Group, Text, Anchor, Title } from "@mantine/core";

import classes from "./Footer.module.css";

export default function Footer() {
  return (
   
    <footer className={classes.footer}>
      <div className={classes.footerOverlay} >
         <Box className={classes.company}>
  <Title order={5}>
    Công ty TNHH Phát triển Khu Đô thị Nam Thăng Long – Trung Tâm Thông Tin Và Tiếp
    Thị Ciputra Hà Nội.
  </Title>

  <Text>
    Địa chỉ văn phòng: Khu đô thị Nam Thăng Long, Xuân Đỉnh, Bắc Từ Liêm, Hà Nội
  </Text>

  <Group justify="center" gap="md" mt={6}>
    <Text size="sm">Tel: 024-3 7576268</Text>
    <Text size="sm">Fax: 024-3 7576282</Text>
    <Text size="sm">
      Email:{" "}
      <Anchor
        href="mailto:enquiry@ciputrahanoi.com"
        c="inherit"
        underline="hover"
      >
        enquiry@ciputrahanoi.com
      </Anchor>
    </Text>
  </Group>
</Box>

       
      </div>
    </footer>
  );
}
