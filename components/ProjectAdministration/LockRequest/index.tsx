"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import AppSearch from "../../../common/AppSearch";
import { modals } from "@mantine/modals";
import { getListProject } from "../../../api/apigetlistProject";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group, Indicator } from "@mantine/core";
import EditView from "./EditView";
import { getListOrder } from "../../../api/apiGetlistOrder";



interface DataType {
  id: string;
  name: string;
  type: string;
  address: string;
  investor: string;
  overview_image: string;
  rank: number;
  notification_count?: number; // Thêm trường count nếu có
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const token = localStorage.getItem("access_token") || "YOUR_TOKEN_HERE";

  // ===========================
  // 🔥 FETCH DATA CÓ THÊM LANG
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

      // Lấy danh sách project cơ bản
      const projects = result.data.map((user: DataType) => ({
        id: user.id,
        name: user.name,
        rank: user.rank,
        type: user.type,
        address: user.address,
        investor: user.investor,
        overview_image: user.overview_image,
        notification_count: 0,
      }));

      setData(projects);

      // 🔥 FETCH COUNT THỰC TẾ CHO TỪNG PROJECT
      const projectsWithCounts = await Promise.all(
        projects.map(async (p: DataType) => {
          try {
            const orders = await getListOrder(p.id, { token });
            return { ...p, notification_count: orders.total || 0 };
          } catch (e) {
            console.error(`Lỗi lấy count cho project ${p.id}:`, e);
            return p;
          }
        })
      );

      setData(projectsWithCounts);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [token]); // ⬅️ tự động load lại khi đổi language

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===========================
  // 🔥 MỞ MODAL EDIT
  // ===========================
const openEditUserModal = (role: DataType) => {
  modals.openConfirmModal({
    title: 
      <div style={{ fontWeight: 600, fontSize: 18 }}>
        Danh sách duyệt yêu cầu
      </div>
    ,
    children: (
      <EditView
        id={role.id}
      />
    ),
    size: 1200,
    confirmProps: { display: "none" },
    cancelProps: { display: "none" },
  });
};


  const columns: ColumnsType<DataType> = [
    {
      title:  "Tên dự án" ,
      dataIndex: "name",
      key: "name",
      width: 7,
    //   fixed: "left",
    },
    {
      title:  "Loại dự án" ,
      dataIndex: "type",
      key: "type",
      width: 7,
    },
    {
      title:  "Địa chỉ" ,
      dataIndex: "address",
      key: "address",
      width: 7,
    },
   
    {
      title:  "Hình ảnh" ,
      dataIndex: "overview_image",
      key: "overview_image",
      width:40,
      render: (url: string) => (
        <img
          src={url}
          alt="overview"
          style={{ width: 130, height: 70, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },

    {
      title:"Hành động" ,
      width: 5,
        // fixed: "right",
      render: (user: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <Indicator 
              label={user.notification_count} 
              size={18} 
              offset={2}
              position="top-end"
              color="red"
              withBorder
              disabled={!user.notification_count}
            >
              <EuiButtonIcon
                iconType="bell"
                aria-label="Thông báo"
                color="primary"
                onClick={() => openEditUserModal(user)}
              />
            </Indicator>
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

        {/* 🔥 SELECT LANG */}
        <div style={{ marginBottom: 12 }}>
         
        </div>
      </Group>

      {/* 🔥 TABLE */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        // scroll={{ x:900 }}
        pagination={false}
        bordered
        rowKey="id"
      />

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </>
  );
}


