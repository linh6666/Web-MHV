
import { Suspense } from "react";
import VideoClient from "../../../../../components/Introducingvideos";

export default function VideoPage() {
  return (
    <Suspense fallback={null}>
      <VideoClient />
    </Suspense>
  );
}
