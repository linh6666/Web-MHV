"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,

} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { UpdateRequestPayload } from "../../../api/apiEdiJoinProject";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string; // Đây là request_id
  project_id: string; 
}

const EditView = ({ onSearch, id, project_id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<UpdateRequestPayload>({
    initialValues: {
      status: "",
      
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật project */
  const handleSubmit = async (values: UpdateRequestPayload) => {
    open(); // loading
    try {
      const url = API_ROUTE.UPDATE_REQUEST
        .replace("{project_id}", project_id)
        .replace("{request_id}", id); // id = request_id

      await api.put(url, values);

      await onSearch(); // refresh table
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật request:", error);
      alert("Đã xảy ra lỗi khi cập nhật request.");
    } finally {
      close(); // tắt loading
    }
  };

  /** Lấy dữ liệu chi tiết project */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return; // chỉ cần id

    open(); // loading
    try {
      // Thêm lang và project_id vào yêu cầu
      const url = `${API_ROUTE.GET_REQUEST.replace("{request_id}", id)}?lang=vi&project_id=${project_id}`;

      const response = await api.get(url);
      const userData = response.data;

      if (userData) {
        formRef.current.setValues({
          status: userData.status || "",
          
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu request:", error);
      alert("Không thể tải thông tin request.");
    } finally {
      close(); // tắt loading
    }
  }, [id, project_id, open, close]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  return (
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <Select
  label="Trạng thái"
  placeholder="Chọn trạng thái"
  mt="md"
  clearable
  data={[
    { value: "pending", label: "Đang chờ duyệt" },
    { value: "approved", label: "Đã được chấp nhận" },
    { value: "rejected", label: "Đã từ chối" },
  ]}
  {...form.getInputProps("status")}
/>

      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          loading={visible}
          leftSection={<IconCheck size={18} />}
        >
          Lưu
        </Button>
        <Button
          variant="outline"
          color="black"
          type="button"
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
