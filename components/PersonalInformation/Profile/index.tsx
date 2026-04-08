"use client";

import {
  Avatar,
  Group,
  Paper,
  Stack,
  Text,
  Divider,
  Container,
  Title,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { getListProvinces } from "../../../api/apigetlistaddress";
import { getWardsByProvince } from "../../../api/apigetlistProvinces";
import { Editme } from "../../../api/apiEditme";
import { NotificationExtension } from "../../../extension/NotificationExtension";
import { modals } from "@mantine/modals";

interface User {
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  is_superuser: boolean;
  province_id: string;
  ward_id: string;
  introducer_id: string;
  creation_time: string;
  detal_address: string;
  last_login: string;
}

interface ProfileInfoProps {
  user: User;
}

interface Province {
  code: string;
  full_name_vi: string;
}

interface Ward {
  code: string;
  full_name_vi: string;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [provinceOptions, setProvinceOptions] = useState<{ value: string; label: string }[]>([]);
  const [wardOptions, setWardOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Hàm lưu
  const handleSave = async () => {
    modals.openConfirmModal({
      title: "Xác nhận lưu thay đổi",
      children: "Bạn có chắc muốn lưu các thay đổi này không?",
      confirmProps: {
        style: {
          backgroundColor: "#053c74",
          color: "#fff",
        },
      },
      labels: { confirm: "Có", cancel: "Không" },
      onConfirm: async () => {
        setLoading(true);
        try {
          const payload = {
            full_name: editedUser.full_name,
            phone: editedUser.phone,
            province_id: editedUser.province_id,
            ward_id: editedUser.ward_id,
            introducer_id: editedUser.introducer_id,
            detal_address: editedUser.detal_address,
          };
          const result = await Editme(payload);
          console.log("Cập nhật thành công:", result);

          NotificationExtension.Success("Cập nhật thông tin thành công!");

          setTimeout(() => {
            window.location.reload();
          }, 10);

          setEditedUser(result);
          setIsEditing(false);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Lỗi khi cập nhật:", error.message);
            NotificationExtension.Fails(`Cập nhật thất bại: ${error.message}`);
          } else {
            console.error("Lỗi không xác định:", error);
            NotificationExtension.Fails("Cập nhật thất bại: Có lỗi xảy ra.");
          }
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 🔴 Hàm hủy chỉnh sửa
  const handleCancel = () => {
    modals.openConfirmModal({
      title: "Xác nhận",
      children: "Bạn có chắc muốn hủy các thay đổi không?",
      labels: { confirm: "Có", cancel: "Không" },
      confirmProps: {
        style: {
          backgroundColor: "#053c74",
          color: "#fff",
        },
      },
      onConfirm: () => {
        setEditedUser({ ...user });
        setSelectedProvince(user.province_id);
        setIsEditing(false);
        NotificationExtension.Info("Đã hủy các thay đổi");
      },
    });
  };

  // Lấy danh sách tỉnh
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

  // Lấy danh sách phường/xã khi chọn tỉnh
  useEffect(() => {
    const provinceToLoad = selectedProvince || user.province_id;

    if (!provinceToLoad) return;

    const fetchWards = async () => {
      try {
        const data: Ward[] = await getWardsByProvince(provinceToLoad);
        const formatted = data.map((item) => ({
          value: item.code,
          label: item.full_name_vi,
        }));

        setWardOptions(formatted);

        if (editedUser.ward_id) {
          setWardOptions((prev) => {
            const exists = prev.some((w) => w.value === editedUser.ward_id);
            if (!exists) {
              return [...prev, { value: editedUser.ward_id, label: "..." }];
            }
            return prev;
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Lỗi khi lấy danh sách phường/xã:", error.message);
        } else {
          console.error("Lỗi không xác định khi lấy danh sách phường/xã:", error);
        }
        setWardOptions([]);
      }
    };

    fetchWards();
  }, [selectedProvince, user.province_id, editedUser.ward_id]);

  return (
    <Container size="sm" py="xl">
      <Title order={2} c="#294b61" ta="center" mb="lg">
        Hồ sơ cá nhân
      </Title>

      <Paper shadow="md" p="xl" radius="md" withBorder>
        {/* Header */}
        <Group mb="md" justify="space-between">
          <Group>
            <Avatar src={null} alt={user.full_name} size={60} radius="xl" />
            <Stack gap={2}>
              <Text fw={600}>{editedUser.full_name || "Chưa có"}</Text>
              <Text c="dimmed" fz="sm">
                {editedUser.email}
              </Text>
            </Stack>
          </Group>

          {!isEditing && (
            <Button color="#053c74" onClick={() => setIsEditing(true)} style={{ color: "#fff" }}>
              Chỉnh sửa
            </Button>
          )}
        </Group>

        <Divider mb="md" />

        {/* Thông tin người dùng */}
        <Stack gap="sm">
          {/* Tên */}
          <Group justify="space-between">
            <Text c="dimmed">Tên:</Text>
            {isEditing ? (
              <TextInput
                value={editedUser.full_name ?? ""}
                onChange={(e) => setEditedUser({ ...editedUser, full_name: e.currentTarget.value })}
                placeholder="Nhập tên"
              />
            ) : (
              <Text>{editedUser.full_name || "Chưa có"}</Text>
            )}
          </Group>

          {/* Email */}
          <Group justify="space-between">
            <Text c="dimmed">Email:</Text>
            {isEditing ? (
              <TextInput
                value={editedUser.email ?? ""}
                onChange={(event) =>
                  setEditedUser({ ...editedUser, email: event.currentTarget.value })
                }
                placeholder="Nhập email"
              />
            ) : (
              <Text>{editedUser.email}</Text>
            )}
          </Group>

          {/* SĐT */}
          <Group justify="space-between">
            <Text c="dimmed">SĐT:</Text>
            {isEditing ? (
              <TextInput
                value={editedUser.phone ?? ""}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.currentTarget.value })}
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <Text>{editedUser.phone || "Chưa có"}</Text>
            )}
          </Group>

          {/* Quyền */}
          <Group justify="space-between">
            <Text c="dimmed">Quyền:</Text>
            {isEditing ? (
              <TextInput
                value={
                  editedUser.is_superuser
                    ? "Admin"
                    : editedUser.is_active
                    ? "User thường"
                    : "Không xác định"
                }
                onChange={(e) => {
                  const value = e.currentTarget.value.toLowerCase();
                  setEditedUser({
                    ...editedUser,
                    is_superuser: value.includes("admin"),
                    is_active: !value.includes("không") && !value.includes("vô hiệu"),
                  });
                }}
                placeholder="Nhập quyền (Admin hoặc User thường)"
                disabled
              />
            ) : (
              <Text>
                {editedUser.is_superuser
                  ? "Admin"
                  : editedUser.is_active
                  ? "User thường"
                  : "Không xác định"}
              </Text>
            )}
          </Group>

          {/* Tỉnh */}
          <Group justify="space-between">
            <Text c="dimmed">Tỉnh/Thành phố:</Text>
            {isEditing ? (
              <Select
                data={provinceOptions}
                value={editedUser.province_id || ""}
                onChange={(value) => {
                  setEditedUser({ ...editedUser, province_id: value || "" });
                  setSelectedProvince(value);
                }}
                placeholder="Tỉnh/thành phố"
                searchable
                style={{ maxWidth: 185 }}
              />
            ) : (
              <Text>
                {provinceOptions.find((p) => p.value === editedUser.province_id)?.label || "Chưa có"}
              </Text>
            )}
          </Group>

          {/* Phường */}
          <Group justify="space-between">
            <Text c="dimmed">Phường/Xã:</Text>
            {isEditing ? (
              <Select
                data={wardOptions}
                value={editedUser.ward_id || ""}
                onChange={(value) => setEditedUser({ ...editedUser, ward_id: value || "" })}
                placeholder="Phường/xã"
                searchable
                style={{ maxWidth: 185 }}
              />
            ) : (
              <Text>
                {wardOptions.find((w) => w.value === editedUser.ward_id)?.label || "Chưa có"}
              </Text>
            )}
          </Group>

          {/* Mã người giới thiệu */}
          <Group justify="space-between">
            <Text c="dimmed">Mã người giới thiệu:</Text>
            {isEditing ? (
              <TextInput
                value={editedUser.introducer_id ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, introducer_id: e.currentTarget.value })
                }
                placeholder="Nhập mã người giới thiệu"
              />
            ) : (
              <Text>{editedUser.introducer_id || "Chưa có"}</Text>
            )}
          </Group>

          {/* Địa chỉ chi tiết */}
          <Group justify="space-between">
            <Text c="dimmed">Địa chỉ chi tiết:</Text>
            {isEditing ? (
              <TextInput
                value={editedUser.detal_address ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, detal_address: e.currentTarget.value })
                }
                placeholder="Nhập địa chỉ chi tiết"
              />
            ) : (
              <Text>{editedUser.detal_address || "Chưa có"}</Text>
            )}
          </Group>
        </Stack>

        {/* 🟡 Hai nút "Lưu" và "Hủy" hiển thị khi đang chỉnh sửa */}
        {isEditing && (
          <Group justify="flex-end" mt="xl">
            <Button
              color="#808080"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              style={{ fontSize: "12px" }}
            >
              Hủy
            </Button>

            <Button
              color="#053c74"
              onClick={handleSave}
              loading={loading}
              style={{ color: "#fff", fontSize: "12px" }}
            >
              Lưu thay đổi
            </Button>
          </Group>
        )}
      </Paper>
    </Container>
  );
}
