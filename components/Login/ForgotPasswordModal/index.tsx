"use client";

import { useState } from "react";
import { Modal, Text, Input, Button, Box } from "@mantine/core";
import { sendPasswordResetEmail } from "../../../api/apiSendEmail";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface ForgotPasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  opened,
  onClose,
}: ForgotPasswordModalProps) {
  const [resetEmail, setResetEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const handleResetPassword = async () => {
    try {
      console.log("Gửi yêu cầu reset mật khẩu cho:", resetEmail);

      await sendPasswordResetEmail(resetEmail);

      // ✅ Thông báo thành công
      NotificationExtension.Success(
        "Yêu cầu khôi phục mật khẩu đã được gửi thành công. Vui lòng kiểm tra email."
      );

      setResetEmail("");
      setEmailFocused(false);
      onClose();
    } catch (error: unknown) {
      console.error("Lỗi khi gửi yêu cầu:", error);

      let msg =
        "Bạn chưa nhập Email hoặc Email không hợp lệ. Vui lòng thử lại.";
      if (error instanceof Error && error.message) {
        msg = error.message;
      }
      NotificationExtension.Fails(msg);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Khôi phục mật khẩu"
      centered
      styles={{
        title: {
          color: "#053c74",
          fontWeight: 700,
          fontSize: "24px", // to như h1 nhưng vẫn hợp lệ HTML
        },
      }}
    >
      <Text size="sm" mb="sm">
        Vui lòng nhập email để khôi phục mật khẩu:
      </Text>

      {/* Ô nhập email */}
      <Box mb="lg" style={{ position: "relative" }}>
        {(emailFocused || resetEmail) && (
          <Text
            size="xs"
            c="dimmed"
            style={{
              position: "absolute",
              top: -10,
              left: 0,
              fontSize: "12px",
            }}
          >
            Nhập email
          </Text>
        )}

        <Input
          type="email"
          placeholder={!emailFocused && !resetEmail ? "Nhập email" : ""}
          variant="unstyled"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.currentTarget.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          styles={{
            input: {
              borderBottom: "1px solid #ccc",
              borderRadius: 0,
              padding: "8px 0",
            },
          }}
          mb="md"
        />
      </Box>

      <Button
        fullWidth
        onClick={handleResetPassword}
        color="#053c74"
        styles={{
          label: {
            color: "#fff",
            fontWeight: 600,
          },
        }}
      >
        Gửi yêu cầu
      </Button>
    </Modal>
  );
}
