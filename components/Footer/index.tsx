"use client";

import { useEffect, useState } from "react";
import { Box, Text, Title, Stack } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import classes from "./Footer.module.css";

interface DecodedToken {
  is_superuser?: boolean;
  exp?: number;
  [key: string]: unknown;
}

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) return;
      setIsLoggedIn(true);
      setIsSuperUser(decoded?.is_superuser === true);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  /* ============ Dynamic Max Width Logic (Giống Header) ============ */
  let maxWidth = "1330px";
  if (!isLoggedIn) {
    maxWidth = "1260px";
  } else if (isSuperUser) {
    maxWidth = "1400px";
  }

  return (
    <footer className={classes.footer}>
      <div className={classes.container} style={{ maxWidth }}>
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
      </div>
    </footer>
  );
}
