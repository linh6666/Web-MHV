"use client";

import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  MultiSelect,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { isNotEmpty, matchesField, useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { createUser } from "../../../api/apicreateuser";
import { getListProvinces } from "../../../api/apigetlistaddress";
import { getWardsByProvince } from "../../../api/apigetlistProvinces";

// Định nghĩa kiểu cho giá trị của form
interface FormValues {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
  is_superuser: boolean;
  phone: string;
  province_id: string[]; // Mảng chuỗi cho tỉnh
  ward_id: string[]; // Mảng chuỗi cho phường
  // introducer_id: string;
}

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

interface Province {
  code: string;
  full_name_vi: string;
}

interface Ward {
  code: string;
  full_name_vi: string;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [provinceOptions, setProvinceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [wardOptions, setWardOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_active: false,
      is_superuser: false,
      phone: "",
      province_id: [],
      ward_id: [],
      // introducer_id: "",
    },
    validate: {
      email: isNotEmpty("Email không được để trống"),
      full_name: isNotEmpty("Họ và tên không được để trống"),
      phone: isNotEmpty("Số điện thoại không được để trống"),
      password: isNotEmpty("Mật khẩu không được để trống"),
      confirm_password: matchesField("password", "Mật khẩu không khớp"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    open();
    try {
      const userData = {
        email: values.email,
        is_active: values.is_active,
        is_superuser: values.is_superuser,
        full_name: values.full_name,
        phone: values.phone,
        province_id: values.province_id[0] || "",
        ward_id: values.ward_id[0] || "",
        // introducer_id: values.introducer_id,
        password: values.password,
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

  // Lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data: Province[] = await getListProvinces();
        const formatted = data.map((item) => ({
          value: item.code,
          label: item.full_name_vi,
        }));
        setProvinceOptions(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách phường/xã theo tỉnh đã chọn
  useEffect(() => {
    if (selectedProvince) {
      const fetchWards = async () => {
        try {
          const data: Ward[] = await getWardsByProvince(selectedProvince);
          const formatted = data.map((item) => ({
            value: item.code,
            label: item.full_name_vi,
          }));
          setWardOptions(formatted);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách phường/xã:", error);
          setWardOptions([]);
        }
      };
      fetchWards();
    } else {
      setWardOptions([]);
    }
  }, [selectedProvince]);

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

      <TextInput
        label="Họ và tên"
        placeholder="Nhập họ và tên"
        withAsterisk
        mt="md"
        {...form.getInputProps("full_name")}
      />

      <TextInput
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        withAsterisk
        mt="md"
        {...form.getInputProps("phone")}
      />

      {/* ✅ MultiSelect chỉ cho phép chọn 1 tỉnh */}
      <MultiSelect
  label="Tỉnh"
  placeholder="Chọn tỉnh"
  data={provinceOptions}
  mt="md"
  value={form.values.province_id.slice(-1)} // chỉ hiển thị 1 lựa chọn
  onChange={(value) => {
    const limited = value.slice(-1); // chỉ giữ lại 1 lựa chọn
    setSelectedProvince(limited[0] || null);
    form.setFieldValue("province_id", limited);
    form.setFieldValue("ward_id", []); // reset phường khi đổi tỉnh
  }}
/>

<MultiSelect
  label="Phường"
  placeholder="Chọn phường"
  data={wardOptions}
  mt="md"
  value={form.values.ward_id.slice(-1)} // chỉ hiển thị 1 lựa chọn
  onChange={(value) => {
    const limited = value.slice(-1);
    form.setFieldValue("ward_id", limited); // chỉ lưu giá trị đầu tiên
  }}
/>

      <PasswordInput
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        withAsterisk
        mt="md"
        {...form.getInputProps("password")}
      />

      <PasswordInput
        label="Nhập lại mật khẩu"
        placeholder="Xác nhận mật khẩu"
        withAsterisk
        mt="md"
        {...form.getInputProps("confirm_password")}
      />

      <Checkbox
        label="Hoạt động"
        mt="md"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />

      <Checkbox
        label="Quản trị viên"
        mt="xs"
        {...form.getInputProps("is_superuser", { type: "checkbox" })}
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

export default CreateView;
