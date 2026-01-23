"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import AppAction from "../../../common/AppAction";
// import { modals } from "@mantine/modals";
import { getListOrder } from "../../../api/apiGetlistOrder";
import { getListProject } from "../../../api/apigetlistProject";
// import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Badge, Group, Select } from "@mantine/core";
// import CreateView from "./CreateView";
import axios from "axios";
// import EditView from "./EditView";
// import DeleteView from "./DeleteView";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import { getListUser } from "../../../api/apigetlistuse";
import { api } from "../../../libray/axios";
import { NotificationExtension } from "../../../extension/NotificationExtension";

interface DataType {
  id: string;
  contract_code: string;
  contract_url: string;
  fully_paid_date: string;
  order_date: string;
order_status: string;
project_id: string;
seller_id: string;
unit_code: string;
total_price_at_sale_en
: number;
total_price_at_sale_vi: number;

id_cccd
: string;
customer_id
: string;



}

interface ProjectTemplate {
  id: string | number;
  name?: string;
  template_name?: string;
}

interface TemplateAttributeLink {
  id: string | number;
  contract_code: string;
  contract_url: string;
  fully_paid_date: string;
  order_date: string;
order_status: string;
project_id: string;
seller_id: string;
unit_code: string;
total_price_at_sale_en
: number;
total_price_at_sale_vi: number;

id_cccd
: string;
customer_id
: string;
}

interface Attribute {
  id: string | number;
  full_name?: string;
  attribute_name?: string;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; 
  // dropdown mẫu dự án
  const [templateOptions, setTemplateOptions] = useState<{ value: string; label: string }[]>([]);
  // dropdown thuộc tính
  const [attributeOptions, setAttributeOptions] = useState<{ value: string; label: string }[]>([]);

  const token = localStorage.getItem("access_token") || "";

  const downloadContract = async (url: string) => {
  try {
    const response = await api.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "hop-dong.pdf"; // có thể đổi tên
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download contract error:", error);
  }
};


  // ============================================================
  // 🔹 1️⃣ Gọi API lấy danh sách template
  // ============================================================
const fetchTemplateList = useCallback(async () => {
  try {
    const res = await getListProject({
      token,
      skip: 0,
      limit: 100,
    });

    const data: ProjectTemplate[] = res.data || [];

    const options = data
      .filter(
        (item): item is ProjectTemplate & { name: string } =>
          typeof item.name === "string" &&
          item.name.trim() !== ""
      )
      .map((item) => ({
        value: item.id.toString(),
        label: item.name, // ✅ chắc chắn là string
      }));

    setTemplateOptions(options);
  } catch (err) {
    console.error("Lỗi khi load danh sách template:", err);
    setTemplateOptions([]);
  }
}, [token]);


