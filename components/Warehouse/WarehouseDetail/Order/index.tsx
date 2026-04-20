"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconMail } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  Modal,
  Button,
  Group,
  TextInput,
  LoadingOverlay,
  Box,
  Textarea,
  Text,
  Grid,
  MantineProvider,
  createTheme,
  Input,
} from "@mantine/core";
import { createContact } from "../../../../api/apiCreateContact";
import { useDisclosure } from "@mantine/hooks";
import useAuth from "../../../../hook/useAuth";
import { modals } from "@mantine/modals";
import { NotificationExtension } from "../../../../extension/NotificationExtension";
import { AxiosError } from "axios";

/* ================= THEME ================= */

const theme = createTheme({
  components: {
    Input: Input.extend({
      defaultProps: {
        variant: "filled",
      },
    }),

    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ["label", "input", "description", "error"],
      },
    }),
  },
});

/* ================= TYPE ================= */

interface HouseData {
  id: string;
  unit_code: string;
  leaf_id?: string;
  zone?: string;
  layer3?: string;
  layer2?: string;
  building_type?: string;
}


interface OrderButtonProps {
  house: HouseData;
  projectId: string;
}

export default function OrderButton({ house, projectId }: OrderButtonProps) {
  const [opened, setOpened] = useState(false);
  const [visible, { open, close }] = useDisclosure(false);

  const { user, isLoggedIn } = useAuth();

  /* ================= FORM ================= */

  const form = useForm({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      content: "",
    },

    validate: {
      subject: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập chủ đề" : null,

      content: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập nội dung" : null,
    },
  });

  /* ================= AUTO FILL USER ================= */

  useEffect(() => {
    if (!opened || !user) return;

    form.setValues({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [opened, user]);

  /* ================= CLOSE MODAL ================= */

  const handleCloseModal = () => {
    setOpened(false);
    form.reset();
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: typeof form.values) => {
    if (!isLoggedIn) {
      NotificationExtension.Warn("Vui lòng đăng nhập trước");
      return;
    }

    open();

    try {
      const payload = {
        project_id: projectId,
        node_attribute_id: house.leaf_id || house.id,
        topic: values.subject,
        message: values.content,
      };


      const res = await createContact(payload);

      NotificationExtension.Success(
        res?.message || "Gửi liên hệ thành công"
      );

      handleCloseModal();
      modals.closeAll();
    } catch (error: unknown) {
      let message = "Đã xảy ra lỗi";

      if (error instanceof AxiosError) {
        message = error.response?.data?.detail ?? message;
      }

      NotificationExtension.Fails(message);
    } finally {
      close();
    }
  };

  return (
    <MantineProvider theme={theme}>
      <div style={{ display: "flex", gap: "12px", zIndex: 10 }}>
        {/* ================= BUTTON ================= */}

        <button
          onClick={() => setOpened(true)}
          style={{
            height: "40px",
            padding: "0 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconMail size={20} color="#294b61" />

          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#294b61",
            }}
          >
            Liên hệ
          </span>
        </button>

        {/* ================= MODAL ================= */}

        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title={<div style={{ fontWeight: 600, fontSize: 18 }}>Liên hệ</div>}
          size="lg"
          radius="md"
        >
          <Box component="form" mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={visible} />

            <Grid gutter="md">
              {/* ===== THÔNG TIN LIÊN HỆ ===== */}

              <Grid.Col span={12}>
                <Text fw={700} size="md">
                  Thông tin liên hệ
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Phân khu"
                  value={house.zone || house.layer3 || "Không có"}
                  readOnly
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Loại công trình"
                  value={house.building_type || house.layer2 || "Không có"}
                  readOnly
                />
              </Grid.Col>

              {/* <Grid.Col span={12}>
                <TextInput label="Mã căn" value={house.unit_code} readOnly />
              </Grid.Col> */}

              {/* ===== THÔNG TIN NGƯỜI DÙNG ===== */}

              <Grid.Col span={12} mt="md">
                <Text fw={700} size="md">
                  Thông tin người dùng
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Họ và tên"
                  readOnly
                  {...form.getInputProps("full_name")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  readOnly
                  {...form.getInputProps("email")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Số điện thoại"
                  readOnly
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Chủ đề"
                   placeholder="Nhập chủ đề"
                  withAsterisk
                  variant="default"
                  {...form.getInputProps("subject")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Textarea
                  withAsterisk
                  label="Nội dung"
                  placeholder="Nhập nội dung liên hệ"
                  autosize
                  minRows={3}
                  variant="default"
                  {...form.getInputProps("content")}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="lg">
        <Button
  type="submit"
  loading={visible}
  disabled={!form.values.subject.trim() || !form.values.content.trim()}
  leftSection={<IconCheck size={18} />}
  style={{ backgroundColor: "#3d6985" }}
>
  Gửi
</Button>
            </Group>
          </Box>
        </Modal>
      </div>
    </MantineProvider>
  );
}