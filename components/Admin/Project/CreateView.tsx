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

/* ================= COMPONENT ================= */

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [systemOptions, setSystemOptions] = useState<Option[]>([]);

  const icon = <IconFileCv size={18} stroke={1.5} />;

  /* ================= FORM ================= */

  const form = useForm<{
    id: string;
    name_vi: string;
    project_template_id: string;
    address_vi: string;
    investor: string;
    overview_image: File | null;
  }>({
    initialValues: {
      id: "",
      name_vi: "",
      project_template_id: "",
      address_vi: "",
      investor: "",
      overview_image: null,
    },

    validate: {
      name_vi: isNotEmpty("Tên dự án không được để trống"),
      project_template_id: isNotEmpty("Loại dự án không được để trống"),
      address_vi: isNotEmpty("Địa chỉ không được để trống"),
      investor: isNotEmpty("Chủ đầu tư không được để trống"),
      overview_image: isNotEmpty("Hình ảnh không được để trống"),
    },
  });

  /* ================= FETCH SELECT DATA ================= */

  useEffect(() => {
    const fetchProjectTemplates = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const res = await getListProjectTemplates1({ token });

        const options: Option[] = (res.data as ProjectTemplate[]).map(
          (item) => ({
            value: item.id.toString(),
            label: item.type_vi || "Không có",
          })
        );

        setSystemOptions(options);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại dự án:", error);
        setSystemOptions([]);
      }
    };

    fetchProjectTemplates();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: typeof form.values) => {
    open();

    try {
      const projectPayload = {
        id: values.id,
        name_vi: values.name_vi,
        project_template_id: values.project_template_id,
        address_vi: values.address_vi,
        investor: values.investor,
      };

      const formData = new FormData();
      formData.append("project_in", JSON.stringify(projectPayload));

      if (values.overview_image) {
        formData.append("file", values.overview_image);
      }

      // Debug
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
      } else if (error instanceof Error) {
        console.error("Lỗi:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
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
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/* ===== Loại dự án ===== */}
      <Select
        label="Tên loại dự án"
        placeholder="Chọn loại dự án"
        data={systemOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("project_template_id")}
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
        leftSectionPointerEvents="none"
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

