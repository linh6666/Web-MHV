"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table,Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListRoles } from "../../../api/apigetlistSystemPermission";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import { getListSystem } from "../../../api/apigetlistsystym";
import { getListPermisson } from "../../../api/apigetlistpermission";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
  id: string; // ✅ thêm id để dùng cho chỉnh sửa
  system_id: number;
  permission_id: number;
  description_vi: string;
//   description_en: string;
}
interface System {
  id: number | string;
  name?: string;
}

interface Permission {
  id: number | string;
  code?: string;
  permission_name?: string;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
   const [systemOptions, setSystemOptions] = useState<{ value: string; label: string }[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<{ value: string; label: string }[]>([]);
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
      const result = await getListRoles({ token, skip, limit: pageSize });
      const users = result.data.map((user: DataType) => ({
         ...user,
        key: user.id,
      }));
      setData(users);
      setTotal(result.total);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [token,currentPage]);

  useEffect(() => {
 const fetchSystems = async () => {
      try {
        const res = await getListSystem({ token: localStorage.getItem("accessToken") || "" });
        const data = res?.data || [];
        setSystemOptions(
          data.map((item: System) => ({
            value: item.id?.toString(),
            label: item.name ||  "Không có tên",
          }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách hệ thống:", error);
      }
    };

    const fetchPermissions = async () => {
      try {
        const res = await getListPermisson({ token: localStorage.getItem("accessToken") || "" });
        const data = res?.data || [];
        setPermissionOptions(
          data.map((item: Permission) => ({
            value: item.id?.toString(),
            label: item.code || item.permission_name || "Không có tên",
          }))
        );
      } catch (error) {
        console.error("Lỗi khi load danh sách quyền:", error);
      }
    };

    fetchData();
        fetchSystems();
    fetchPermissions();
  }, [fetchData]);

  // ✅ Hàm mở modal chỉnh sửa
  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa cấu hình</div>,
      children: <EditView id={role.id} onSearch={fetchData} />, // ✅ đổi fetchRoles → fetchData
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ✅ Định nghĩa cột bảng
const columns: ColumnsType<DataType> = [
  {
    title: "Tên vai trò",
    dataIndex: "system_id",
    key: "system_id",
    width: 30,
    render: (system_id: number) => {
      const system = systemOptions.find(
        (s) => s.value === system_id.toString()
      );
      return system ? system.label : `#${system_id}`;
    },
  },
  {
    title: "Chức năng",
    dataIndex: "permission_id",
    key: "permission_id",
    width: 90,
    render: (permission_id: number) => {
      const permission = permissionOptions.find(
        (p) => p.value === permission_id.toString()
      );
      return permission ? permission.label : `#${permission_id}`;
    },
  },
  {
    title: "Mô tả",
    dataIndex: "description_vi",
    key: "description_vi",
    width: 100,
  },
  // {
  //   title: "Mô tả (tiếng Anh)",
  //   dataIndex: "description_en",
  //   key: "description_en",
  //   width: 100,
  // },
  {
    title: "Hành động",
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
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            iconType="trash"
            aria-label="Xóa"
            color="danger"
            onClick={() => openDeleteUserModal(user)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
];

  // ✅ Modal thêm người dùng
  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm cấu hình mới</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

    const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa cấu hình</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  return (
    <>
      <Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* <AppSearch /> */}
          <div></div>
        <AppAction openModal={openModal} />
      </Group>

      <Table
        style={{ marginTop: 12 }}
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
