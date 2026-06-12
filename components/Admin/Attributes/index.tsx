"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";
import { modals } from "@mantine/modals";
import { getListRoles } from "../../../api/apigetlistAttributes"; // endpoint returns attributes list
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
  id: string;
  label: string;
  data_type: string;
  display_label_vi: string;
  parent_attributes_id: string | null;
}

// API response shape
interface ListRolesResponse {
  data: DataType[];
  total: number;
}

export default function LargeFixedTable() {
  // Raw data from server
  const [data, setData] = useState<DataType[]>([]);
  // Data shown after search filtering
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError("⚠️ Không tìm thấy token. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }
    try {
      const result: ListRolesResponse = await getListRoles({ token, skip: 0, limit: 100 });
      const users = result.data.map((item: DataType) => ({ ...item, key: item.id }));
      setData(users);
      setFilteredData(users);
      setTotal(result.total);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } else {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load data once on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

// Client‑side filter based on search input and reset page
useEffect(() => {
  const keyword = searchText.toLowerCase().trim();
  if (!keyword) {
    setFilteredData(data);
    setCurrentPage(1);
    return;
  }
  const filtered = data.filter(item =>
    item.label?.toLowerCase().includes(keyword) ||
    item.data_type?.toLowerCase().includes(keyword) ||
    item.display_label_vi?.toLowerCase().includes(keyword) ||
    (item.parent_attributes_id && item.parent_attributes_id.toString().toLowerCase().includes(keyword))
  );
  setFilteredData(filtered);
  setCurrentPage(1);
}, [searchText, data]);

// Removed separate pagination adjustment effect




  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa thuộc tính</div>,
      children: <EditView id={role.id} onSearch={fetchData} />, 
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa thuộc tính</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData} />, 
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm thuộc tính mới</div>,
      children: <CreateView onSearch={fetchData} />, 
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const columns: ColumnsType<DataType> = [
    { title: "Định danh thuộc tính", dataIndex: "label", key: "label", width: 30 },
    { title: "Kiểu dữ liệu", dataIndex: "data_type", key: "data_type", width: 90 },
    { title: "Tên hiển thị", dataIndex: "display_label_vi", key: "display_label_vi", width: 100 },
    {
      title: "Tên dữ liệu cha",
      dataIndex: "parent_attributes_id",
      key: "parent_attributes_id",
      width: 100,
      render: (parent_attributes_id: string | null) => {
        if (!parent_attributes_id) return "-";
        const parent = data.find((item) => item.id === parent_attributes_id);
        return parent ? parent.label : `#${parent_attributes_id}`;
      },
    },
    {
      title: "Hành Động",
      width: 30,
      fixed: "right",
      render: (user: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Chỉnh sửa"
              color="success"
              onClick={() => openEditUserModal(user)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Xóa"
              color="danger"
              onClick={() => openDeleteUserModal(user)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  return (
    <>
      <Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <AppSearch value={searchText} onSearch={setSearchText} />
        <div />
        <AppAction openModal={openModal} />
      </Group>

      {/* Slice filtered data for current page */}
      {(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = filteredData.slice(start, end);
        return (
          <Table
            style={{ marginTop: 12 }}
            columns={columns}
            dataSource={pageData}
            loading={loading}
            pagination={false}
            bordered
            rowKey="id"
          />
        );
      })()}

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={filteredData.length}
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
