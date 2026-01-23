"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef, useState } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apicreateRolePermission";
import { getListPermisson } from "../../../api/apigetlistpermission";
import { getListRoles } from "../../../api/getlistrole";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}
interface Role {
  id: number | string;
  name?: string;
}

interface Permission {
  id: number | string;
  code?: string;
  permission_name?: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      role_id: "",
      permission_id: "",
      description_vi: "",
    },
    validate: {
      role_id: (value) => (value ? null : "Vai trò không được để trống"),
      permission_id: (value) => (value ? null : "Mã chức năng không được để trống"),
      description_vi: (value) => (value ? null : "Mô tả không được để trống"),
    },
  });

  const formRef = useRef(form);

  /** 🔹 Submit cập nhật */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_ROLEPERMISSION.replace("{role_permission_id}", id);
      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Đã xảy ra lỗi khi cập nhật dữ liệu.");
    } finally {
      close();
    }
  };

  /** 🔹 Lấy dữ liệu chi tiết bản ghi */
  const fetchDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_ROLEPERMISSION.replace("{role_permission_id}", id);
      const response = await api.get(url);
      const data = response.data;

      formRef.current.setValues({
        role_id: data.role_id || "",
        permission_id: data.permission_id || "",
        description_vi: data.description_vi || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
      alert("Không thể tải thông tin chi tiết.");
    } finally {
      close();
    }
  }, [id, open, close]);

  /** 🔹 Lấy danh sách Vai trò và Mã chức năng */
  const fetchOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";

      const [roles, permissions] = await Promise.all([
        getListRoles({ token }),
        getListPermisson({ token }),
      ]);

      setRoleOptions(
        roles?.data?.map((item: Role) => ({
          value: item.id?.toString(),
          label: item.name || item.name || "Không có tên",
        })) || []
      );

      setPermissionOptions(
        permissions?.data?.map((item: Permission) => ({
          value: item.id?.toString(),
          label: item.code || item.permission_name || "Không có tên",
        })) || []
      );
    } catch (error) {
      console.error("Lỗi khi load danh sách vai trò/quyền:", error);
    }
  }, []);

  useEffect(() => {
    fetchDetail();
    fetchOptions();
  }, [fetchDetail, fetchOptions]);

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

      {/* 🔹 Dropdown Vai trò */}
      <Select
        label="Tên vai trò"
        placeholder="Chọn vai trò"
        data={roleOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("role_id")}
      />

      {/* 🔹 Dropdown Mã chức năng */}
      <Select
        label="Chức năng"
        placeholder="Chọn chức năng"
        data={permissionOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("permission_id")}
      />

      {/* 🔹 Textarea mô tả */}
      <Textarea
        label="Mô tả"
        placeholder="Nhập mô tả"
        autosize
        minRows={3}
        mt="md"
        {...form.getInputProps("description_vi")}
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
