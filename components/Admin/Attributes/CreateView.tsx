"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { createUser } from "../../../api/apicreateAttributes";
import { getListRoles } from "../../../api/apigetlistAttributes";
import { getListProjectTemplates } from "../../../api/apiProjectTemplates2";
import { createUser as createTemplateLink } from "../../../api/apiTemplateAttributesLink";

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

interface ProjectTemplate {
  id: string | number;
  template_vi?: string;
  template_name?: string;
}

interface AttributeItem {
  id: string;
  label?: string;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);
  const [templateOptions, setTemplateOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm({
    initialValues: {
      label: "",
      data_type: "",
      parent_attributes_id: "",
      display_label_vi: "",
      project_template_id: "",
    },
    validate: {
      label: isNotEmpty(" không được để trống"),
      data_type: isNotEmpty(" không được để trống"),
      display_label_vi: isNotEmpty("không được để trống"),
      project_template_id: isNotEmpty("không được để trống"),
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        
        // Gọi đồng thời cả API lấy danh sách thuộc tính và danh sách mẫu dự án
        const [resAttributes, resTemplates] = await Promise.all([
          getListRoles({ token, limit: 100 }),
          getListProjectTemplates({ token, limit: 100 }),
        ]);

        const attributesData = (resAttributes?.data as AttributeItem[]) || [];
        setParentOptions(
          attributesData.map((item) => ({
            value: item.id,
            label: item.label || "Không có tên",
          }))
        );

        const templatesData = (resTemplates?.data as ProjectTemplate[]) || [];
        setTemplateOptions(
          templatesData
            .filter((item) => item.template_vi?.trim())
            .map((item) => ({
              value: item.id.toString(),
              label: item.template_vi!,
            }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      const userData = {
        label: values.label,
        data_type: values.data_type,
        parent_attributes_id: values.parent_attributes_id || null,
        display_label_vi: values.display_label_vi,
      };
      const newAttribute = await createUser(userData);

      if (values.project_template_id && newAttribute?.id) {
        await createTemplateLink({
          project_template_id: values.project_template_id,
          attribute_id: newAttribute.id,
          is_required: "false",
        });
      }

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

      <Select
        label="Mẫu dự án"
        placeholder="Chọn mẫu dự án"
        data={templateOptions}
        withAsterisk
        mt="md"
        {...form.getInputProps("project_template_id")}
      />

      <TextInput
        label="Định danh thuộc tính"
        placeholder="Nhập định danh thuộc tính"
        withAsterisk
        mt="md"
        {...form.getInputProps("label")}
      />

      <TextInput
        label="Tên hiển thị "
        placeholder="Nhập tên hiển thị "
        withAsterisk
        mt="md"
        {...form.getInputProps("display_label_vi")}
      />

      <Select
        label="Tên dữ liệu cha"
        placeholder="Chọn tên dữ liệu cha"
        data={parentOptions}
        clearable
        searchable
        mt="md"
        {...form.getInputProps("parent_attributes_id")}
      />

      <Select
        label="Kiểu dữ liệu"
        placeholder="Chọn kiểu dữ liệu"
        data={[
          { value: "bigint", label: "Số nguyên (bigint)" },
          { value: "float", label: "Số thực (float)" },
          { value: "text", label: "Văn bản (text)" },
          { value: "boolean", label: "Đúng/Sai (boolean)" },
          { value: "time", label: "Thời gian (time)" },
        ]}
        withAsterisk
        mt="md"
        {...form.getInputProps("data_type")}
      />

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
