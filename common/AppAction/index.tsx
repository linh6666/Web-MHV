import {
  Box,
  Button,
  FileButton,
  Flex,
  Group,

  Menu,
  Text,
  rem,
} from "@mantine/core";
import {
  IconActivityHeartbeat,
  IconArrowsLeftRight,
  IconBadgeFilled,
  IconCaretDown,
  IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconEdit,
  IconFileDownload,
  IconFileInvoice,
  IconFilePlus,
  IconMessageCircle,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSettings,

  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { useRef, useState } from "react";

const AppAction = ({
  language = "vi", // Mặc định là tiếng Việt
  openModal,
  openModalEdit,
  openModalDelete,
  openModalupdateExel,
  openModalAssign,
  openModalPos,
  openActivated,
  openActiveAdmins,
  importExcel,
  submitExcel,
  exportExcel,
  handleAggregate,
  handleUpdateRank,

  isShowOtherAction = false,
  isCustomerUpdate = false,
}: AppActionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };
  return (
    <Box style={{ overflow: "hidden" }}>
      <Flex justify={"space-between"} w={"100%"} mx="auto">
        <Group align="center">
          {exportExcel && (
            <Button
              leftSection={<IconFileDownload size={14}></IconFileDownload>}
              onClick={exportExcel}
              color="yellow"
              variant="outline"
            >
              Export Excel
            </Button>
          )}
          {importExcel && (
            <FileButton
  resetRef={resetRef}
  onChange={(file) => {
    importExcel(file);
    setFile(file);
  }}
  accept=".xls, .xlsx, .csv"
>
  {(props) => (
    <>
      <Button
        color="violet"
        variant="outline"
        leftSection={<IconFilePlus size={14} />}
        {...props} // Chỉ truyền props mà không có ref
      >
        Import Excel
      </Button>

      {openModalupdateExel && (
        <Button
          onClick={openModalupdateExel}
          leftSection={<IconFilePlus size={14} />}
          color="green"
          variant="outline"
        >
          Cập nhật
        </Button>
      )}
    </>
  )}
</FileButton>
          )}
          {file && (
            <Button
              color="green"
              fw={"500"}
              ta="center"
              variant="outline"
              onClick={() => {
                if (submitExcel) submitExcel();
                clearFile();
              }}
            >
              Import file: {file.name}
            </Button>
          )}
          {file && (
            <Button disabled={!file} color="red" onClick={clearFile}>
              Xóa
            </Button>
          )}
        </Group>
        <Group wrap="nowrap" justify="flex-end">
          {isCustomerUpdate && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  color={"violet"}
                  rightSection={
                    <IconCaretDown
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Chức năng
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileInvoice
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={handleAggregate}
                >
                  Tổng hợp hóa đơn
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconBadgeFilled
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={handleUpdateRank}
                >
                  Cập nhật hạng
                </Menu.Item>
                {/* <Menu.Item
                  leftSection={
                    <IconStarFilled
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={handleUpdateExchangePoint}
                >
                  Cập nhật điểm tích lũy
                </Menu.Item> */}
              </Menu.Dropdown>
            </Menu>
          )}

          {openModal && (
            <Button
    onClick={openModal}
    leftSection={<IconPlus size={14} />}
    color="blue"
    variant="outline"
  >
    {language === 'vi' ? 'Thêm mới' : 'Add New'}
  </Button>
          )}
          {openModalAssign && (
            <Button
              onClick={openModalAssign}
              leftSection={<IconUsers size={14} />}
              color="green"
              variant="outline"
            >
              Chọn người phụ trách
            </Button>
          )}
          {openModalEdit && (
            <Button
    leftSection={<IconEdit size={14} />}
    onClick={openModalEdit}
    color="orange"
    variant="outline"
  >
    {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
  </Button>
          )}
          {openModalDelete && (
             <Button
    leftSection={<IconTrash size={14} />}
    onClick={openModalDelete}
    color="red"
    variant="outline"
  >
    {language === 'vi' ? 'Xóa (Đã chọn)' : 'Delete (Selected)'}
  </Button>
          )}

          {openActivated && (
            <Button
              leftSection={<IconActivityHeartbeat size={14} />}
              onClick={openActivated}
              color="green"
              variant="outline"
            >
              kích hoạt
            </Button>
          )}
          {openActiveAdmins && (
            <Button
              leftSection={<IconActivityHeartbeat size={14} />}
              onClick={openActiveAdmins}
              color="yellow"
              variant="outline"
            >
              kích hoạt Admin
            </Button>
          )}
          {/* {isUpdateSearchItem && (
            <Button
              onClick={() => updateSearchItemProduct()}
              leftSection={<IconCheck size={14} />}
              color="green"
              variant="outline"
            >
              Cập nhật đồng bộ
            </Button>
          )} */}

          {openModalPos && (
            <Button
              onClick={openModalPos}
              leftSection={<IconCheck size={14} />}
              color="blue"
              variant="outline"
            >
              Gửi đơn sang POS
            </Button>
          )}
          {isShowOtherAction && (
            <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={200}>
              <Menu.Target>
                <Button
                  rightSection={<IconChevronDown size={14} />}
                  leftSection={<IconDotsVertical size={14} />}
                  color="violet"
                  variant="outline"
                >
                  Thao tác khác
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMessageCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Messages
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Gallery
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSearch style={{ width: rem(14), height: rem(14) }} />
                  }
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘K
                    </Text>
                  }
                >
                  Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconArrowsLeftRight
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Transfer my data
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Delete my account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Flex>
    </Box>
  );
};

export default AppAction;

type AppActionProps = {
  language?: 'vi' | 'en'; // Ngôn ngữ hiển thị
  openModal?: () => void;
  openModalupdateExel?: () => void;
  openModalEdit?: () => void;
  openModalDelete?: () => void;
  openModalAssign?: () => void;
  openActivated?: () => void;
  openModalPos?: () => void;
  handleAggregate?: () => void;
  handleUpdateRank?: () => void;
  openActiveAdmins?: () => void;
  importExcel?: (file: File | null) => void; // ✅ fix any -> File | null
  submitExcel?: () => void;
  exportExcel?: () => void;
  handleUpdateExchangePoint?: () => void;
  isShowOtherAction?: boolean;
  isUpdateSearchItem?: boolean;
  isCustomerUpdate?: boolean;
};