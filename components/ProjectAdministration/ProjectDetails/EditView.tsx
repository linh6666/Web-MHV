"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useCallback, useRef } from "react";
import { API_ROUTE } from "../../../const/apiRouter";
import { api } from "../../../libray/axios";
import { CreateUserPayload } from "../../../api/apidetailhome";
import { NotificationExtension } from "../../../extension/NotificationExtension";

/* =======================
   PROPS
======================= */
interface EditViewProps {
  id: string;                 // link_id
  leaf_id: string;            // leaf_id
  project_id: string;         // project_id
  onSearch: () => Promise<void>;
}


const EditView = ({
  leaf_id,
  project_id,
  onSearch,
}: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const token = localStorage.getItem("access_token") || "";

  const form = useForm<CreateUserPayload>({
    initialValues: {
     
    
      layer3:"",
      building_type:"",
      status_unit:"",
   
     
    },
  });

  const formRef = useRef(form);


 const handleSubmit = async (values: CreateUserPayload) => {
  open();
  try {
    const url = API_ROUTE.EDIT_DETAILE_HOME
      .replace("{project_id}", project_id)
      .replace("{leaf_id}", leaf_id);

    // ✅ BỌC DỮ LIỆU TRONG updates
    const payload = {
      updates: {
       
    
        layer3: values.layer3,
        building_type: values.building_type,
        status_unit: values.status_unit,
      },
    };

    const res = await api.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    NotificationExtension.Success(
      res?.data?.message || "Cập nhật dữ liệu thành công!"
    );

    await onSearch();
    modals.closeAll();
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    NotificationExtension.Fails("Đã xảy ra lỗi khi cập nhật!");
  } finally {
    close();
  }
};



const fetchDetail = useCallback(async () => {
  if (!project_id || !leaf_id) return;

  open();
  try {
    const url = API_ROUTE.GET_DETAILE_HOME
      .replace("{project_id}", project_id)
      .replace("{leaf_id}", leaf_id);

    const res = await api.get(url);

    // ✅ LẤY PHẦN TỬ ĐẦU TIÊN TRONG data[]
    const item = res.data?.data?.[0];

    if (!item) {
      NotificationExtension.Fails("Không có dữ liệu chi tiết!");
      return;
    }

   formRef.current.setValues({

 
  layer3: item.layer3 ?? "",
  building_type: item.building_type ?? "",
  status_unit: item.status_unit ?? "",
 
});
  } catch (error) {
    console.error("Lỗi khi tải chi tiết:", error);
    NotificationExtension.Fails("Không thể tải dữ liệu chi tiết!");
    modals.closeAll();
  } finally {
    close();
  }
}, [project_id, leaf_id, open, close]);




  useEffect(() => {
    fetchDetail();
   
  }, [fetchDetail,]);

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
        label="Phân khu/tòa "
         {...form.getInputProps("layer3")}
      />
       <TextInput
        label="Loại tòa nhà "
         {...form.getInputProps("building_type")}
      />
       <Select
        label="Trạng thái"
        data={['ĐANG BÁN', 'ĐÃ BÁN', 'ĐÃ ĐẶT CỌC']}
        {...form.getInputProps("status_unit")}
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

export default EditView;
