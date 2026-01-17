

// src/app/chi-tiet/page.tsx
import React, { Suspense } from "react";
import InteractiveClient from "./InteractiveClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InteractiveClient />
    </Suspense>
  );
}
