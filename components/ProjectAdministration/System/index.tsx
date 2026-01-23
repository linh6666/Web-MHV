"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListSystem } from "../../../api/apigetlistsystym";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiToolTip } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
  id: string;
  name: string;
  rank_total: number;
  description_vi: string;
}

// Interface API trả về
// interface ListSystemResponse {
//   data: DataType[];
//   count: number; // property count từ API
// }

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0); // tổng số record từ server
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
   console.error("Lỗi khi tải dữ liệu:", error);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const token = localStorage.getItem("access_token") || "YOUR_TOKEN_HERE";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("⚠️ Không tìm thấy token. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    try {
      const skip = (currentPage - 1) * pageSize;
      const result = await getListSystem({ token, skip, limit: pageSize });

      // Cập nhật dữ liệu và tổng số record
      setData(result.data);
    setTotal(result.total); 
      const totalPages = Math.ceil(result.total / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal chỉnh sửa
  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa vai trò</div>,
      children: <EditView id={role.id} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // Modal xóa
  const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa vai trò</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // Modal thêm
  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm vai trò mới</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // Columns bảng
  const columns: ColumnsType<DataType> = [
    { title: "Tên vai trò ", dataIndex: "name", key: "name", width: 30 },
{
  title: "Cấp Bậc",
  dataIndex: "rank_total",
  key: "rank_total",
  width: 90,
  sorter: (a, b) => a.rank_total - b.rank_total,  // thêm vào đây
},
    { title: "Mô Tả ", dataIndex: "description_vi", key: "description_vi", width: 100 },
    {
      title: "Hành Động",
      width: 30,
      fixed: "right",
      render: (user: DataType) => (
       <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
  <EuiFlexItem grow={false}>
    <EuiToolTip content="Chỉnh sửa">
      <EuiButtonIcon
        iconType="documentEdit"
        aria-label="Chỉnh sửa"
        color="success"
        onClick={() => openEditUserModal(user)}
      />
    </EuiToolTip>
  </EuiFlexItem>

  <EuiFlexItem grow={false}>
    <EuiToolTip content="Xóa">
      <EuiButtonIcon
        iconType="trash"
        aria-label="Xóa"
        color="danger"
        onClick={() => openDeleteUserModal(user)}
      />
    </EuiToolTip>
  </EuiFlexItem>
</EuiFlexGroup>

      ),
    },
  ];

  return (
    <>
      <Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <AppSearch />
        <AppAction openModal={openModal} />
      </Group>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        bordered
        rowKey="id"
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={total} // dùng count từ server
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
