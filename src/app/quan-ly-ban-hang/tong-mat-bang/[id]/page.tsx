"use client";

import { useParams, useSearchParams } from "next/navigation";
import Totalarea from "../../../../../components/Totalarea";

export default function QuanLyBanHangPage() {
  const { id } = useParams(); // lấy dynamic route [id]
  const searchParams = useSearchParams(); // lấy query param
  // const router = useRouter();

  const projectId = Array.isArray(id) ? id[0] : id || "";
  const projectName = searchParams.get("name") || "";

  return (
    <Totalarea
      projectId={projectId}
      projectName={projectName}
    />
  );
}