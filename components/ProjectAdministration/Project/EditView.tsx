"use client";

import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditproject";
import { AxiosError } from "axios";
interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      name: "",
      template: "",
      address: "",
      investor: "",
      overview_image: null,
      rank: "",
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật project */
 const handleSubmit = async (values: CreateUserPayload) => {
  open();
  try {
    const url = API_ROUTE.UPDATE_PROJECTS.replace("{project_id}", id);

    // Tạo payload JSON cho project_in
    const projectPayload = {
      name_vi: values.name,
      template: values.template,
      address_vi: values.address,
      investor: values.investor,
      rank: values.rank,
    };

    const formData = new FormData();
    formData.append("project_in", JSON.stringify(projectPayload));

    // Nếu có file ảnh mới
    if (values.overview_image instanceof File) {
      formData.append("file", values.overview_image);
    }

    // Debug log
    console.log("🧾 FormData update nội dung:");
    formData.forEach((value, key) => {
      console.log("→", key, value);
    });

    await api.put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await onSearch();
    modals.closeAll();
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Lỗi khi cập nhật project:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Lỗi khi cập nhật project:", error.message);
    } else {
      console.error("Lỗi khi cập nhật project:", error);
    }
    alert("Đã xảy ra lỗi khi cập nhật dự án.");
  } finally {
    close();
  }
};

  /** Lấy dữ liệu chi tiết project */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      let url = API_ROUTE.UPDATE_PROJECTS.replace("{project_id}", id);
      url += url.includes("?") ? "&lang=vi" : "?lang=vi";

      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        name: userData.name || "",
        rank: userData.rank || "",
        template: userData.template || "",
        address: userData.address || "",
        investor: userData.investor || "",
        overview_image: userData.overview_image || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu project:", error);
      alert("Không thể tải thông tin dự án.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  return (
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <TextInput label="Tên dự án" placeholder="Nhập Tên dự án" withAsterisk mt="md" {...form.getInputProps("name")} />
      <TextInput label="Cấp bậc" placeholder="Nhập Cấp bậc" withAsterisk mt="md" {...form.getInputProps("rank")} />
      <TextInput label="Loại dự án" placeholder="Nhập loại dự án" withAsterisk mt="md" {...form.getInputProps("template")} />
      <TextInput label="Địa chỉ" placeholder="Nhập địa chỉ" mt="md" {...form.getInputProps("address")} />
      <TextInput label="Chủ đầu tư" placeholder="Nhập tên chủ đầu tư" mt="md" {...form.getInputProps("investor")} />

      <FileInput
        label="Hình ảnh đại diện"
        placeholder="Chọn file ảnh JPG/PNG"
        mt="md"
        {...form.getInputProps("overview_image")}
      />

      {form.values.overview_image && typeof form.values.overview_image === "string" && (
        <Image
          src={form.values.overview_image}
          alt="Preview"
          width={200}
          height={150}
          style={{
            marginTop: "10px",
            maxWidth: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      )}

      <Group justify="flex-end" mt="lg">
        <Button type="submit" color="#3598dc" loading={visible} leftSection={<IconCheck size={18} />}>
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

export default EditView;

