"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,

  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEdituser";
import { getListSystem } from "../../../api/apigetlistsystym";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

interface System {
  id: string;
  name: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [provinceOptions, setProvinceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  // const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      email: "",
      is_active: false,
      // is_superuser: false,
      system_id:"",
      // introducer_id: "",
    },
  });

  const formRef = useRef(form);

  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_USERNAME.replace("{user_id}", id);

      const payload = {
        ...values,
      
       
      };

      const response = await api.patch(url, payload);

      NotificationExtension.Success(
        response?.data?.message || "Cập nhật người dùng thành công!"
      );

      await onSearch();
      modals.closeAll();
    } catch (error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const msg =
      axiosError.response?.data?.message ||
      "Đã xảy ra lỗi khi cập nhật người dùng.";
    NotificationExtension.Fails(msg);
  } else {
    NotificationExtension.Fails("Đã xảy ra lỗi khi cập nhật người dùng.");
  }
}finally {
      close();
    }
  };

  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_USERNAME.replace("{user_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        email: userData.email || "",
        system_id: userData.system_id ||"",
        is_active: userData.is_active || false,
        // is_superuser: userData.is_superuser || false,
        // introducer_id: userData.introducer_id || "",
      });

      // setSelectedProvince(userData.system_id || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Unable to load user information.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

 useEffect(() => {
  const fetchProvinces = async () => {
    try {
      const response = await getListSystem({
        token: localStorage.getItem("token") || "", // hoặc lấy từ context
        skip: 0,
        limit: 100,
      });

      const formatted = response.data.map((item: System) => ({
        value: item.id,
        label: item.name,
      }));
      setProvinceOptions(formatted);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  fetchProvinces();
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

      <TextInput
        label="Email"
        placeholder="Nhập email"
        withAsterisk
        mt="md"
        {...form.getInputProps("email")}
      />
<Select
  label="Vai trò"
  placeholder="Chọn vai trò"
  data={provinceOptions}
  mt="md"
  value={form.values.system_id} // string
  onChange={(value) => form.setFieldValue("system_id", value || "")} // string
/>

      <TextInput
        label="Người giới thiệu"
        placeholder="Nhập người giới thiệu"
        mt="md"
        {...form.getInputProps("introducer_id")}
      />

      <Switch
        label="Kích hoạt tài khoản"
        mt="md"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />

      {/* <Switch
        label="Quyền quản trị"
        mt="md"
        {...form.getInputProps("is_superuser", { type: "checkbox" })}
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
