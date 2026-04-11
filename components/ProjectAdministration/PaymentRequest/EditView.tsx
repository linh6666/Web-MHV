"use client";

import {
  Box,
  LoadingOverlay,
  Badge,
  Text,
  Group,
  Stack,
  Textarea,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useCallback, useState } from "react";
import { getListOrder } from "../../../api/apiGetlistOrder";
import { getOrderPaymentByOrderId } from "../../../api/apiGetlistdetailOder";
import { updateOrderPayment } from "../../../api/apiUpdateOrderPayment";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { NotificationExtension } from "../../../extension/NotificationExtension";



interface EditViewProps {
  id: string; // project_id
}

interface OrderDataType {
  id: string; // order id
  contract_code: string;
  contract_url?: string;
  unit_code: string;
  total_price_at_sale_vi: number;
  order_date: string;
  order_status: string;
  manager_status?: string;
  customer_name: string;
  customer_phone: string;
  seller_name: string;
  payment_id?: string; // 🔥 ID của bản ghi thanh toán cần duyệt
}

const EditView = ({ id }: EditViewProps) => {

  const [data, setData] = useState<OrderDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token") || "";

  const fetchOrders = useCallback(async () => {
    if (!id || !token) return;
    setLoading(true);
    try {
      const res = await getListOrder(id, { token });
      const orders = res.items || [];

      // 🔥 Enrich orders with manager_status from detail API
      const enrichedOrders = await Promise.all(
        orders.map(async (order: OrderDataType) => {
          try {
            const detailRes = await getOrderPaymentByOrderId(order.id, id);
            const detail = detailRes?.items?.[0] || {};
            return {
              ...order,
              manager_status: detail.manager_status || order.order_status,
              payment_id: detail.id, // 🔥 Lưu lại ID thanh toán
            };
          } catch (error) {
            console.error(`Lỗi khi lấy chi tiết đơn ${order.id}:`, error);
            return order;
          }
        })
      );

      setData(enrichedOrders);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (payment_id: string, status: "approved" | "rejected", message: string = "") => {
    try {
      setLoading(true);
      const res = await updateOrderPayment(payment_id, id, { 
        status,
        note: message,
      });
      
      NotificationExtension.Success(res?.message || `Đã ${status === "approved" ? "duyệt" : "từ chối"} yêu cầu thành công.`);
      fetchOrders(); // Refresh table
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      const err = error as { response?: { data?: { detail?: string } } };
      NotificationExtension.Fails(err?.response?.data?.detail || "Không thể cập nhật trạng thái yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (payment_id: string, status: "approved" | "rejected") => {
    let messageValue = "";
    
    modals.openConfirmModal({
      title: <Text fw={700} size="lg">{status === "approved" ? "Duyệt yêu cầu" : "Từ chối yêu cầu"}</Text>,
      children: (
        <Stack gap="sm">
          <Text size="sm">
            Bạn có chắc chắn muốn {status === "approved" ? "duyệt" : "từ chối"} yêu cầu này không?
          </Text>
          <Textarea
            label="Phản hồi (không bắt buộc)"
            placeholder="Nhập nội dung phản hồi..."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => (messageValue = e.currentTarget.value)}
            minRows={3}
          />
        </Stack>
      ),
      labels: { confirm: "Xác nhận", cancel: "Hủy bỏ" },
      confirmProps: { color: status === "approved" ? "green" : "red" },
      onConfirm: () => handleStatusUpdate(payment_id, status, messageValue),
    });
  };

  const columns: ColumnsType<OrderDataType> = [
    {
      title: "Căn hộ",
      dataIndex: "unit_code",
      key: "unit_code",
      width: 100,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (record: OrderDataType) => (
        <Box>
          <Text size="sm" fw={500}>{record.customer_name || "N/A"}</Text>
          <Text size="xs" c="dimmed">{record.customer_phone || "N/A"}</Text>
        </Box>
      ),
    },
    {
      title: "Mã hợp đồng",
      key: "contract",
      width: 150,
      render: (record: OrderDataType) => (
        <Group gap="xs">
          <Text size="sm">{record.contract_code || "N/A"}</Text>
        </Group>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Giá bán",
      dataIndex: "total_price_at_sale_vi",
      key: "total_price_at_sale_vi",
      align: "right",
      width: 150,
      render: (num: number) => num?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "manager_status",
      key: "manager_status",
      width: 150,
      render: (status: string) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
          pending: { label: "Chờ duyệt", color: "yellow" },
          approved: { label: "Đã duyệt", color: "green" },
          granted: { label: "Đã duyệt", color: "green" },
          rejected: { label: "Từ chối", color: "red" },
        };
        const config = statusConfig[status] || { label: status || "N/A", color: "gray" };
        return <Badge color={config.color} variant="filled">{config.label}</Badge>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (record: OrderDataType) => (
        <Group gap="xs">
          
          {record.manager_status === "pending" && record.payment_id && (
            <>
              <Tooltip label="Duyệt yêu cầu">
                <ActionIcon 
                  color="green" 
                  variant="light" 
                  onClick={() => openConfirmModal(record.payment_id!, "approved")}
                >
                  <IconCheck size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Từ chối yêu cầu">
                <ActionIcon 
                  color="red" 
                  variant="light"
                  onClick={() => openConfirmModal(record.payment_id!, "rejected")}
                >
                  <IconX size={18} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      ),
    },
  ];

  return (
    <Box pos="relative" w="100%">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Box>
  );
};

export default EditView;


