"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListProject } from "../../../api/apigetlistProject";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";
import Image from "next/image";

// ===========================
// ✅ TYPE
// ===========================

interface OverviewImage {
  url: string;
  thumbnail_url: string;
}

interface ProjectItem {
  id: string;
  name: string;
  type: string;
  address: string;
  investor: string;
  overview_image: OverviewImage | null;
  rank: number;
}

interface DataType {
  id: string;
  name: string;
  type: string;
  address: string;
  investor: string;
  overview_image: OverviewImage | null;
  rank: number;
}

interface ApiResponse {
  data: ProjectItem[];
  total: number;
}

// ===========================
// COMPONENT
// ===========================

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  // Search state for AppSearch
  const [searchText, setSearchText] = useState<string>("");
  // Filtered data based on searchText (search by name, type, address, investor)
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.type.toLowerCase().includes(lower) ||
        item.address.toLowerCase().includes(lower) ||
        item.investor.toLowerCase().includes(lower)
    );
  }, [data, searchText]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  // ===========================
  // 🔥 FETCH DATA
  // ===========================

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

      const result: ApiResponse = await getListProject({
        token,
        skip,
        limit: pageSize,
      });

      const users: DataType[] = result.data.map((user: ProjectItem) => ({
        id: user.id,
        name: user.name,
        type: user.type,
        address: user.address,
        investor: user.investor,
        rank: user.rank,
        overview_image: user.overview_image || null,
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
  }, [token, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===========================
  // 🔥 MODALS
  // ===========================

  const openEditUserModal = (item: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa dự án</div>,
      children: <EditView id={item.id} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openDeleteUserModal = (item: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa dự án</div>,
      children: <DeleteView idItem={[item.id]} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm dự án mới</div>,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ===========================
  // 🔥 COLUMNS
  // ===========================

  const columns: ColumnsType<DataType> = [
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: "Loại dự án",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "Chủ đầu tư",
      dataIndex: "investor",
      key: "investor",
      width: 150,
    },
    {
      title: "Hình ảnh",
      dataIndex: "overview_image",
      key: "overview_image",
      width: 160,
      render: (image: OverviewImage | null) => {
        if (!image) return <span>Không có ảnh</span>;

        const imgUrl = (image.thumbnail_url || image.url).replace(
          "http://",
          "https://"
        );

        return (
          <Image
            src={imgUrl}
            alt="overview"
            width={130}
            height={70}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          />
        );
      },
    },
    {
      title: "Hành động",
      width: 100,
      fixed: "right",
      render: (item: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Chỉnh sửa"
              color="success"
              onClick={() => openEditUserModal(item)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Xóa"
              color="danger"
              onClick={() => openDeleteUserModal(item)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  // ===========================
  // 🔥 UI
  // ===========================

  return (
    <>
      <Group
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: 12 }}></div>
        <AppSearch value={searchText} onSearch={(value) => setSearchText(value)} />
        <AppAction openModal={openModal} />
      </Group>

      <Table
        style={{ marginTop: 12 }} 
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={false}
        bordered
        rowKey="id"
      />

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
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