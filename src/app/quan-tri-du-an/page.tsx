import React from "react";
import { Metadata } from "next";

import  {ProjectManagement} from "../../../components/ProjectAdministration";
export const metadata: Metadata = {
  title: "Quản trị Dự Án",
  description: "Quản trị Dự Án",
};

export default function quantrihethong() {
  
  return (
    <>
      <ProjectManagement/>
    </>
  );
}
