"use client";

import { useState } from "react";
import {
  // IconCheck,
  IconFolder,
  IconPlus,
  // IconQuestionMark,
  // IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  Modal,
  Button,
  Group,
  TextInput,
  LoadingOverlay,
  Box,
  MantineProvider,
  createTheme,
  Input,
  Grid,
  Divider,
  FileButton,
  Text,
  Stack,
  // Center,
} from "@mantine/core";
import { createOrder } from "../../../api/apiCreateOder";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { NotificationExtension } from "../../../extension/NotificationExtension";
import { AxiosError } from "axios";

interface OrderButtonProps {
  unitCode: string;
  projectId: string;
}

/* ======================
   THEME CONFIG
====================== */

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

export default function OrderButton({ unitCode, projectId }: OrderButtonProps) {
  const [opened, setOpened] = useState(false);
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: "",
      contract_code: "",
      total_price_at_sale_vi: "",
      id_cccd: "",
      file: null as File | null,
    },
  });

  const handleCloseModal = () => {
    setOpened(false);
    form.reset();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.file || !(values.file instanceof File)) {
      NotificationExtension.Warn("Vui lòng chọn file đính kèm hợp lệ");
      return;
    }

    open();

    try {
      const payload = {
        unit_code: unitCode,
        project_id: projectId,
        email: values.email,
        contract_code: values.contract_code,
        total_price_at_sale_vi: Number(values.total_price_at_sale_vi),
        id_cccd: values.id_cccd,
        file: values.file,
      };

      const res = await createOrder(payload);

      NotificationExtension.Success(
        res?.data?.message || "Tạo đơn hàng thành công"
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
            whiteSpace: "nowrap",
          }}
        >
          <IconPlus size={20} color="#752E0B" />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#752E0B",
            }}
          >
            Tạo đơn hàng
          </span>
        </button>

        <Modal
          opened={opened}
          onClose={handleCloseModal}
          centered
           size="lg"  
          title={
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              Tạo đơn hàng mới
            </div>
          }
        >
          <Box
            component="form"
            miw={320}
            mx="auto"
            onSubmit={form.onSubmit(handleSubmit)}
          >
            <LoadingOverlay visible={visible} />

           <Grid mt="md">
  <Grid.Col span={6}>
    <TextInput
      label="Email khách hàng"
      placeholder="Nhập email khách hàng"
      withAsterisk
      {...form.getInputProps("email")}
    />
  </Grid.Col>

  <Grid.Col span={6}>
    <TextInput
      label="Mã hợp đồng"
      placeholder="Nhập mã hợp đồng"
      withAsterisk
      {...form.getInputProps("contract_code")}
    />
  </Grid.Col>
</Grid>

            <TextInput
              label="Giá trị đơn hàng"
              placeholder="Nhập giá trị đơn hàng"
              type="text"
              withAsterisk
              mt="md"
              value={
                form.values.total_price_at_sale_vi
                  ? Number(form.values.total_price_at_sale_vi).toLocaleString(
                      "vi-VN"
                    )
                  : ""
              }
              onChange={(event) => {
                const rawValue = event.currentTarget.value.replace(/\./g, "");
                if (!isNaN(Number(rawValue))) {
                  form.setFieldValue("total_price_at_sale_vi", rawValue);
                }
              }}
            />
                  <Divider my="md" />

            <TextInput
              label="Số CCCD / CMND"
              placeholder="Nhập số CCCD / CMND"
              withAsterisk
              mt="md"
              {...form.getInputProps("id_cccd")}
            />

            <Input.Wrapper
              label={
                <Group gap={4} align="center">
                  <Text size="sm">Tải tệp lên</Text>
                  {/* <IconQuestionMark size={14} color="#adb5bd" stroke={2.5} cursor="pointer" /> */}
                </Group>
              }
              // withAsterisk
              mt="md"
            >
              <FileButton
                onChange={(file) => form.setFieldValue("file", file)}
                accept="application/pdf,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              >
                {(props) => (
                  <Box
                    {...props}
                    style={{
                      border: "1px dashed #ced4da",
                      borderRadius: "8px",
                      padding: "40px 20px",
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      marginTop: "8px",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f3f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "#e9ecef";
                      e.currentTarget.style.borderColor = "#228be6";
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.borderColor = "#ced4da";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.borderColor = "#ced4da";
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const droppedFile = e.dataTransfer.files[0];
                        // Optional: check file type here if needed
                        form.setFieldValue("file", droppedFile);
                      }
                    }}
                  >
                    <Stack align="center" gap={4}>
                      <IconFolder size={64} color="#e9ecef" stroke={1} />
                      <Text fw={700} size="sm" mt="xs" style={{ color: "#212529" }}>
                        Ấn để tải file lên hoặc kéo thả vào đây
                      </Text>
                      <Text size="xs" c="dimmed">
                        Lưu ý chỉ hỗ trợ các định dạng file{" "}
                        <Text span c="blue" fw={500} inherit>jpg</Text>,{" "}
                        <Text span c="blue" fw={500} inherit>.png</Text>,{" "}
                        <Text span c="blue" fw={500} inherit>.docx</Text>,{" "}
                        <Text span c="blue" fw={500} inherit>.pdf</Text>
                      </Text>
                      {form.values.file && (
                        <Text size="xs" c="teal" mt={8} fw={600}>
                          ✓ Đã chọn: {form.values.file.name}
                        </Text>
                      )}
                    </Stack>
                  </Box>
                )}
              </FileButton>
            </Input.Wrapper>

       <Group justify="flex-end" mt="lg">
  <Button
    variant="default"
    radius="xl"
    size="md"
    onClick={handleCloseModal}
  >
    Hủy
  </Button>

  <Button
  radius="xl"
  size="md"
  loading={visible}
  type="submit"
  style={{ backgroundColor: "#3d6985" }}
>
  Xác nhận
</Button>

            </Group>
          </Box>
        </Modal>
      </div>
    </MantineProvider>
  );
}