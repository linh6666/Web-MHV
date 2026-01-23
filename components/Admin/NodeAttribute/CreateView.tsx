"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  // Textarea,
  // TextInput,
} from "@mantine/core";
import { isNotEmpty,  useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
// import { createProjectTemplate } from "../../../api/apiNodeAttribute"; 
// import { getListRoles } from "../../../api/apigetlistAttributes";// 🔁 sửa đường dẫn nếu cần
// import { getListProject } from "../../../api/apigetlistProject";
// import { Select } from "antd";

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      project_id: "",
      attribute_id: "",
      parent_node_attributes_id: "",
      values:"",
    
     
 
    },
    validate: {
      project_id: isNotEmpty("không được để trống"),
      attribute_id: isNotEmpty("không được để trống"),
      parent_node_attributes_id: isNotEmpty("không được để trống"),
      values: isNotEmpty("không được để trống"),

    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      const userData = {
        project_id: values.project_id,
           attribute_id: values.attribute_id, 
          parent_node_attributes_id: values.parent_node_attributes_id,
          values:values.values,
      
       
      };
      await (userData);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      alert("Đã xảy ra lỗi khi tạo người dùng.");
    } finally {
      close();
    }
  };

  return (
    <Box
      component="form"
      miw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {/* <Select
        label="Thuộc tính"
        placeholder="Chọn thuộc tính"
        data={attributeOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("attribute_id")}
      />
            <Select
        label="Thuộc tính"
        placeholder="Chọn thuộc tính"
        data={attributeOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("")}
      /> */}
    
      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          color="#3598dc"
          loading={visible}
          leftSection={<IconCheck size={18} />}
        >
          Lưu
        </Button>
        <Button
          variant="outline"
          color="black"
          type="button"
          loading={visible}
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Đóng
        </Button>
      </Group>
    </Box>
  );
};

export default CreateView;
