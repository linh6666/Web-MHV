"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,

  Select,
} from "@mantine/core";
import {  useForm } from "@mantine/form";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { createUser } from "../../../api/apiUserProjectRole";
// import { getListSystem } from "../../../api/apigetlistsystym";
import { getListRoles } from "../../../api/getlistrole";
import { getListUser } from "../../../api/apigetlistuse";
import { getListProject } from "../../../api/apigetlistProject";


interface CreateViewProps {
  onSearch: () => Promise<void>;
}

interface Option {
  value: string;
  label: string;
}

// interface System {
//   id: string;
//   name: string;
// }

interface Project {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  // Options
  // const [systemOptions, setSystemOptions] = useState<Option[]>([]);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  const form = useForm({
    initialValues: {
      project_id: "",
      user_id: "",
      role_id: "",
    },
    validate: {
      // system_id: isNotEmpty("Không được để trống"),
      // project_id: isNotEmpty("Không được để trống"),
      // user_id: isNotEmpty("Không được để trống"),
      // role_id: isNotEmpty("Không được để trống"),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";

        const [ projects, roles, users] = await Promise.all([
          // getListSystem({ token }) as Promise<{ data: System[] }>,
          getListProject({ token }) as Promise<{ data: Project[] }>,
          getListRoles({ token }) as Promise<{ data: Role[] }>,
          getListUser({ token }) as Promise<{ data: User[] }>,
        ]);

        // Hệ thống
        // setSystemOptions(
        //   systems.data.map((item) => ({
        //     value: String(item.id),
        //     label: item.name,
        //   }))
        // );

        // Dự án
        setProjectOptions(
          projects.data.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        );

        // Vai trò
        setRoleOptions(
          roles.data.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        );

        // Người dùng (hiển thị email)
        setUserOptions(
          users.data.map((item) => ({
            value: String(item.id),
            label: item.email,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      console.log("Giá trị project_id:", values.project_id);

      const payload = {
        // system_id: values.system_id,
        project_id: values.project_id,
        user_id: values.user_id,
        role_id: values.role_id,
      };

      console.log("Payload gửi đi:", payload);

      await createUser(payload.project_id, payload);
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
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

{/* <Select
  label="Tên hệ thống"
  placeholder="Chọn hệ thống"
  data={systemOptions.length ? systemOptions : []} // 👈 bỏ label "Đang tải..."
  rightSection={<IconChevronDown size={16} />}
  mt="md"
  withAsterisk
  {...form.getInputProps("system_id")}
/> */}

     <Select
  rightSection={<IconChevronDown size={16} />}
  label="Dự án"
  placeholder="Chọn dự án"
  data={projectOptions.length ? projectOptions : []}
  mt="md"
  {...form.getInputProps("project_id")}
/>

<Select
  rightSection={<IconChevronDown size={16} />}
  label="Email người dùng"
  placeholder="Chọn người dùng"
  data={userOptions.length ? userOptions : []}
  mt="md"
  {...form.getInputProps("user_id")}
/>

<Select
  rightSection={<IconChevronDown size={16} />}
  label="Vai trò"
  placeholder="Chọn vai trò"
  data={roleOptions.length ? roleOptions : []}
  mt="md"
  {...form.getInputProps("role_id")}
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
