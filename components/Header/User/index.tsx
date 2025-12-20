"use client";

import Link from "next/link";
import { IconUser } from "@tabler/icons-react";

export default function UserIcon() {
  return (
    <Link href="/dang-nhap" style={{ textDecoration: "none" }}>
      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "50%",
          width: 26,
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <IconUser size={17} color="#fff" stroke={1.5} />
      </div>
    </Link>
  );
}
