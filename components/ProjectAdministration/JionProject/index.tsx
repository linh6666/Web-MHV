"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { modals } from "@mantine/modals";
import { GetJoinProject } from "../../../api/apigetlistJoinProject";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { getListProject } from "../../../api/apigetlistProject";
import { getListRoles } from "../../../api/getlistrole";
// import AppSearch from "../../../common/AppSearch";
import { Badge, Group } from "@mantine/core";
import EditView from "./EditView";
import DeleteView from "./DeleteView";


interface DataType {
  id: string;
  project_id: string;
  role_id: string;
  request_message: string;
  created_at: string;
}

interface Project {
  id: string;   // UUID
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface JoinRequestResponse {
  data: DataType[];
}

export default function LargeFixedTable() {
  const token = localStorage.getItem("access_token") || "";

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UUID → string
  const [projectMap, setProjectMap] = useState<Record<string, string>>({});
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});

  // ===========================
  // 🔥 FETCH DATA CHÍNH
  // ===========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. LẤY DANH SÁCH PROJECT
      const projects = await getListProject({
        token,
        skip: 0,
        limit: 100,
      });

      const projMap: Record<string, string> = {};
      projects.data.forEach((p: Project) => {
        projMap[p.id] = p.name;
      });
      setProjectMap(projMap);

      // 2. LẤY DANH SÁCH ROLE
      const roles = await getListRoles({
        token,
        skip: 0,
        limit: 100,
      });

      const rMap: Record<string, string> = {};
      roles.data.forEach((r: Role) => {
        rMap[r.id] = r.name;
      });
      setRoleMap(rMap);

      // 3. LẤY REQUEST THEO MỖI PROJECT — DÙNG UUID
      const responses: JoinRequestResponse[] = await Promise.all(
        projects.data.map((proj: Project) =>
          GetJoinProject({
            token,
            project_id: proj.id, // 🟢 UUID đúng theo API
            skip: 0,
            limit: 100,
            lang: "vi",
          })
        )
      );

      // Gộp tất cả request
      const merged: DataType[] = responses.flatMap((res) => res.data);

      setData(merged);
    } catch (err) {
      console.error("Error", err);
      setError("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ===========================
  // 🔥 LẦN ĐẦU GỌI API
  // ===========================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===========================
  // 🔥 MỞ MODAL EDIT
  // ===========================
  const openEditModal = (item: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa yêu cầu</div>,
      children:  <EditView 
        id={item.id} 
        project_id={item.project_id}  // ✅ truyền thêm project_id
        onSearch={fetchData} 
      />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ===========================
  // 🔥 MỞ MODAL DELETE
  // ===========================
  const openDeleteModal = (item: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa yêu cầu</div>,
      children: <DeleteView idItem={[item.id]} onSearch={fetchData} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ===========================
  // ⭐ CẤU HÌNH CỘT BẢNG
  // ===========================
  const columns: ColumnsType<DataType> = [
    {
      title: "Tên dự án",
      dataIndex: "project_id",
      width: 180,
      fixed: "left",
      render: (id: string) => projectMap[id] || "-",
    },
    {
      title: "Vai trò",
      dataIndex: "role_id",
      width: 120,
      render: (id: string) => roleMap[id] || "-",
    },
    {
      title: "Tin nhắn",
      dataIndex: "request_message",
      width: 260,
    },
{
  title: "Trạng Thái",
  dataIndex: "status",
  width: 260,
  render: (value: string) => {
    const mapStatus: Record<
      string,
      { label: string; color: string }
    > = {
      pending: { label: "Đang chờ duyệt", color: "yellow" },
      approved: { label: "Đã được chấp nhận", color: "green" },
      rejected: { label: "Đã từ chối", color: "red" },
    };

    const { label, color } = mapStatus[value] || {};

    return <Badge color={color}>{label}</Badge>;
  },
},
    {
  title: "Thời gian tạo",
  dataIndex: "created_at",
  width: 160,
  render: (value: string) => {
    const date = new Date(value);

    const formatted = date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatted;
  },
},
{
  title: "Thời gian cập nhật",
  dataIndex: "updated_at",
  width: 160,
  render: (value: string) => {
    const date = new Date(value);

    const formatted = date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatted;
  },
},
    {
      title: "Hành động",
      width: 120,
      fixed: "right",
      render: (item: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="edit"
              color="success"
              onClick={() => openEditModal(item)}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="delete"
              color="danger"
              onClick={() => openDeleteModal(item)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  return (
    <>
         <Group
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* <AppSearch /> */}
      </Group>



      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={false}
        bordered
        rowKey="id"
      />

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </>
  );
}
