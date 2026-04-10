"use client";

import {
  Card,
  Text,
  Stack,
  Title,
  Group,
  ScrollArea,
  Badge,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getListOrder } from "../../../../api/apiGetlistOrder";
import { Getlisthome } from "../../../../api/apiGetListHome";
import { useRouter } from "next/navigation";
import { IconFolder } from "@tabler/icons-react";

/* =======================
   TYPES
======================= */
interface Project {
  id: string;
  name?: string;
}

interface Order {
  id: string;
  project_id: string;
  contract_url: string;
  unit_code: string;
  contract_code: string;
  order_status: string;
  order_date: string;
  total_price_at_sale_vi?: number | null;
}

interface Props {
  project: Project | null;
}

/* =======================
   STATUS MAP
======================= */
const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  pending: {
    label: "Đang chờ manager khóa căn hộ",
    color: "yellow",
  },
  pending_deposit: {
    label: "Đang chờ đơn thanh toán",
    color: "orange",
  },
  paying: {
    label: "ĐANG CHỜ ĐƠN THANH TOÁN",
    color: "orange",
  },
  completed: {
    label: "Đã thanh toán hoàn tất",
    color: "green",
  },
  cancelled: {
    label: "Đã hủy giao dịch",
    color: "red",
  },
  expired: {
    label: "Giao dịch không được duyệt - hết hạn",
    color: "gray",
  },
};

/* =======================
   COMPONENT
======================= */
export default function ProjectDetail({ project }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const router = useRouter();

  /* =======================
     FETCH ORDERS
  ======================= */
  useEffect(() => {
    if (!project?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getListOrder(project.id);
        setOrders(res.items || []);
        setTotalOrder(res.total || 0);
      } catch (error) {
        console.error("Lỗi lấy danh sách order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [project?.id]);

  /* =======================
     FETCH IMAGES
  ======================= */
  useEffect(() => {
    if (!project?.id || orders.length === 0) return;

    const fetchImages = async () => {
      const map: Record<string, string> = {};

      await Promise.all(
        orders.map(async (order) => {
          try {
            const res = await Getlisthome({
              project_id: project.id,
              unit_code: order.unit_code,
            });

            map[order.id] = res?.[0]?.url || "/no-image.png";
          } catch {
            map[order.id] = "/no-image.png";
          }
        })
      );

      setImageMap(map);
    };

    fetchImages();
  }, [project?.id, orders]);

  if (!project) return null;

  return (
    <div>
      {/* HEADER */}
      <Group justify="space-between" align="center">
        <Title order={4}>Danh sách đơn hàng</Title>
        <Text fw={500}>
          Số lượng: {loading ? "..." : totalOrder}
        </Text>
      </Group>

      {/* LIST */}
      <ScrollArea
        h={630}
        mt="sm"
        p="md"
        styles={{
          scrollbar: { backgroundColor: "#f1f3f5" },
          thumb: {
            backgroundColor: "#ffbe00",
            borderRadius: 8,
          },
        }}
      >
        <Stack gap="md">
          {loading && <Text>Đang tải dữ liệu...</Text>}
          {!loading && orders.length === 0 && (
            <Text c="dimmed">Không có order nào</Text>
          )}

          {!loading &&
            orders.map((order) => {
              const status =
                ORDER_STATUS_MAP[order.order_status] || {
                  label: order.order_status,
                  color: "gray",
                };

              return (
                <Card
                  key={order.id}
                  withBorder
                  radius="lg"
                  p="md"
                  bg="#ffffff"
                  style={{ cursor: "pointer" }}
                   onClick={() =>
                      router.push(
    `/chi-tiet-don/${order.id}?project_id=${order.project_id}`
  )
                  }
                >
                 <Group wrap="nowrap" align="stretch">
                    {/* IMAGE */}
                    <Image
                      src={imageMap[order.id] || "/no-image.png"}
                      alt={order.unit_code}
                      width={170}
                      height={0}
                      style={{
                        borderRadius: 10,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />

                    {/* CONTENT LEFT */}
                    <Stack gap={6} style={{ flex: 1 }}>
                      <Text fw={700} size="md">
                        {order.unit_code}
                      </Text>

                      <Text size="sm" c="dimmed">
                        Dự án {project.name || "—"}
                      </Text>

                      <Text fw={600}>
                        {order.total_price_at_sale_vi
                          ? order.total_price_at_sale_vi.toLocaleString(
                              "vi-VN"
                            )
                          : "—"}{" "}
                        VND
                      </Text>

                      <Text size="sm">
                        Mã đơn hàng:{" "}
                        <Text span fw={500}>
                          {order.contract_code}
                        </Text>
                      </Text>
                    </Stack>

                    {/* RIGHT COLUMN */}
                    <Stack gap={6} align="flex-end">
                      {/* BADGE */}
                      <Badge
                        color={status.color}
                        variant="light"
                        radius="xl"
                      >
                        {status.label}
                      </Badge>

                      {/* ICON FOLDER */}
                      {order.contract_url && (
                        <IconFolder
                          size={70}
                          stroke={1.8}
                          color="#c0c0c0"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              order.contract_url,
                              "_blank"
                            );
                          }}
                        />
                      )}

                      {/* TIME */}
                      <Text size="xs" c="dimmed">
                        {new Date(
                          order.order_date
                        ).toLocaleString("vi-VN")}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              );
            })}
        </Stack>
      </ScrollArea>
    </div>
  );
}
