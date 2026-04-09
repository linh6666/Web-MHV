"use client";

import { Box, Text, Title, Stack, Container } from "@mantine/core";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="xl" className={classes.container}>
        <Stack gap={4} align="center" className={classes.stack}>
          <Box className={classes.headerRow}>
            <Title order={4} className={classes.companyName}>
              CÔNG TY TNHH MÔ HÌNH VIỆT
            </Title>
            
          </Box>

          <Text size="sm" className={classes.infoText}>
            Hotline: +842436336688 | ĐTDĐ: +84889371188 | Email: info@mohinhviet.com
          </Text>

          <Text size="sm" className={classes.infoText}>
            Trụ sở chính tại Việt Nam: Số 751 Nguyễn Khoái, Phường Thanh Trì, Quận Hoàng Mai, Hà Nội, Việt Nam | Mã bưu chính: 10000
          </Text>

          <Text size="sm" className={classes.infoText}>
            Trụ sở tại Úc: 2B Mercer Rd, Armadale VIC 3143, Australia
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
