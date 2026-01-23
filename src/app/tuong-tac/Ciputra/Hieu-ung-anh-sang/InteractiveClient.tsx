// src/app/Phan-khu/InteractiveClient.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ZoningSystem from "../../../../../components/EffectsLighting";

export default function InteractiveClient() {
  // Lấy project_id từ URL query (?id=...)
  const searchParams = useSearchParams();
  const project_id = searchParams.get("id");

  if (!project_id) return <div>Không có project_id trong URL</div>;

  return <ZoningSystem project_id={project_id} />;
}
