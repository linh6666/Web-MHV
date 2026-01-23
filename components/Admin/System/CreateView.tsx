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
import { isNotEmpty,  useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { createUser } from "../../../api/apicreatesystem"; // 🔁 sửa đường dẫn nếu cần


interface CreateViewProps {
  onSearch: () => Promise<void>;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      rank_total: "",
      description_vi: "",
      // description_en: "",
     
 
    },
    validate: {
      name: isNotEmpty("Tên không được để trống"),
      rank_total: isNotEmpty("Cấp bậc không được để trống"),
      description_vi: isNotEmpty("Mô tả không được để trống"),
      // description_en: isNotEmpty("Mô tả không được để trống"),
     
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      const userData = {
        name: values.name,
           rank_total: Number(values.rank_total), 
          description_vi: values.description_vi,
        // description_en: values.description_en,
       
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
   clearable
  data={[
    { value: "1", label: "Cấp 1" },
    { value: "2", label: "Cấp 2" },
    { value: "3", label: "Cấp 3" },
    { value: "4", label: "Cấp 4" },
    { value: "5", label: "Cấp 5" },
    { value: "6", label: "Cấp 6" },
    { value: "7", label: "Cấp 7" },
    { value: "8", label: "Cấp 8" },
    { value: "9", label: "Cấp 9" },
    { value: "10", label: "Cấp 10" },
    { value: "11", label: "Cấp 11" },
    { value: "12", label: "Cấp 12" },
    { value: "13", label: "Cấp 13" },
    { value: "14", label: "Cấp 14" },
    { value: "15", label: "Cấp 15" },
    { value: "16", label: "Cấp 16" },
    { value: "17", label: "Cấp 17" },
    { value: "18", label: "Cấp 18" },
    { value: "19", label: "Cấp 19" },
    { value: "20", label: "Cấp 20" },
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
