// src/app/chi-tiet/InteractiveClient.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ZoningSystem from "../../../../../components/Detail";

export default function InteractiveClient() {
  // Lấy project_id và phase_vi từ URL query
  const searchParams = useSearchParams();
  const project_id = searchParams.get("id");
  const layer7 = searchParams.get("layer7"); // ← layer7 được truyền từ Menu

  if (!project_id) return <div>Không có project_id trong URL</div>;
  if (!layer7) return <div>Không có layer7 trong URL</div>;

  // Truyền cả project_id và layer7 vào component ZoningSystem
  return <ZoningSystem project_id={project_id} layer7={layer7} />;
}
