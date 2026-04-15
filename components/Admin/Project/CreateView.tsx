"use client";

import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconChevronDown,
  IconFileCv,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { createUser } from "../../../api/apiCreateProject";
import { getListProjectTemplates1 } from "../../../api/apiProjectTemplates";
import { getListProjectTemplates } from "../../../api/apiProjectTemplates2";

/* ================= TYPES ================= */

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

interface Option {
  value: string;
  label: string;
}

interface ProjectTemplate {
  id: number;
  type_vi: string;
}

interface ProjectTemplateItem {
  id: string;
  template_vi: string;
}

/* ================= COMPONENT ================= */

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [systemOptions, setSystemOptions] = useState<Option[]>([]);
  const [templateOptions, setTemplateOptions] = useState<Option[]>([]);

  const icon = <IconFileCv size={18} stroke={1.5} />;

  /* ================= FORM ================= */

  const form = useForm({
    initialValues: {
      id: "",
      name_vi: "",
      project_type_id: "",
      project_template_id: "",
      address_vi: "",
      investor: "",
      overview_image: null as File | null,
    },

    validate: {
      name_vi: isNotEmpty("Tên dự án không được để trống"),
      project_type_id: isNotEmpty("Loại dự án không được để trống"),
      project_template_id: isNotEmpty("Mẫu dự án không được để trống"),
      address_vi: isNotEmpty("Địa chỉ không được để trống"),
      investor: isNotEmpty("Chủ đầu tư không được để trống"),
      overview_image: isNotEmpty("Hình ảnh không được để trống"),
    },
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";

        // ===== Loại dự án =====
        const resType = await getListProjectTemplates1({ token });
        const typeOptions: Option[] = (resType.data as ProjectTemplate[]).map(
          (item) => ({
            value: item.id.toString(),
            label: item.type_vi || "Không có",
          })
        );
        setSystemOptions(typeOptions);

        // ===== Mẫu dự án =====
        const resTemplate = await getListProjectTemplates({
          token,
          skip: 0,
          limit: 100,
        });

        const templateOptions: Option[] = (
          resTemplate.data as ProjectTemplateItem[]
        ).map((item) => ({
          value: item.id.toString(),
          label: item.template_vi || "Không có",
        }));

        setTemplateOptions(templateOptions);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
        setSystemOptions([]);
        setTemplateOptions([]);
      }
    };

    fetchData();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: typeof form.values) => {
    open();

    try {
      const projectPayload = {
        id: values.id,
        name_vi: values.name_vi,
        project_type_id: values.project_type_id,
        project_template_id: values.project_template_id,
        address_vi: values.address_vi,
        investor: values.investor,
      };

      const formData = new FormData();

      // ✅ project_in
      formData.append("project_in", JSON.stringify(projectPayload));

      // ✅ file + media_metadata (QUAN TRỌNG)
      if (values.overview_image) {
        formData.append("file", values.overview_image);

        formData.append(
          "media_metadata",
          JSON.stringify({
            filename: values.overview_image.name,
            description_vi: "Ảnh đại diện dự án",
            category: "others",
            is_public: true,
          })
        );
      }

      // DEBUG
      console.log("🧾 FormData:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      await createUser(formData);
      await onSearch();
      modals.closeAll();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Lỗi API:", error.response?.data || error.message);
      } else {
        console.error("Lỗi:", error);
      }
    } finally {
      close();
    }
  };

  /* ================= RENDER ================= */

  return (
    <Box
      component="form"
      miw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} zIndex={1000} />

      {/* ===== Mẫu dự án ===== */}
      <Select
        label="Mẫu dự án"
        placeholder="Chọn mẫu dự án"
        data={templateOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("project_template_id")}
      />

      {/* ===== Loại dự án ===== */}
      <Select
        label="Tên loại dự án"
        placeholder="Chọn loại dự án"
        data={systemOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("project_type_id")}
      />

      {/* ===== Tên dự án ===== */}
      <TextInput
        label="Tên dự án"
        placeholder="Nhập tên dự án"
        withAsterisk
        mt="md"
        {...form.getInputProps("name_vi")}
      />

      {/* ===== Địa chỉ ===== */}
      <TextInput
        label="Địa chỉ"
        placeholder="Nhập địa chỉ"
        mt="md"
        {...form.getInputProps("address_vi")}
      />

      {/* ===== Chủ đầu tư ===== */}
      <TextInput
        label="Nhà đầu tư"
        placeholder="Nhập nhà đầu tư"
        mt="md"
        {...form.getInputProps("investor")}
      />

      {/* ===== Hình ảnh ===== */}
      <FileInput
        label="Hình ảnh đại diện"
        placeholder="Chọn file JPG / PNG"
        leftSection={icon}
        mt="md"
        value={form.values.overview_image}
        onChange={(file) =>
          form.setFieldValue("overview_image", file)
        }
      />

      {/* ===== ACTION ===== */}
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
          type="button"
          variant="outline"
          color="black"
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