"use client";

import { useSearchParams } from "next/navigation";
import Managent from "../../../../../components/Warehouse";

interface PageProps {
  params: {
    id: string; // dynamic segment = projectId
  };
}

export default function QuanLyBanHangPage({ params }: PageProps) {
  const { id: projectId } = params; // Lấy projectId từ folder [id]
  const searchParams = useSearchParams();
  const target = searchParams.get("target") || undefined;
   const projectName = searchParams.get("name") || undefined; // Lấy target từ query param

  return (
    <>
      {/* Truyền projectId và target vào Managent, không render gì */}
 <Managent projectId={projectId} projectName={projectName} target={target} />
    </>
  );
}
