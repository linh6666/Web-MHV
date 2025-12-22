"use client";

import { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import Link from "next/link";
import useAuth from "../../../hook/useAuth";
import ProfileModal from "./Profile";
import ButtonsCollection from "../../../common/ButtonsCollection";

export default function LoginButton() {
  const { user, isLoggedIn, error } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Fix: tránh lỗi hydration + kiểm tra localStorage token
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isLoggedIn && user ? (
        <Link
          href="/Tai-khoan"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
         <ButtonsCollection background hover>
  <Text
    component="span"
    w="100%"
    fw="700"
    c="#053c74"
    truncate="end"
  >
    {user.full_name || "Tài khoản"}
  </Text>
</ButtonsCollection>
        </Link>
      ) : null}

      {/* 🔹 Modal hiển thị thông tin tài khoản */}
      <ProfileModal
        opened={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* 🔹 Hiển thị lỗi nếu có */}
      {error && (
        <div style={{ color: "red", fontSize: 12, marginTop: 8 }}>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
