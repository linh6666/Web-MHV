
"use client";

import {
  Box,
  Button,
  PasswordInput,
  Space,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../libray/axios";
import { AxiosError } from "axios";
import { NotificationExtension } from "../../extension/NotificationExtension";
import style from "./ResetPassword.module.css";

interface ResetPasswordForm {
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
}

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ URL
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    initialValues: {
      new_password: "",
    },
    validate: {
      new_password: (value) =>
        value && value.length >= 5 && value.length <= 100
          ? null
          : "Mật khẩu phải chứa từ 5 đến 100 kí tự",
    },
  });

  const [clickPassword, setClickPassword] = useState(false);
  const floatingPassword =
    clickPassword || form.values.new_password.length > 0 || undefined;

  const [loading, setLoading] = useState(false);

  // Nếu đã login, redirect về trang chủ
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      NotificationExtension.Fails("Token không hợp lệ!");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<ResetPasswordResponse>(
        "/api/v1/reset-password",
        {
          token,
          new_password: values.new_password,
        }
      );

      console.log("✅ Reset thành công:", response.data);
      NotificationExtension.Success("Đổi mật khẩu thành công!");
      router.push("/dang-nhap");
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      console.error("❌ Lỗi reset:", err.response?.data || err.message);
      const msg = err.response?.data?.detail || "Đổi mật khẩu thất bại!";
      NotificationExtension.Fails(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className={style.registerPage}
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Box className={style.container}>
        {/* Header */}
        <Box className={style.topNavBar}>
          <Box className={style.navBarContainer}>
            <Box className={style.navBarTitle}>
              🔒 Đặt lại mật khẩu
                <Text size="sm" c="dimmed" ta="center" mb="lg">
         Nhập mật khẩu mới cho tài khoản của bạn
       </Text>
            </Box>
          
          </Box>
        </Box>

        <Space h="xl" />

        {/* Form */}
        <Box className={style.loginForm}>
          <Box className={style.formGroup}>
            <div className={style.inputBox}>
              <PasswordInput
                label="Mật khẩu"
                labelProps={{ "data-floating": floatingPassword }}
                withAsterisk
                mt="md"
                classNames={{
                  root: style.root,
                  input: style.input,
                  label: style.label,
                }}
                onFocus={() => setClickPassword(true)}
                onBlur={() => setClickPassword(false)}
                {...form.getInputProps("new_password")}
              />
            </div>
          </Box>
        </Box>

        <Button
          className={style.btn}
          type="submit"
          loading={loading}
        >
          Đặt lại mật khẩu
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
