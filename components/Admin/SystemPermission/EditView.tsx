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
import { useEffect, useState, useCallback, useRef } from "react";

import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditSystemPermission";
import { getListSystem } from "../../../api/apigetlistsystym";
import { getListPermisson } from "../../../api/apigetlistpermission";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}
interface System {
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

  // 🔹 State lưu dropdown options
  const [systemOptions, setSystemOptions] = useState<{ value: string; label: string }[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      system_id: "",
      permission_id: "",
      description_vi: "",
    },
    validate: {
      system_id: (value) => (value ? null : "Mã không được để trống"),
      permission_id: (value) => (value ? null : "Mã không được để trống"),
      description_vi: (value) => (value ? null : "Mô tả không được để trống"),
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_SYSTEMPERMISSION.replace("{system_permission_id}", id);
      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      alert("Đã xảy ra lỗi khi cập nhật người dùng.");
    } finally {
      close();
    }
  };

  /** Lấy dữ liệu chi tiết user */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_SYSTEMPERMISSION.replace("{system_permission_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        system_id: userData.system_id || "",
        permission_id: userData.permission_id || "",
        description_vi: userData.description_vi || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  /** Load dropdown options */
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await getListSystem({ token: localStorage.getItem("accessToken") || "" });
        const data = res?.data || [];
        setSystemOptions(
          data.map((item: System) => ({
            value: item.id?.toString(),
            label: item.name ||  "Không có tên",
          }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách hệ thống:", error);
      }
    };

    const fetchPermissions = async () => {
      try {
        const res = await getListPermisson({ token: localStorage.getItem("accessToken") || "" });
        const data = res?.data || [];
        setPermissionOptions(
          data.map((item: Permission) => ({
            value: item.id?.toString(),
            label: item.code || item.permission_name || "Không có tên",
          }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách quyền:", error);
      }
    };

    fetchUserDetail();
    fetchSystems();
    fetchPermissions();
  }, [fetchUserDetail]);

  return (
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* 🔹 Dropdown chọn hệ thống */}
      <Select
        label="Tên vai trò"
        placeholder="Chọn tên vai trò"
        data={systemOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("system_id")}
      />

      {/* 🔹 Dropdown chọn quyền */}
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

      {/* 🔹 Nút hành động */}
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
