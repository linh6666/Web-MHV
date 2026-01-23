import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteUserManagement } from "../../../api/apiUserProjectRole";

type DeleteProductProps = {
  idItem: string[]; // UUID dưới dạng chuỗi
  onSearch: () => void;
};

const DeleteView = ({ idItem, onSearch }: DeleteProductProps) => {
  const handleDeleteUsers = async () => {
    try {
      for (const userId of idItem) {
        await deleteUserManagement(userId); // Gọi API xóa từng người dùng
      }

      // Hiển thị thông báo thành côngs
      notifications.show({
        title: "Thành công",
        message: `${idItem.length} người dùng đã được xoá`,
        color: "green",
        icon: <IconCheck size={20} />,
      });

      // Xoá thành công, đóng modal và gọi lại fetchUsers
      modals.closeAll();
      onSearch();
    } catch (error) {
      console.error("Lỗi xoá người dùng:", error);

      notifications.show({
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi xoá người dùng.",
        color: "red",
        icon: <IconX size={20} />,
      });
    }
  };

  return (
    <div>
      <Text size="lg" fw={500} mb="md">
        Bạn có chắc chắn muốn xóa {idItem.length} người dùng đã chọn?
      </Text>

      <Group justify="center" mt="lg">
        <Button
          color="red"
          onClick={handleDeleteUsers}
          leftSection={<IconCheck size={18} />}
        >
          Xác nhận xoá
        </Button>

        <Button
          variant="outline"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
      </Group>
    </div>
  );
};

export default DeleteView;

