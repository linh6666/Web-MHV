"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { modals } from "@mantine/modals";
import { getListTemplateAttributesLink } from "../../../api/apiTemplateAttributesLink";
import { getListProjectTemplates } from "../../../api/apiProjectTemplates2";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group, Select } from "@mantine/core";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteView";
import { IconChevronDown } from "@tabler/icons-react";
import { getListRoles } from "../../../api/apigetlistAttributes";

interface DataType {
  id: string;
  project_template_id: string;
  attribute_id: string;
}

interface ProjectTemplate {
  id: string | number;
  template_vi?: string;
  template_name?: string;
}

interface TemplateAttributeLink {
  id: string | number;
  project_template_id: string;
  attribute_id: string;
}

interface Attribute {
  id: string | number;
  label?: string;
  attribute_name?: string;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const pageSize = 10;
  // dropdown mẫu dự án
  const [templateOptions, setTemplateOptions] = useState<{ value: string; label: string }[]>([]);
  // dropdown thuộc tính
  const [attributeOptions, setAttributeOptions] = useState<{ value: string; label: string }[]>([]);

  const token = localStorage.getItem("access_token") || "";

  // ============================================================
  // 🔹 1️⃣ Gọi API lấy danh sách template
  // ============================================================
const fetchTemplateList = useCallback(async () => {
  try {
    const res = await getListProjectTemplates({
      token,
      skip: 0,
      limit: 100,
    });

    const data: ProjectTemplate[] = res.data || [];

    const options = data
      .filter(
        (item): item is ProjectTemplate & { template_vi: string } =>
          typeof item.template_vi === "string" &&
          item.template_vi.trim() !== ""
      )
      .map((item) => ({
        value: item.id.toString(),
        label: item.template_vi, // ✅ chắc chắn là string
      }));

    setTemplateOptions(options);
  } catch (err) {
    console.error("Lỗi khi load danh sách template:", err);
    setTemplateOptions([]);
  }
}, [token]);


  // ============================================================
  // 🔹 2️⃣ Gọi API lấy danh sách thuộc tính
  // ============================================================
  const fetchAttributeList = useCallback(async () => {
    try {
      const res = await getListRoles({ token, skip: 0, limit: 100 });
      const data: Attribute[] = res.data || [];

      const options = data.map((item) => ({
        value: item.id.toString(),
        label: item.label || item.attribute_name || `Thuộc tính ${item.id}`,
      }));
      setAttributeOptions(options);
    } catch (err) {
      console.error("Lỗi khi load danh sách thuộc tính:", err);
      setAttributeOptions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplateList();
    fetchAttributeList();
  }, [fetchTemplateList, fetchAttributeList]);

  // ============================================================
  // 🔹 3️⃣ Gọi API lấy dữ liệu bảng (fetch toàn bộ, lọc client-side)
  // ============================================================
  const fetchAttributes = useCallback(async () => {
    if (!templateId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await getListTemplateAttributesLink({
        token,
        template_id: templateId,
        skip: 0,
        limit: 1000,
      });
      const rawData: TemplateAttributeLink[] = res.data || [];

      const rows: DataType[] = rawData.map((item) => ({
        id: item.id.toString(),
        project_template_id: item.project_template_id,
        attribute_id: item.attribute_id,
      }));
      setData(rows);
      setCurrentPage(1);
    } catch (err) {
      setError("Không thể tải dữ liệu bảng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [templateId, token]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  // ============================================================
  // 🔹 3b️⃣ Lọc dữ liệu theo searchText
  // ============================================================
  const filteredData = data.filter((row) => {
    if (!searchText) return true;
    const keyword = searchText.toLowerCase();
    const templateLabel =
      templateOptions.find((o) => o.value === row.project_template_id)?.label?.toLowerCase() || "";
    const attributeLabel =
      attributeOptions.find((o) => o.value === row.attribute_id)?.label?.toLowerCase() || "";
    return templateLabel.includes(keyword) || attributeLabel.includes(keyword);
  });

  // Reset về trang 1 khi searchText thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ============================================================
  // 🔹 4️⃣ Cột bảng
  // ============================================================
  const columns: ColumnsType<DataType> = [
    {
      title: "Mẫu dự án",
      dataIndex: "project_template_id",
      key: "project_template_id",
      width: 100,
      render: (text: string) => (
        <span>{templateOptions.find((option) => option.value === text)?.label || "Không có tên"}</span>
      ),
    },
    {
      title: "Thuộc tính",
      dataIndex: "attribute_id",
      key: "attribute_id",
      width: 100,
      render: (text: string) => (
        <span>{attributeOptions.find((option) => option.value === text)?.label || "Không có tên"}</span>
      ),
    },
    {
      title: "Hành động",
      width: 60,
      fixed: "right",
      render: (record: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              aria-label="Chỉnh sửa"
              color="success"
              onClick={() => openEditUserModal(record)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Xóa"
              color="danger"
              onClick={() => openDeleteUserModal(record)}
              style={{ border: "none", outline: "none", background: "transparent", boxShadow: "none" }}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  // ============================================================
  // 🔹 5️⃣ Các modal CRUD
  // ============================================================
  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm mới</div>,
      children: <CreateView onSearch={fetchAttributes} />,
      size: "lg",
      radius: "md",
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openEditUserModal = (record: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa</div>,
      children: <EditView id={record.id} onSearch={fetchAttributes} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openDeleteUserModal = (record: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa</div>,
      children: <DeleteView idItem={[record.id]} onSearch={fetchAttributes} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ============================================================
  // 🔹 6️⃣ Render giao diện
  // ============================================================
  return (
    <>
      <Group justify="space-between" align="center">

          
          <Select
            label="Chọn mẫu dự án để xem dữ liệu"
            placeholder="Chọn dự án mẫu"
            data={templateOptions}
            value={templateId}
            onChange={(value) => setTemplateId(value || "")}
            rightSection={<IconChevronDown size={16} />}
            withAsterisk
            clearable
            mb="md"
          />
     
          <AppAction openModal={openModal} />
      </Group>
        <AppSearch value={searchText} onSearch={(value) => setSearchText(value)} />

      <Table columns={columns} dataSource={pagedData} loading={loading} pagination={false} bordered rowKey="id" />

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
