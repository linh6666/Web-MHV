"use client";

import React, { useState } from "react";
import { IconInfoCircle, IconLoader2 } from "@tabler/icons-react";
import { Drawer, Text, ScrollArea, Group, Stack, Badge, Button, Table } from "@mantine/core";
import ModalItem from "./ModalItem";
import type { DataDetail } from "./ModalItem";
import { createNodeAttribute } from "../../../../api/apifilter4";
import { NotificationExtension } from "../../../../extension/NotificationExtension";


interface UnitResult {
  id?: number | string;
  unit_code?: string;
  leaf_id?: string;
  building_type?: string;
  num_floor?: string | number;
  zone?: string;
  layer2?:string;
  layer4?: string;
  layer3?: string;
  status_unit?: string;
  bedroom?: string | number;
  direction?: string;
  feature_2?: string;
}

interface SearchResultModalProps {
  opened: boolean;
  onClose: () => void;
  results: UnitResult[];
  projectId: string | null; // New prop for project identifier
}

export default function SearchResultModal({
  opened,
  onClose,
  results,
  projectId,
}: SearchResultModalProps) {

  const [selectedItem, setSelectedItem] = useState<DataDetail | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [rowLoading, setRowLoading] = useState<number | string | null>(null);

  // 🔍 Khi click vào 1 dòng kết quả → call API createNodeAttribute với filter của item đó
  const handleRowClick = async (item: UnitResult) => {
    if (!projectId) return;

    const itemId = item.id ?? null;
    setRowLoading(itemId);

    try {
      const filters: { label: string; values: string[] }[] = [
        { label: "layer1", values: ["ct", ] },
      ];

      if (item.zone) filters.push({ label: "layer2", values: [item.zone] });
      if (item.layer3) filters.push({ label: "layer3", values: [item.layer3] });


      const body = {
        project_id: projectId,
        filters,
      };

      console.log("🔍 Row click - calling API with filters:", filters);
      const data = await createNodeAttribute(body);

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        // Lấy item khớp nhất (ưu tiên theo id hoặc unit_code)
        const matched = data.data.find(
          (d: UnitResult) => d.id === item.id || d.unit_code === item.unit_code
        ) || data.data[0];

        setSelectedItem({
          ...matched,
          id: Number(matched.id ?? 0),
        } as DataDetail);
        setModalOpened(true);
      } else {
        NotificationExtension.Fails("Không tìm thấy dữ liệu chi tiết!");
      }
    } catch (error) {
      console.error("❌ Row click API error:", error);
      NotificationExtension.Fails("Lỗi khi tải dữ liệu chi tiết!");
    } finally {
      setRowLoading(null);
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        title={<Text fw={700} fz="lg">Kết quả lọc ({results.length})</Text>}
        size="lg"
        position="left"
        styles={{
          header: { borderBottom: '1px solid #eee', marginBottom: '10px' },
          body: { height: 'calc(100vh - 80px)', padding: '20px' }
        }}
      >
        <ScrollArea h="calc(100vh - 180px)" offsetScrollbars>
          {results.length === 0 ? (
            <Stack align="center" mt="xl" gap="xs">
              <IconInfoCircle size={40} color="#ccc" />
              <Text c="dimmed">Không tìm thấy sản phẩm nào khớp với bộ lọc.</Text>
            </Stack>
          ) : (
            <Table
              horizontalSpacing="md"
              verticalSpacing="sm"
              highlightOnHover
              withTableBorder
              withColumnBorders
              striped
            >
              <Table.Thead style={{ backgroundColor: '#f8f9fa' }}>
                <Table.Tr>
                  <Table.Th style={{ color: "#294b61" }}>Phân khu</Table.Th>
                  
                  <Table.Th style={{ color: "#294b61" }}>Loại công trình </Table.Th>
                   <Table.Th style={{ color: "#294b61" }}>Tên căn </Table.Th>
                    <Table.Th style={{ color: "#294b61" }}>Số tầng</Table.Th>


                  <Table.Th style={{ color: "#294b61" }}>Trạng Thái</Table.Th>


                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {results.map((item, index) => (
                  <Table.Tr
                    key={item.id || index}
                    onClick={() => handleRowClick(item)}
                    style={{
                      cursor: rowLoading === item.id ? 'wait' : 'pointer',
                      opacity: rowLoading === item.id ? 0.6 : 1,
                    }}
                  >
                    <Table.Td>
                      <Text style={{ fontSize: 10 }} color="#294b61">
                        {item.layer2}
                      </Text>
                    </Table.Td>
                   
                    <Table.Td>
                      <Text style={{ fontSize: 10 }} color="#294b61">{item.building_type
                      }</Text>
                    </Table.Td>
                     <Table.Td>
                      <Text style={{ fontSize: 10 }} color="#294b61">{item.layer3
                      }</Text>
                    </Table.Td>
                        <Table.Td>
                      <Text style={{ fontSize: 10 }} color="#294b61">{item.num_floor
                      }</Text>
                    </Table.Td>



                    <Table.Td>
                      <Badge
                        size="xs"
                        variant="filled"
                        style={{ color: 'white' }}
                        color={(() => {
                          const val = item.status_unit;

                          if (val == null) return "gray";
                          if (typeof val === "string" && val.toLowerCase() === "skip")
                            return "gray";

                          const status = typeof val === "string" ? val.trim().toUpperCase() : "";
                          switch (status) {
                            case "QUAN TÂM":
                              return "#b8893c";
                            case "ĐANG BÁN":
                              return "#3d6985";
                            case "ĐÃ ĐẶT CỌC":
                              return "#cc5c34";
                            case "ĐÃ BÁN":
                              return "#b32f1f";
                            default:
                              return "gray";
                          }
                        })()}
                      >
                        {(() => {
                          const val = item.status_unit;

                          if (val == null) return "không có";
                          if (typeof val === "string" && val.toLowerCase() === "skip")
                            return "không có";

                          return val;
                        })()}
                      </Badge>
                    </Table.Td>

                

                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </ScrollArea>

        <ModalItem
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          data={selectedItem}
          projectId={projectId}
        />
        <Group justify="flex-end" mt="md" pt="sm" style={{ borderTop: "1px solid #eee" }}>
          <Button
            variant="filled"
            onClick={onClose}
            style={{
              background: "#294b61",
              color: "#fff",
            }}
          >
            Đóng
          </Button>
        </Group>
      </Drawer>

    </>
  );
}
