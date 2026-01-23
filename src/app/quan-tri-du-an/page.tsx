import React from "react";
import { Metadata } from "next";

import  {ProjectManagement} from "../../../components/ProjectAdministration";
export const metadata: Metadata = {
  title: "Quản trị T&T Group",
  description: "Quản trị  về T&T Group",
};

export default function quantrihethong() {
  
  return (
    <>
      <ProjectManagement/>
    </>
  );
}
