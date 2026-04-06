"use client";

import { Box, Group, Text, Anchor, Title } from "@mantine/core";

import classes from "./Footer.module.css";

export default function Footer() {
  return (
   
    <footer className={classes.footer}>
      <div className={classes.footerOverlay} >
         <Box className={classes.company}>
  <Title order={5}>
CÔNG TY TNHH MÔ HÌNH VIỆT
  </Title>

  <Text>
  Trụ sở chính tại Việt Nam: Số 751 Nguyễn Khoái, Phường Thanh Trì, Quận Hoàng Mai, Hà Nội, Việt Nam | Mã bưu chính: 10000
  </Text>

  <Group justify="center" gap="md" mt={6}>
    <Text size="sm">Tel: +842436336688</Text>
   
    <Text size="sm">
      Email:{" "}
      <Anchor
        href="mailto:info@monhinhviet.vn"
        c="inherit"
        underline="hover"
      >
        
info@monhinhviet.vn
      </Anchor>
    </Text>
  </Group>
</Box>

       
      </div>
    </footer>
  );
}
