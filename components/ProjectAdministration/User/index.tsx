"use client";

import React, { useEffect, useState, useCallback } from "react";

import type { ColumnsType } from "antd/es/table";
import { Table, Pagination } from "antd";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";
import dayjs from "dayjs";
import { modals } from "@mantine/modals";
import { getListUser  } from "../../../api/apigetlistuse";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";
import { getListProvinces } from "../../../api/apigetlistaddress";
import { getWardsByProvince } from "../../../api/apigetlistProvinces";

interface DataType {
  key: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_superuser: boolean;
  province_id: string;
  ward_id: string;
  id: string;
  creation_time: string;
  last_login: string;
  last_logout: string;
}

interface ListRolesResponse {
  data: DataType[];
  total: number; // tổng số record
}

interface Province {
  code: string;
  full_name_vi: string;
}

interface Ward {
  code: string;
  full_name_vi: string;
}

export default function LargeFixedTable({}) {

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [provinceOptions, setProvinceOptions] = useState<{ value: string; label: string }[]>([]);
  const [wardOptions, setWardOptions] = useState<{ value: string; label: string }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; 

  const token = localStorage.getItem("access_token") || "YOUR_TOKEN_HERE";

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data: Province[] = await getListProvinces();
        const formatted = data.map((item) => ({
          value: item.code,
          label: item.full_name_vi,
        }));
        setProvinceOptions(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchAllWards = async () => {
      try {
        const provinceCodes = provinceOptions.map((p) => p.value);

        const results = await Promise.all(
          provinceCodes.map((code) => getWardsByProvince(code))
        );

        const allWards: { value: string; label: string }[] = results.flatMap((data: Ward[]) =>
          data.map((item: Ward) => ({
            value: item.code,
            label: item.full_name_vi,
          }))
        );

        setWardOptions(allWards);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phường/xã:", error);
        setWardOptions([]);
      }
    };

    if (provinceOptions.length) {
      fetchAllWards();
    }
  }, [provinceOptions]);

  // ✅ Sửa fetchData
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
      const result: ListRolesResponse = await getListUser({ token, skip, limit: pageSize });

      // Map dữ liệu, giữ toàn bộ thuộc tính, gán key riêng
      const users = result.data.map((user: DataType) => ({
        ...user,
        key: user.id,
      }));

      setData(users);
      setTotal(result.total);

      // Nếu trang hiện tại vượt tổng trang, lùi về trang cuối cùng
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

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm người dùng mới</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

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
      children: (
        <DeleteView
          idItem={[role.id]}
          onSearch={() => {
            fetchData();
          }}
        />
      ),
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const columns: ColumnsType<DataType> = [
    { title: "Họ và Tên", dataIndex: "full_name", key: "full_name", width: 150, fixed: "left" },
    { title: "Email", dataIndex: "email", key: "email", width: 130 },
    { title: "Điện Thoại", dataIndex: "phone", key: "phone", width: 130 },
    { title: "Kích Hoạt", dataIndex: "is_active", key: "is_active", width: 80, render: (text) => (text ? "Có" : "Không") },
    { title: "Quản Trị Viên", dataIndex: "is_superuser", key: "is_superuser", width: 100, render: (text) => (text ? "Có" : "Không") },
    {
      title: "Tỉnh/Thành Phố",
      dataIndex: "province_id",
      key: "province_id",
      width: 100,
      render: (id) => provinceOptions.find(p => p.value === id)?.label || "Chưa có"
    },
    {
      title: "Phường/Xã",
      dataIndex: "ward_id",
      key: "ward_id",
      width: 100,
      render: (id) => wardOptions.find(w => w.value === id)?.label || "Chưa có"
    },
    {
      title: "Thời Gian Tạo",
      dataIndex: "creation_time",
      key: "creation_time",
      width: 140,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    { title: "Lần Đăng Nhập Cuối", dataIndex: "last_login", key: "last_login", width: 140 },
    { title: "Lần Đăng Xuất Cuối", dataIndex: "last_logout", key: "last_logout", width: 140 },
    {
      title: "Hành Động",
      width: 100,
      fixed: "right",
      render: (record: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Chỉnh sửa"
              color="success"
              onClick={() => openEditUserModal(record)}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Xóa"
              color="danger"
              onClick={() => openDeleteUserModal(record)}
            />
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
        scroll={{ x: 2000 }}
        pagination={false}
        bordered
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
