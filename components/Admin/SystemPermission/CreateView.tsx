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

import { createUser } from "../../../api/apicreateSystemPermission";
import { getListSystem } from "../../../api/apigetlistsystym";
import { getListPermisson } from "../../../api/apigetlistpermission";

interface CreateViewProps {
  onSearch: () => Promise<void>;
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


const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  // 🔹 State lưu dữ liệu dropdown
  const [systemOptions, setSystemOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [permissionOptions, setPermissionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // 🔹 Form setup
  const form = useForm({
    initialValues: {
      system_id: "",
      permission_id: "",
      description_vi: "",
    },
    validate: {
      system_id: isNotEmpty("Tên hệ thống không được để trống"),
      permission_id: isNotEmpty("Mã chức năng không được để trống"),
      description_vi: isNotEmpty("Mô tả không được để trống"),
    },
  });

  // 🔹 Submit form
  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      const userData = {
        system_id: values.system_id,
        permission_id: values.permission_id,
        description_vi: values.description_vi,
      };
      await createUser(userData);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      alert("Đã xảy ra lỗi khi tạo người dùng.");
    } finally {
      close();
    }
  };

  // 🔹 Lấy danh sách hệ thống & quyền
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await getListSystem({
          token: localStorage.getItem("accessToken") || "",
        });
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
        const res = await getListPermisson({
          token: localStorage.getItem("accessToken") || "",
        });
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

    fetchSystems();
    fetchPermissions();
  }, []);

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

      {/* 🔹 Mô tả */}
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
