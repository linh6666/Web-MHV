"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditAttributes";
import { getListRoles } from "../../../api/apigetlistAttributes";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

interface AttributeItem {
  id: string | number;
  label?: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      label: "",
      data_type: "",
      parent_attributes_id: "",
      display_label_vi: "",
    },
    validate: {},
  });

  const formRef = useRef(form);
  formRef.current = form;

  /** Submit cập nhật user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_ATTRIBUTES.replace("{attribute_id}", id);
      await api.put(url, {
        ...values,
        parent_attributes_id: values.parent_attributes_id || null,
      });
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      alert("Đã xảy ra lỗi khi cập nhật thuộc tính.");
    } finally {
      close();
    }
  };

  /** Lấy dữ liệu chi tiết user */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_ATTRIBUTES.replace("{attribute_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        label: userData.label || "",
        data_type: userData.data_type || "",
        parent_attributes_id: userData.parent_attributes_id != null ? userData.parent_attributes_id.toString() : "",
        display_label_vi: userData.display_label_vi || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  /** Lấy danh sách thuộc tính cha */
  const fetchParentAttributes = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await getListRoles({ token, limit: 100 });
      const data = (res?.data as AttributeItem[]) || [];
      setParentOptions(
        data.map((item) => ({
          value: item.id.toString(),
          label: item.label || "Không có tên",
        }))
      );
    } catch (error) {
      console.error("Lỗi khi load danh sách thuộc tính cha:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetail();
    fetchParentAttributes();
  }, [fetchUserDetail, fetchParentAttributes]);

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

      <TextInput
        label="Định danh thuộc tính"
        placeholder="Nhập định danh thuộc tính"
        withAsterisk
        mt="md"
        {...form.getInputProps("label")}
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