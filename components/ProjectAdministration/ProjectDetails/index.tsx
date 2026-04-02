"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import axios from "axios";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiSelect } from "@elastic/eui";
import { createWarehouse } from "../../../api/apiFilterWarehouse";
import { getListProject } from "../../../api/apigetlistProject";

import { NotificationExtension } from "../../../extension/NotificationExtension";
import EditView from "./EditView";
import DeleteView from "./DeleteView";
import DetailsImng from "./DetailsImg";
import { modals } from "@mantine/modals";

/* =======================
   TYPE
======================= */
interface DataType {
  id: string;
  layer7: string;
  building_type: string;
  unit_code: string;
  layer3: string;
  layer2: string;
  bedroom: string;
  bathroom: number;
  direction: string;
  main_door_direction: string;
  balcony_direction: string;
  status_unit: string;
  leaf_id: string;
}

interface ProjectTemplate {
  id: string | number;
  name?: string;
}

interface TemplateAttributeLink {
  id: string | number;
  layer7: string;
  building_type: string;
  unit_code?: string;
  layer3: string;
  layer2: string;
  bedroom: string;
  bathroom: number;
  direction: string;
  main_door_direction: string;
  balcony_direction: string;
  status_unit: string;
  leaf_id: string;
}

/* =======================
   COMPONENT
======================= */
export default function LargeFixedTable({ projectId }: { projectId?: string }) {
  const token = localStorage.getItem("access_token") || "";

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState(projectId || "");

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // ✅ SEARCH & FILTER STATE
  const [searchText, setSearchText] = useState("");
  const [selectedLayer7, setSelectedLayer7] = useState("");

  const [templateOptions, setTemplateOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (projectId) {
      setTemplateId(projectId);
    }
  }, [projectId]);

  /* =======================
     LOAD TEMPLATE
  ======================= */
  const fetchTemplateList = useCallback(async () => {
    try {
      const res = await getListProject({
        token,
        skip: 0,
        limit: 100,
      });

      const options = (res.data || [])
        .filter((item: ProjectTemplate) => item?.name)
        .map((item: ProjectTemplate) => ({
          value: item.id.toString(),
          label: item.name as string,
        }));

      setTemplateOptions(options);

      if (!projectId && !templateId && options.length > 0) {
        setTemplateId(options[0].value);
      }
    } catch (err) {
      console.error("Load template error:", err);
      setTemplateOptions([]);
    }
  }, [token, projectId, templateId]);

  useEffect(() => {
    fetchTemplateList();
  }, [fetchTemplateList]);

  /* =======================
     LOAD TABLE DATA
  ======================= */
  const fetchWarehouse = useCallback(async () => {
    if (!templateId) {
      setData([]);
      setTotal(0);
      return;
    }

    setLoading(true);

    const body = {
      project_id: templateId,
      filters: [
        {
          label: "layer8",
          values: ["ct", "ti"],
        },
      ],
    };

    try {
      const res = await createWarehouse(templateId, body);

      let list: TemplateAttributeLink[] = [];

      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data?.data)) list = res.data.data;
      else if (Array.isArray(res.data?.result)) list = res.data.result;
      else if (Array.isArray(res.data?.items)) list = res.data.items;
      else if (Array.isArray(res.data?.data?.items))
        list = res.data.data.items;

      const rows: DataType[] = list.map((item) => ({
        id: String(item.id),
        layer7: item.layer7,
        building_type: item.building_type,
        unit_code: item.unit_code || "-",
        layer3: item.layer3 || "-",
        layer2: item.layer2 || "-",
        bedroom: item.bedroom || "-",
        bathroom: item.bathroom || 0,
        direction: item.direction,
        main_door_direction: item.main_door_direction,
        balcony_direction: item.balcony_direction,
        status_unit: item.status_unit,
        leaf_id: item.leaf_id,
      }));

      setData(rows);
      setTotal(rows.length);
    } catch (err) {
      let message = "Có lỗi khi tải dữ liệu kho";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          message;
      }

      NotificationExtension.Fails(message);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    fetchWarehouse();
  }, [fetchWarehouse]);

  /* =======================
     LAYER 7 OPTIONS
  ======================= */
  const layer7Options = useMemo(() => {
    const uniqueValues = new Set<string>();
    data.forEach((item) => {
      const val = (item.layer7?.trim() || item.layer3?.trim());
      if (val && val !== "-") uniqueValues.add(val);
    });
    
    return [
      { value: "", text: "Phân khu/Tòa" },
      ...Array.from(uniqueValues).sort().map(val => ({ value: val, text: val }))
    ];
  }, [data]);

  /* =======================
     SEARCH & FILTER LOGIC
  ======================= */
  const filteredData = data.filter((item) => {
    // 1. Phân khu filter
    if (selectedLayer7) {
      const itemLayer = (item.layer7?.trim() || item.layer3?.trim());
      if (itemLayer !== selectedLayer7) return false;
    }

    // 2. Keyword search
    const keyword = searchText.toLowerCase();
    if (!keyword) return true;

    return (
      item.unit_code?.toLowerCase().includes(keyword) ||
      item.layer7?.toLowerCase().includes(keyword) ||
      item.layer3?.toLowerCase().includes(keyword) ||
      item.layer2?.toLowerCase().includes(keyword) ||
      item.building_type?.toLowerCase().includes(keyword) ||
      item.direction?.toLowerCase().includes(keyword) ||
      item.main_door_direction?.toLowerCase().includes(keyword) ||
      item.balcony_direction?.toLowerCase().includes(keyword) ||
      item.status_unit?.toLowerCase().includes(keyword)
    );
  });

  // reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedLayer7]);

  /* =======================
     PAGINATION
  ======================= */
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns: ColumnsType<DataType> = [
    {
      title: "Mã căn",
      dataIndex: "unit_code",
      width: 50,
    },
    {
      title: "Phân khu/Tòa",
      dataIndex: "layer7",
      width: 40,
      render: (layer7: unknown, record: DataType) => {
        if (typeof layer7 === "string" && layer7.trim() !== "") return layer7;
        if (typeof record.layer3 === "string" && record.layer3.trim() !== "")
          return record.layer3;
        return "-";
      },
    },
    {
      title: "Hành động",
      width: 40,
      render: (_: unknown, record: DataType) => (
        <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="image"
              onClick={() => openImgModal(record, templateId)}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="documentEdit"
              onClick={() => openEditUserModal(record)}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              onClick={() => openDeleteUserModal(record)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  const openEditUserModal = (record: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa</div>,
      children: (
        <EditView
          id={record.id}
          leaf_id={record.leaf_id}
          project_id={templateId}
          onSearch={fetchWarehouse}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openDeleteUserModal = (record: DataType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa</div>,
      children: <DeleteView idItem={[record.id]} onSearch={fetchWarehouse} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openImgModal = (record: DataType, project_id: string) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Hình ảnh</div>,
      size: "50%",
      children: (
        <DetailsImng
          projectId={project_id}
          unitCode={record.unit_code}
          onSearch={fetchWarehouse}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  return (
    <>
      {/* ✅ SEARCH & FILTER */}
      <EuiFlexGroup gutterSize="s" style={{ marginBottom: 16 }}>
        <EuiFlexItem grow={false} style={{ width: 150  }}>
          <EuiSelect
            options={layer7Options}
            value={selectedLayer7}
            onChange={(e) => setSelectedLayer7(e.target.value)}
            fullWidth
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <AppSearch
            value={searchText}
            onSearch={(value) => setSearchText(value)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <Table
        columns={columns}
        dataSource={paginatedData}
        loading={loading}
        pagination={false}
        bordered
        rowKey="id"
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={filteredData.length}
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}