"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ZoningSystem from "../../../../../components/UtilityDetails";

export default function InteractiveClient() {
  const searchParams = useSearchParams();

  // Lấy project_id và building_type_vi từ URL
  const project_id = searchParams.get("id");
  const building_type_vi = searchParams.get("building_type_vi");

  if (!project_id) return <div>Không có project_id trong URL</div>;

  return <ZoningSystem project_id={project_id} initialBuildingType={building_type_vi} />;
}
