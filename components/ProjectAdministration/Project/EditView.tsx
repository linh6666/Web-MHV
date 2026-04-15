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
import { useEffect, useCallback, useRef, useState } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditproject";
import { AxiosError } from "axios";
import { getListProjectTemplates1 } from "../../../api/apiProjectTemplates";
import { NotificationExtension } from "../../../extension/NotificationExtension";

/* ================= TYPES ================= */

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

interface ProjectTemplate {
  id: number;
  type_vi: string;
}

/* ================= COMPONENT ================= */

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const [templateOptions, setTemplateOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      name: "",
      address: "",
      investor: "",
      overview_image: null,
    },
  });

  const formRef = useRef(form);

  /* ================= HELPER ================= */

  const getImageUrl = (url: string) => {
    if (!url) return "";
    return url.replace("http://", "https://"); // fix mixed content
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_PROJECTS.replace("{project_id}", id);

      const projectPayload = {
        name_vi: values.name,
        address_vi: values.address,
        investor: values.investor,
      };

      const formData = new FormData();

      // ✅ project_in
      formData.append("project_in", JSON.stringify(projectPayload));

      // ✅ nếu chọn ảnh mới → phải có media_metadata
      if (values.overview_image instanceof File) {
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

      await api.put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await onSearch();
      modals.closeAll();

      NotificationExtension.Success("Cập nhật dự án thành công!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Lỗi khi cập nhật project:",
          error.response?.data || error.message
        );
        NotificationExtension.Fails(
          error.response?.data?.message || "Lỗi khi cập nhật dự án!"
        );
      } else {
        console.error("Lỗi khi cập nhật project:", error);
        NotificationExtension.Fails("Đã xảy ra lỗi khi cập nhật dự án.");
      }
    } finally {
      close();
    }
  };

  /* ================= FETCH TYPE ================= */

  const fetchProjectTemplates = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        NotificationExtension.Fails("Không tìm thấy access_token");
        return;
      }

      const res = await getListProjectTemplates1({
        token,
        skip: 0,
        limit: 100,
      });

      const options = (res.data as ProjectTemplate[]).map((item) => ({
        value: item.id.toString(),
        label: item.type_vi,
      }));

      setTemplateOptions(options);
    } catch (error) {
      console.error("Lỗi khi lấy loại dự án:", error);
      NotificationExtension.Fails("Không thể tải danh sách loại dự án.");
    }
  }, []);

  /* ================= FETCH DETAIL ================= */

  const fetchUserDetail = useCallback(async () => {
    if (!id) return;

    open();
    try {
      let url = API_ROUTE.UPDATE_PROJECTS.replace("{project_id}", id);
      url += url.includes("?") ? "&lang=vi" : "?lang=vi";

      const response = await api.get(url);
      const data = response.data;

      formRef.current.setValues({
        name: data.name || "",
        address: data.address || "",
        investor: data.investor || "",
        overview_image: data.overview_image || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu project:", error);
      NotificationExtension.Fails("Không thể tải thông tin dự án.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchUserDetail();
    fetchProjectTemplates();
  }, [fetchUserDetail, fetchProjectTemplates]);

  /* ================= RENDER ================= */

  return (
    <Box
      component="form"
      miw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} zIndex={1000} />

      {/* ===== Tên dự án ===== */}
      <TextInput
        label="Tên dự án"
        placeholder="Nhập Tên dự án"
        withAsterisk
        mt="md"
        {...form.getInputProps("name")}
      />

      {/* ===== Địa chỉ ===== */}
      <TextInput
        label="Địa chỉ"
        placeholder="Nhập địa chỉ"
        mt="md"
        {...form.getInputProps("address")}
      />

      {/* ===== Chủ đầu tư ===== */}
      <TextInput
        label="Chủ đầu tư"
        placeholder="Nhập tên chủ đầu tư"
        mt="md"
        {...form.getInputProps("investor")}
      />

      {/* ===== Upload ảnh ===== */}
      <FileInput
        label="Hình ảnh đại diện"
        placeholder="Chọn file ảnh JPG/PNG"
        mt="md"
        {...form.getInputProps("overview_image")}
      />

      {/* ===== Preview ảnh ===== */}
      {form.values.overview_image &&
        typeof form.values.overview_image === "string" && (
          <Image
            src={getImageUrl(form.values.overview_image)}
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
          variant="outline"
          color="black"
          type="button"
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

