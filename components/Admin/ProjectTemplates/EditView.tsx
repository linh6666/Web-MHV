"use client";

import {
  Box,
  Button,

  Group,
  LoadingOverlay,


  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef,  } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apiProjectTemplates";

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
    type_vi: "",
      // type_en: "",
    
      // description_en: "",
    },
    validate: {
      // template_vi: (value) => (value ? null : "không được để trống"),
    
    },
  });

  const formRef = useRef(form);

  /** Submit cập nhật user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.UPDATE_PROJECTTYPE.replace("{type_id}", id);
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
      const url = API_ROUTE.UPDATE_PROJECTTYPE.replace("{type_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        type_vi: userData.type_vi|| "",
        // type_en: userData.type_en || "",
       
    
       
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
      // const res = await api.get(API_ROUTE.GET_LIST_ROLES);
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
        label="Loại dự án"
        placeholder="Nhập loại dự án"
        withAsterisk
        mt="md"
        {...form.getInputProps("type_vi")}
      />
       {/* <TextInput
        label="Loại dự án (Tiếng Anh)"
        placeholder="Nhập loại dự án (Tiếng Anh)"
        withAsterisk
        mt="md"
        {...form.getInputProps("type_en")}
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