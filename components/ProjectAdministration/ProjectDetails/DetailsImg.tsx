import React from "react";
import { Tabs } from "@mantine/core";
import { IconPhoto, IconEdit } from "@tabler/icons-react";
import CreateImg from "./CreateImng";
import EditImg from "../EditImg";

interface DetailsImngProps {
  idItem?: string[];
  projectId: string;
  unitCode: string;
  onSearch: () => Promise<void> | void;
  opened?: boolean;
  onClose?: () => void;
}

/* =======================
   COMPONENT
======================= */
const DetailsImng: React.FC<DetailsImngProps> = ({
  idItem,
  projectId,
  unitCode,
  onSearch,
  onClose,
}) => {
  return (
    <Tabs radius="md" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery" leftSection={<IconPhoto size={15} />}>
          Thêm ảnh
        </Tabs.Tab>

        <Tabs.Tab value="messages" leftSection={<IconEdit size={15} />}>
          Chỉnh sửa ảnh
        </Tabs.Tab>
      </Tabs.List>

      {/* TAB THÊM ẢNH */}
      <Tabs.Panel value="gallery" pt="md">
        <CreateImg
          projectId={projectId}
          unitCode={unitCode}
          idItem={idItem}
          onSearch={onSearch}
          onClose={onClose}
        />
      </Tabs.Panel>

      {/* TAB CHỈNH SỬA */}
      <Tabs.Panel value="messages" pt="md">
       <EditImg 
          projectId={projectId}
          unitCode={unitCode}
          idItem={idItem}
          onSearch={onSearch}
          onClose={onClose}
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default DetailsImng;



