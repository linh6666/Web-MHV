"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditPermissions";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      description_vi: "",
      // description_en: "",
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_PERMISSION.replace("{Permission_id}", id);
      await api.put(url, values);
      await onSearch();
      NotificationExtension.Success("Cập nhật thành công!");
      modals.closeAll();
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật user:", error);

      const err = error as ApiError;
      const message = err?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật người dùng.";
      NotificationExtension.Fails(message);
    } finally {
      close();
    }
  };

  /** Lấy dữ liệu chi tiết user */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_PERMISSION.replace("{Permission_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        description_vi: userData.description_vi || "",
        // description_en: userData.description_en || "",
      });
    } catch (error: unknown) {
      console.error("Lỗi khi lấy dữ liệu user:", error);

      const err = error as ApiError;
      const message = err?.response?.data?.message || "Không thể tải thông tin người dùng.";
      NotificationExtension.Fails(message);

      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

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

         <Textarea
  label="Mô tả chức năng"
  placeholder="Nhập mô tả chức năng"
  autosize
  minRows={3}
  mt="md"
  value={form.values.description_vi}
  onChange={(event) => {
    const value = event.currentTarget.value;

    form.setFieldValue(
      "description_vi",
      value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value
    );
  }}
/>
      {/* <Textarea
        label="Mô tả(Tiếng Anh)"
        placeholder="Nhập mô tả (Tiếng Anh)"
        autosize
        minRows={3}
        mt="md"
        {...form.getInputProps("description_en")}
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

export default EditView;
