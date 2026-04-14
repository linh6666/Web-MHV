"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DetailBuilding from "../../../../../components/DetailBuilding";
import { Loader, Center } from "@mantine/core";

function DetailPageContent() {
  const searchParams = useSearchParams();
  const project_id = searchParams.get("id");
  const layer2 = searchParams.get("layer2");
  const layer3 = searchParams.get("layer3");

  if (!project_id || !layer2 || !layer3) {
    return (
      <Center style={{ height: "100vh", background: "#12223B", color: "white" }}>
        Thiếu thông tin truy cập chi tiết tòa nhà.
      </Center>
    );
  }

  return (
    <DetailBuilding 
      project_id={project_id} 
      layer2={layer2} 
      layer3={layer3}
    />
  );
}

export default function InteractiveClient() {
  return (
    <Suspense fallback={
      <Center style={{ height: "100vh", background: "#12223B" }}>
        <Loader color="orange" size="xl" />
      </Center>
    }>
      <DetailPageContent />
    </Suspense>
  );
}
