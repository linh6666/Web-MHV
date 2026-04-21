"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListRoless } from "../../../api/apiUserProjectRole";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
  id: string;
  role_name: string;
  project_name: string;
  user_email?: string;
  role_id?: string;
}

export default function LargeFixedTable() {
  const [allData, setAllData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const token = localStorage.getItem("access_token") || "";

  // ✅ FIX: dùng useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("⚠️ Không tìm thấy token. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    try {
      const result = await getListRoless({ token });

      const users = result.assignments.map((item: DataType) => ({
        ...item,
        key: item.id,
      }));

      setAllData(users);
      setTotal(result.total);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ FIX: thêm fetchData vào dependency
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ phân trang client
  const paginatedData = allData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ===== MODALS =====
  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa người dùng</div>,
      children: <EditView id={role.id} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa vai trò</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm người dùng mới</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ===== TABLE =====
  const columns: ColumnsType<DataType> = [
    { title: "Tên hệ thống", dataIndex: "role_name", key: "role_name" },
    { title: "Dự án", dataIndex: "project_name", key: "project_name" },
    { title: "Email", dataIndex: "user_email", key: "user_email" },
    {
      title: "Hành động",
      fixed: "right",
      render: (user: DataType) => (
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Edit"
                  color="success"
              onClick={() => openEditUserModal(user)}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Delete"
              color="danger"
              onClick={() => openDeleteUserModal(user)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  return (
    <>
      <Group justify="space-between" mb={12}>
        {/* <AppSearch /> */}
        <div></div>
        <AppAction openModal={openModal} />
      </Group>

      {/* ✅ FIX lỗi unused error */}
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      <Table
      
        columns={columns}
        dataSource={paginatedData}
        loading={loading}
        pagination={false}
        rowKey="id"
        bordered
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
