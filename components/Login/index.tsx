"use client";

import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { loginUser } from "../../api/apiLogin";
import ForgotPasswordModal from "./ForgotPasswordModal/index";
import { NotificationExtension } from "../../extension/NotificationExtension";
import { useState, useEffect } from "react";
import style from "./login.module.css";

interface Register {
  username: string;
  password: string;
}

const Login = () => {
  // ✅ Khai báo toàn bộ hooks trước
  const form = useForm<Register>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      password: (value) =>
        value && value.length >= 5 && value.length <= 100
          ? null
          : "Mật khẩu phải chứa từ 5 đến 100 kí tự",
      username: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
    },
  });

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickPassword, setClickPassword] = useState(false);
  const [clickRePassword, setClickRePassword] = useState(false);

  // ✅ useEffect kiểm tra token, tránh vi phạm quy tắc hook
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        window.location.href = "/tuong-tac";
      }
    }
  }, []);

  // ✅ Theo dõi lỗi
  useEffect(() => {
    if (error) {
      console.log("❌ Current error state:", error);
    }
  }, [error]);

  // Floating labels logic
  const floatingPassword =
    clickPassword || form.values.password.length > 0 || undefined;
  const floatingEmail =
    clickRePassword || form.values.username.length > 0 || undefined;

  // ✅ Xử lý submit form
  const handleSubmit = async (values: Register) => {
  setLoading(true);
  setError(null);

  try {
    const data = await loginUser(values.username, values.password);
    console.log("Login success:", data);

    if (!data.access_token) {
      throw new Error("Không nhận được token hợp lệ");
    }

    // ✅ Lưu token vào localStorage
    localStorage.setItem("access_token", data.access_token);

    NotificationExtension.Success("Đăng nhập thành công!");
    window.location.href = "/";
  } catch (err: unknown) {
    console.error("Login error:", err);

    if (err instanceof Error) {
      setError(err.message);
      NotificationExtension.Fails(err.message || "Đăng nhập thất bại");
    } else {
      setError("Đăng nhập thất bại");
      NotificationExtension.Fails("Đăng nhập thất bại");
    }
  } finally {
    setLoading(false);
  }
};

  // ✅ Giao diện chính
  return (
    <>
      <ForgotPasswordModal opened={opened} onClose={() => setOpened(false)} />
      <Box
        className={style.registerPage}
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Box className={style.container}>
          {/* Header */}
 <Box className={style.topNavBar}>
  <Box className={style.navBarContainer}>
    <Box className={style.navBarTitle}>Đăng nhập vào Hệ thống</Box>
    
    {/* Text hướng dẫn bên dưới tiêu đề */}
    <Text className={style.navBarSubtitle}>
    Hãy đăng nhập để truy cập các tính năng xem dự án. Nếu chưa có tài khoản, bạn hãy đăng ký ở link dưới.
    </Text>
  </Box>
</Box>



          <Space h="xl" />

          {/* Form */}
          <Box className={style.loginForm}>
            <Box className={style.formGroup}>
              <div className={style.inputBox}>
                <TextInput
                  label="Email"
                  labelProps={{ "data-floating": floatingEmail }}
                  withAsterisk
                  mt="md"
                  type="email"
                  classNames={{
                    root: style.root,
                    input: style.input,
                    label: style.label,
                  }}
                  onFocus={() => setClickRePassword(true)}
                  onBlur={() => setClickRePassword(false)}
                  {...form.getInputProps("username")}
                />
              </div>

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
                  {...form.getInputProps("password")}
                />
              </div>
            </Box>
          </Box>

          <Group justify="space-between" mb="md">
            <Anchor size="sm"></Anchor>
            <Anchor
              size="sm"
              style={{ cursor: "pointer" }}
              onClick={() => setOpened(true)}
            >
              Quên mật khẩu?
            </Anchor>
          </Group>

          {error && (
            <Text c="red" size="sm" ta="center" mb="sm">
              {error}
            </Text>
          )}

          <Button
            className={style.btn}
            type="submit"
            loading={loading}
            fullWidth
          >
            Đăng nhập
          </Button>

          <Text style={{ textAlign: "center", marginTop: "16px" }}>
            Bạn chưa có tài khoản?{" "}
            <Anchor href="/dang-ky"  c="red">
              Đăng ký ngay
            </Anchor>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Login;