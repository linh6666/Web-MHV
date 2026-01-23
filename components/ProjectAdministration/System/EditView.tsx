"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck,  IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef,  } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiEditsystem";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

// interface SystemOption {
//   id: number; // hoặc string, tùy thuộc vào API của bạn
//   name: string;
// }

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  // const [systemOptions, setSystemOptions] = useState<
  //   { value: string; label: string }[]
  // >([]);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      name: "",
      rank_total: "",
      description_vi: "",
      // description_en: "",
    },
    validate: {
      name: (value) => (value ? null : "Tên không được để trống"),
      rank_total: (value) => (value ? null : "Cấp bậckhông được để trống"),
      // description_en: (value) => (value ? null : "Mô tả thoại không được để trống"),
      description_vi: (value) => (value ? null : "Mô tả không được để trống"),
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_SYSTEM.replace("{system_id}", id);
      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      alert("Đã xảy ra lỗi khi cập nhật người dùng.");
    } finally {
      close();
    }
  };

  /** Lấy dữ liệu chi tiết user */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.UPDATE_SYSTEM.replace("{system_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
  name: userData.name || "",
  rank_total: userData.rank_total ? String(userData.rank_total) : "",
  description_vi: userData.description_vi || "",
});
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]);

  /** Lấy danh sách chức vụ hệ thống */
  const fetchSystemOptions = useCallback(async () => {
    try {
      // const res = await api.get(API_ROUTE.GET_LIST_SYSTEM);
      // const rawData = Array.isArray(res.data) ? res.data : res.data.data;
      // const options = rawData.map((item: SystemOption) => ({
      //   value: item.id.toString(),
      //   label: item.name,
      // }));
      // setSystemOptions(options);
    } catch (error) {
      console.error("Lỗi khi load system options:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetail();
    fetchSystemOptions();
  }, [fetchUserDetail, fetchSystemOptions]);

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
        label="Tên vai trò"
        placeholder="Nhập Tên vai trò"
        withAsterisk
        mt="md"
        {...form.getInputProps("name")}
      />

     <Select
  label="Cấp Bậc"
  placeholder="Chọn cấp bậc"
  withAsterisk
  mt="md"
  data={[
    { value: "1", label: "Cấp 1" },
    { value: "2", label: "Cấp 2" },
    { value: "3", label: "Cấp 3" },
    { value: "4", label: "Cấp 4" },
    { value: "5", label: "Cấp 5" },
    { value: "6", label: "Cấp 6" },
    { value: "7", label: "Cấp 7" },
    { value: "8", label: "Cấp 8" },
  ]}
  {...form.getInputProps("rank_total")}
/>
<Textarea
  label="Mô tả "
  placeholder="Nhập mô tả "
  autosize
  minRows={3}
  mt="md"
  {...form.getInputProps("description_vi")}
/>

{/* <Textarea
  label="Mô tả (Tiếng Anh)"
  placeholder="Enter English description"
  autosize
  minRows={3}
  mt="md"
  {...form.getInputProps("description_en")}
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