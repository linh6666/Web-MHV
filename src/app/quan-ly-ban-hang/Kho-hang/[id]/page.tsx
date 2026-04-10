"use client";

import { useSearchParams } from "next/navigation";
import Managent from "../../../../../components/Warehouse1";

interface PageProps {
  params: {
    id: string; // dynamic segment = projectId
  };
}

export default function QuanLyBanHangPage({ params }: PageProps) {
  const { id: projectId } = params; // Lấy projectId từ folder [id]
  const searchParams = useSearchParams();

  const target = searchParams.get("target") || undefined; // Lấy target từ query param
 const projectName = searchParams.get("name") || undefined; // Lấy projectName từ query param "name"

  return (
    <>
      {/* Truyền projectId, projectName và target vào Managent */}
      <Managent projectId={projectId} projectName={projectName} target={target} />
    </>
  );
}

