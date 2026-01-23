// "use client";

// import {
//   Box,
//   Button,
//   FileInput,
//   Group,
//   LoadingOverlay,

//   TextInput,
// } from "@mantine/core";
// import { isNotEmpty,  useForm } from "@mantine/form";
// import { IconCheck, IconX } from "@tabler/icons-react";
// import { modals } from "@mantine/modals";
// import { useDisclosure } from "@mantine/hooks";
// import { createUser } from "../../../api/apiCreateProject"; // 🔁 sửa đường dẫn nếu cần


// interface CreateViewProps {
//   onSearch: () => Promise<void>;
// }

// const CreateView = ({ onSearch }: CreateViewProps) => {
//   const [visible, { open, close }] = useDisclosure(false);

//   const form = useForm({
//     initialValues: {
//       name: "",
//   type: "",
//   address: "",
//   investor: "",
//   image_url: "",
//   rank: "",
//   project_template_id:"",
     
 
//     },
//     validate: {
//       name: isNotEmpty("Tên không được để trống"),
//       rank: isNotEmpty("Cấp bậc không được để trống"),
//       type: isNotEmpty("Loại không được để trống"),
//       address: isNotEmpty("Địa chỉ không được để trống"),
//       investor: isNotEmpty("Chủ đầu tư không được để trống"),
//       image_url: isNotEmpty("Hình ảnh không được để trống"),
//      project_template_id: isNotEmpty("Mẫu dự án không được để trống"),
     
//     },
//   });

//   const handleSubmit = async (values: typeof form.values) => {
//     open();
//     try {
//       const userData = {
//         name: values.name,
//            rank: values.rank, 
//   type: values.type,
//   address: values.address,
//   investor: values.investor,
//   image_url: values.image_url,
//    project_template_id:values. project_template_id
       
//       };
//       await createUser(userData);
//       await onSearch();
//       modals.closeAll();
//     } catch (error) {
//       console.error("Lỗi khi tạo user:", error);
//       alert("Đã xảy ra lỗi khi tạo người dùng.");
//     } finally {
//       close();
//     }
//   };

//   return (
//     <Box
//       component="form"
//       miw={320}
//       mx="auto"
//       onSubmit={form.onSubmit(handleSubmit)}
//     >
//       <LoadingOverlay
//         visible={visible}
//         zIndex={1000}
//         overlayProps={{ radius: "sm", blur: 2 }}
//       />
// <TextInput
//   label="ID mẫu dự án"
//   placeholder="Nhập ID mẫu dự án"
//   type="number"
//   mt="md"
//   {...form.getInputProps("project_template_id")}
// />
//       <TextInput
//     label="Tên dự án"
//     placeholder="Nhập Tên dự án"
//     withAsterisk
//     mt="md"
//     {...form.getInputProps("name")}
//   />

//   <TextInput
//     label="Cấp bậc"
//     placeholder="Nhập Cấp bậc"
//     withAsterisk
//     mt="md"
//     {...form.getInputProps("rank")}
//   />

//   <TextInput
//     label="Loại dự án"
//     placeholder="Nhập loại dự án"
//     withAsterisk
//     mt="md"
//     {...form.getInputProps("type")}
//   />

//   <TextInput
//     label="Địa chỉ"
//     placeholder="Nhập địa chỉ"
//     mt="md"
//     {...form.getInputProps("address")}
//   />

//   <TextInput
//     label="Chủ đầu tư"
//     placeholder="Nhập tên chủ đầu tư"
//     mt="md"
//     {...form.getInputProps("investor")}
//   />

//   <FileInput
//     label="Hình ảnh"
//     placeholder="Nhập File hình ảnh"
//     mt="md"
//     {...form.getInputProps("image_url")}
//   />
   
  

//       <Group justify="flex-end" mt="lg">
//         <Button
//           type="submit"
//           color="#3598dc"
//           loading={visible}
//           leftSection={<IconCheck size={18} />}
//         >
//           Lưu
//         </Button>
//         <Button
//           variant="outline"
//           color="black"
//           type="button"
//           loading={visible}
//           onClick={() => modals.closeAll()}
//           leftSection={<IconX size={18} />}
//         >
//           Đóng
//         </Button>
//       </Group>
//     </Box>
//   );
// };

// export default CreateView;