  // ============================================================
  // 🔹 2️⃣ Gọi API lấy danh sách thuộc tính
  // ============================================================
  const fetchAttributeList = useCallback(async () => {
    try {
      const res = await  getListUser({ token, skip: 0, limit: 100 });
      const data: Attribute[] = res.data || [];

      const options = data.map((item) => ({
        value: item.id.toString(),
        label: item.full_name || item.attribute_name || `Thuộc tính ${item.id}`,
      }));
      setAttributeOptions(options);
    } catch (err) {
      console.error("Lỗi khi load danh sách thuộc tính:", err);
      setAttributeOptions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplateList();
    fetchAttributeList();
  }, [fetchTemplateList, fetchAttributeList]);

  // ============================================================
  // 🔹 3️⃣ Gọi API lấy dữ liệu bảng
  // ============================================================
const fetchAttributes = useCallback(async () => {
  if (!templateId) {
    setData([]);
    setTotal(0);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const res = await getListOrder(templateId, { token });

    const data: TemplateAttributeLink[] = res.items || [];

    if (data.length === 0) {
      setData([]);
      setTotal(0);

      NotificationExtension.Warn(
        "Dự án này hiện chưa có đơn hàng"
      );

      return;
    }

    const rows: DataType[] = data.map((item) => ({
      id: item.id.toString(),
      contract_code: item.contract_code,
      contract_url: item.contract_url,
      fully_paid_date: item.fully_paid_date,
      order_date: item.order_date,
      order_status: item.order_status,
      project_id: item.project_id,
      seller_id: item.seller_id,
      unit_code: item.unit_code,
      total_price_at_sale_en: item.total_price_at_sale_en,
      total_price_at_sale_vi: item.total_price_at_sale_vi,
      id_cccd: item.id_cccd,
      customer_id: item.customer_id,
    }));

    setData(rows);
    setTotal(res.total);
  } catch (err: unknown) {
  let message = "Có lỗi xảy ra khi tải đơn hàng";

  if (axios.isAxiosError(err)) {
    message = err.response?.data?.detail || message;
  }

  setData([]);
  setTotal(0);

  NotificationExtension.Fails(message);
} finally {
    setLoading(false);
  }
}, [templateId, token]);


  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  // ============================================================
  // 🔹 4️⃣ Cột bảng
  // ============================================================
  const columns: ColumnsType<DataType> = [

       {
  title: "Dự án",
  dataIndex: "project_id",
  width: 70,
  fixed: "left",
  render: (text: string) => (
    <span>{templateOptions.find((option) => option.value === text)?.label || "Không có tên"}</span>
  ),
},
{
  title: "Người bán",
  dataIndex: "seller_id",
  width: 70,
     render: (text: string) => (
        <span>{attributeOptions.find((option) => option.value === text)?.label || "Không có tên"}</span>
      ),

},
 {
  title: "Khách hàng",
  dataIndex: "customer_id",
  width: 70,
     render: (text: string) => (
        <span>{attributeOptions.find((option) => option.value === text)?.label || "Không có tên"}</span>
      ),

},

   {
  title: "Mã hợp đồng",
  dataIndex: "contract_code",
  width: 70,

},
{
  title: "Căn hộ",
  dataIndex: "unit_code",
  width: 50,
},
{
  title: "Tổng giá bán (VNĐ)",
  dataIndex: "total_price_at_sale_vi",
  width: 90,
  align: "right",
  render: (value: number) =>
    typeof value === "number"
      ? value.toLocaleString("vi-VN") + " ₫"
      : "-",
},

 {
  title: "Tổng giá bán (USD)",
  dataIndex: "total_price_at_sale_en",
  width: 90,
  align: "right",
  render: (value: number) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : "-",
},

{
  title: "Số CCCD/CMND",
  dataIndex: "id_cccd",
  width: 100,
},
{
  title: "Ngày thanh toán đủ",
  dataIndex: "fully_paid_date",
  width: 100,
  render: (value: string) => {
    if (!value) return "-";

    const date = new Date(value);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
},

{
  title: "Ngày đặt hàng",
  dataIndex: "order_date",
  width: 100,
  render: (value: string) => {
    if (!value) return "-";

    const date = new Date(value);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
},
{
  title: "Trạng thái",
  dataIndex: "order_status",
  width: 130,
  render: (status: string) => {
    const statusConfig: Record<
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
        label: "Đang thanh toán",
        color: "blue",
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

    const config = statusConfig[status];

    return config ? (
      <Badge color={config.color} variant="light">
        {config.label}
      </Badge>
    ) : (
      "-"
    );
  },
},
{
  title: "Tài liệu",
  dataIndex: "contract_url",
  width: 80,
       fixed: "right",
  render: (url: string) =>
    url ? (
      <a
        onClick={() => downloadContract(url)}
        style={{
          color: "#1677ff",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <IconDownload size={16} />
        Tài liệu
      </a>
    ) : (
      "-"
    ),
},
    // {
    //   title: "Hành động",
    //   width: 60,
    //   fixed: "right",
    //   render: (record: DataType) => (
    //     <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
    //       <EuiFlexItem grow={false}>
    //         <EuiButtonIcon
    //           iconType="documentEdit"
    //           aria-label="Chỉnh sửa"
    //           color="success"
    //           onClick={() => openEditUserModal(record)}
    //         />
    //       </EuiFlexItem>
    //       <EuiFlexItem grow={false}>
    //         <EuiButtonIcon
    //           iconType="trash"
    //           aria-label="Xóa"
    //           color="danger"
    //           onClick={() => openDeleteUserModal(record)}
    //         />
    //       </EuiFlexItem>
    //     </EuiFlexGroup>
    //   ),
    // },
  ];

  // ============================================================
  // 🔹 5️⃣ Các modal CRUD
  // ============================================================

  // const openEditUserModal = (record: DataType) => {
  //   modals.openConfirmModal({
  //     title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa</div>,
  //     children: <EditView id={record.id} onSearch={fetchAttributes} />,
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });
  // };

  // const openDeleteUserModal = (record: DataType) => {
  //   modals.openConfirmModal({
  //     title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa</div>,
  //     children: <DeleteView idItem={[record.id]} onSearch={fetchAttributes} />,
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });
  // };

  // ============================================================
  // 🔹 6️⃣ Render giao diện
  // ============================================================
  return (
    <>
      <Group justify="space-between" align="center">
        <Select
          label="Chọn dự án để duyệt đơn hàng"
          placeholder="Chọn dự án mẫu"
          data={templateOptions}
          value={templateId}
        onChange={(value) => {
  setTemplateId(value || "");
  setData([]);        // reset bảng
  setTotal(0);        // reset tổng
  setCurrentPage(1);  // reset trang
}}
          rightSection={<IconChevronDown size={16} />}
          withAsterisk
          clearable
          mb="md"
        />
        {/* <AppAction openModal={openModal} /> */}
      </Group>

      <Table 
       scroll={{ x: 2000 }}
      columns={columns} 
      dataSource={data} 
      loading={loading} 
      pagination={false} 
      bordered rowKey="id" />

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
       <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          showQuickJumper={false}
        />
      </div>
    </>
  );
}
