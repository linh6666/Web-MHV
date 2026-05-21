"use client";

import React from "react";
import { Drawer, Text, ScrollArea, Group, Stack, Badge, Button, Table } from "@mantine/core";
import { IconInfoCircle, } from "@tabler/icons-react";


interface UnitResult {
  id?: number | string;
  unit_code?: string;
  leaf_id?: string;
  building_type?: string;
  zone?: string;
  layer4?: string;
  layer3?: string;
  status_unit?: string;
  bedroom?: string | number;
  direction?: string;
  main_door_direction?: string;
}

interface SearchResultModalProps {
  opened: boolean;
  onClose: () => void;
  results: UnitResult[];
}

export default function SearchResultModal({
  opened,
  onClose,
  results,
}: SearchResultModalProps) {

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


                  <Table.Th style={{ color: "#294b61" }}>Trạng Thái</Table.Th>


                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {results.map((item, index) => (
                  <Table.Tr key={item.id || index}>
                    <Table.Td>
                      <Text style={{ fontSize: 12 }} color="#294b61">
                        {item.zone}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text style={{ fontSize: 12 }} color="#294b61">{item.building_type
                      }</Text>
                    </Table.Td>



                    <Table.Td>
                      <Badge
                        size="xs"
                        variant="outline"
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

                    {/* <Table.Td>
                      <Text size="xs">
                        {(() => {
                           const val = item.direction || item.main_door_direction;
                           if (!val || val.toLowerCase() === 'skip') return 'không có';
                           return val;
                        })()}
                      </Text>
                    </Table.Td> */}

                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </ScrollArea>

        <Group
          justify="flex-end"
          mt="md"
          pt="sm"
          style={{ borderTop: "1px solid #eee" }}
        >
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
