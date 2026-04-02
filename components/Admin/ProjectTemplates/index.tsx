"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListProjectTemplates } from "../../../api/apiProjectTemplates";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
  id: string; // ✅ thêm id để dùng cho chỉnh sửa
 type_vi:string;
  type_en:string;
  
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
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
      const result = await getListProjectTemplates({ token, skip, limit: pageSize });
      const users = result.data.map((user: DataType) => ({
      ...user,
        key: user.id,
       
      }));
      setData(users);
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
  }, [token,currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Hàm mở modal chỉnh sửa
  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa loại dự án</div>,
      children: <EditView id={role.id} onSearch={fetchData} />, // ✅ đổi fetchRoles → fetchData
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ✅ Định nghĩa cột bảng
  const columns: ColumnsType<DataType> = [
    { title: "Loai dự án", dataIndex: "type_vi", key: "type_vi", width: 30 },
  
   
    // { title: "Loai dự án (Tiếng Anh)", dataIndex: "type_en", key: "type_en", width: 100 },
    {
      title: "Hành Động",
      width: 30,
      fixed: "right",
      render: (user: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            {/* ✅ truyền đúng user vào onClick */}
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Chỉnh sửa"
              color="success"
              onClick={() => openEditUserModal(user)}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon iconType="trash" aria-label="Xóa" color="danger" onClick={() => openDeleteUserModal(user)} />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  // ✅ Modal thêm người dùng
  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm Loại dự án</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

    const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa loại dự án</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  return (
    <>
      <Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* <AppSearch /> */}
        <AppAction openModal={openModal} />
      </Group>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        bordered
        rowKey="id" // ✅ thêm key cho mỗi hàng
      />

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
