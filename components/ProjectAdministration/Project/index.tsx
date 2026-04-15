"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { modals } from "@mantine/modals";
import { getListProject } from "../../../api/apigetlistProject";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import EditView from "./EditView";
import Image from "next/image"; // ✅ FIX dùng next/image

// ✅ TYPE CHUẨN
interface DataType {
  id: string;
  name: string;
  type: string;
  address: string;
  investor: string;
  overview_image: {
    url: string;
    thumbnail_url: string;
  } | null;
  rank: number;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = await getListProject({
        token,
        skip: 0,
        limit: 100,
      });

      // ✅ FIX any → DataType
      const users: DataType[] = result.data.map((user: DataType) => ({
        id: user.id,
        name: user.name,
        rank: user.rank,
        type: user.type,
        address: user.address,
        investor: user.investor,
        overview_image: user.overview_image || null,
      }));

      setData(users);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===========================
  // 🔥 MODAL EDIT
  // ===========================
  const openEditUserModal = (item: DataType) => {
    modals.openConfirmModal({
      title: (
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Chỉnh sửa dự án
        </div>
      ),
      children: <EditView id={item.id} onSearch={fetchData} />,
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
      render: (image: DataType["overview_image"]) => {
        if (!image) {
          return <span>Không có ảnh</span>;
        }

        const imgUrl = image.thumbnail_url || image.url;

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
      </Group>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={false}
        bordered
        rowKey="id"
      />

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </>
  );
}
