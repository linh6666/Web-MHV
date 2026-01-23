"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { createUser } from "../../../api/apicreateRolePermission";
import { getListPermisson } from "../../../api/apigetlistpermission";
import { getListRoles } from "../../../api/getlistrole";

interface CreateViewProps {
  onSearch: () => Promise<void>;
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

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm({
    initialValues: {
      role_id: "",
      permission_id: "",
      description_vi: "",
    },
    validate: {
      role_id: isNotEmpty("Vai trò không được để trống"),
      permission_id: isNotEmpty("Quyền không được để trống"),
      description_vi: isNotEmpty("Mô tả không được để trống"),
    },
  });

  // 🔹 Gọi API lấy danh sách vai trò
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getListRoles({ token: localStorage.getItem("accessToken") || "" });
        const data = res?.data || [];
        setRoleOptions(
          data.map((item: Role) => ({
            value: item.id?.toString(),
            label: item.name || item.name || "Không có tên",
          }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách vai trò:", error);
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

    fetchRoles();
    fetchPermissions();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      const payload = {
        role_id: values.role_id,
        permission_id: values.permission_id,
        description_vi: values.description_vi,
      };
      await createUser(payload);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi tạo mới:", error);
      alert("Đã xảy ra lỗi khi tạo mới bản ghi.");
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

      {/* 🔹 Dropdown chọn vai trò */}
      <Select
        label="Tên vai trò"
        placeholder="Chọn tên vai trò"
        data={roleOptions}
        rightSection={<IconChevronDown size={16} />}
        mt="md"
        withAsterisk
        {...form.getInputProps("role_id")}
      />

      {/* 🔹 Dropdown chọn quyền */}
      <Select
        label="Chức năng"
        placeholder="Chọn Chức năng"
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

export default CreateView;
