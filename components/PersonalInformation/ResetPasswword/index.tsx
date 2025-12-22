import React, { useState } from "react";
import { 
  Container, 
  Title, 
  Button, 
  PasswordInput 
} from "@mantine/core";
import { NotificationExtension } from "../../../extension/NotificationExtension";
import { modals } from "@mantine/modals";

export default function ProfileInfo() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleConfirmChangePassword = async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      NotificationExtension.Fails("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    // Kiểm tra xem mật khẩu mới và nhập lại có giống nhau không
    if (newPassword !== confirmPassword) {
      NotificationExtension.Fails("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    const response = await fetch("https://www.vietmodel.com.vn/api/v1/users/me/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (response.ok) {
      NotificationExtension.Success("Đổi mật khẩu thành công!");
      // Reset password inputs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const errorData = await response.json();
      NotificationExtension.Fails(errorData.detail || "Không xác định");
    }
  };

  const handleChangePassword = () => {
    // Kiểm tra nếu nút đang bị vô hiệu hóa
    if (!currentPassword || !newPassword || !confirmPassword) {
      NotificationExtension.Fails("Vui lòng nhập đầy đủ thông tin trước khi đổi mật khẩu.");
      return;
    }
    
    modals.openConfirmModal({
      title: "Xác nhận đổi mật khẩu",
      children: "Bạn có chắc chắn muốn đổi mật khẩu không?",
      labels: { confirm: "Có", cancel: "Không" },
      onConfirm: handleConfirmChangePassword, // Gọi hàm khi xác nhận
    });
  };

  // Kiểm tra điều kiện disable
  // const isButtonDisabled = !currentPassword || !newPassword || !confirmPassword;

  return (
    <Container size="sm" py="xl">
      <Title order={2} c="#762f0b" ta="center" mb="lg">
        Đổi mật khẩu tài khoản
      </Title>
      <PasswordInput
        placeholder="Mật khẩu hiện tại"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.currentTarget.value)}
        mb="md"
      />
      <PasswordInput
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(event) => setNewPassword(event.currentTarget.value)}
        mb="md"
      />
      <PasswordInput
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
        mb="md"
      />
      <Button 
        onClick={handleChangePassword} // Mở modal khi nhấn nút
        style={{ 
          backgroundColor: '#ffbe00',  // Màu nền
          color: '#762f0b',              // Màu chữ
        }}
        // disabled={isButtonDisabled} // Điều kiện disable nút
      >
        Đổi mật khẩu
      </Button>
    </Container>
  );
}