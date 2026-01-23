"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";

import { modals } from "@mantine/modals";
import { getListProject } from "../../../api/apigetlistProject";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";

interface DataType {
    id: string; // ✅ thêm id để dùng cho chỉnh sửa
  name: string;
  type: string;
  address: string;
  investor: string;
  image_url: string;
  rank: number;

//   description_en: string;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
   const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; 

    // const [language, setLanguage] = useState<"vi" | "en">("vi");

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
      const result = await getListProject({ token, skip, limit: pageSize, });
      const users = result.data.map((user: DataType) => ({
  ...user,
        key: user.id,
        // description_en: user.description_en,
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
  }, [token,currentPage, ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Hàm mở modal chỉnh sửa
  const openEditUserModal = (role: DataType) => {
    modals.openConfirmModal({
       title: 
      <div style={{ fontWeight: 600, fontSize: 18 }}>
       Chỉnh sửa dự án
      </div>
    ,
      children: <EditView id={role.id} onSearch={fetchData}     />, // ✅ đổi fetchRoles → fetchData
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ✅ Định nghĩa cột bảng
  const columns: ColumnsType<DataType> = [
       {  title:  "Tên dự án" , dataIndex: "name", key: "name", width: 5 ,fixed: "left"},
    { title:  "Loại dự án" , dataIndex: "type", key: "type", width: 5 },
    { title:  "Địa chỉ" , dataIndex: "address", key: "address", width: 5 },
    {title:  "Chủ đầu tư" , dataIndex: "investor", key: "investor", width: 5 },
     {
      title:  "Hình ảnh" ,
      dataIndex: "overview_image",
      key: "overview_image",
      width: 5,
      render: (url: string) => (
        <img
          src={url}
          alt="overview"
          style={{ width: 130, height: 70, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title:  "Cấp bậc" ,
      dataIndex: "rank",
      key: "rank",
      width: 2,
    },
   
    // { title: "Mô Tả (Tiếng Anh)", dataIndex: "description_en", key: "description_en", width: 100 },
   
   
    {
     title:  "Hành động" ,
      width: 3,
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
      title: 
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Thêm dự án mới
        </div>
      ,
      children: <CreateView onSearch={fetchData} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

    const openDeleteUserModal = (role: DataType) => {
    modals.openConfirmModal({
 title: 
      <div style={{ fontWeight: 600, fontSize: 18 }}>
        Xóa dự án
      </div>
    ,
      children: <DeleteView idItem={[role.id]} onSearch={fetchData}   />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  return (
    <>
      <Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* <div style={{ marginBottom: 12 }}>
          <label htmlFor="language-select" style={{ marginRight: 8 }}>
            {language === "vi" ? "Chọn ngôn ngữ:" : "Select Language:"}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "vi" | "en")}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div> */}
        <div style={{ marginBottom: 12 }}></div>
        <AppAction openModal={openModal}  />
      </Group>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
         scroll={{ x: 1300 }}
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
