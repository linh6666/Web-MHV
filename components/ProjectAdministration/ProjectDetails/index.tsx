"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import AppSearch from "../../../common/AppSearch";
import axios from "axios";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiSelect, EuiFieldSearch, EuiFormControlLayout } from "@elastic/eui";
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
  const [selectedBuildingType, setSelectedBuildingType] = useState("");
  const [selectedStatusUnit, setSelectedStatusUnit] = useState("");

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
          label: "layer1",
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

  const buildingTypeOptions = useMemo(() => {
    const uniqueValues = new Set<string>();
    data.forEach((item) => {
      const val = item.building_type?.trim();
      if (val && val !== "-") uniqueValues.add(val);
    });
    
    return [
      { value: "", text: "Loại nhà" },
      ...Array.from(uniqueValues).sort().map(val => ({ value: val, text: val }))
    ];
  }, [data]);

  const statusUnitOptions = useMemo(() => {
    const uniqueValues = new Set<string>();
    data.forEach((item) => {
      const val = item.status_unit?.trim();
      if (val && val !== "-" && val.toLowerCase() !== "skip") uniqueValues.add(val);
    });
    
    return [
      { value: "", text: "Trạng thái" },
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

    // 2. Loại nhà filter
    if (selectedBuildingType && item.building_type !== selectedBuildingType) {
      return false;
    }

    // 3. Trạng thái filter
    if (selectedStatusUnit && item.status_unit !== selectedStatusUnit) {
      return false;
    }

    // 4. Keyword search
    const keyword = searchText.toLowerCase().trim();
    if (!keyword) return true;

    // Join all critical fields for searching.
    const searchableBuffer = [
      item.unit_code || "",
      item.layer7 || "",
      item.layer3 || "",
      item.building_type || "",
      item.direction || "",
      item.status_unit || "",
    ].map(v => v.toString().toLowerCase()).join(" ");

    return searchableBuffer.includes(keyword);
  });

  // reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedLayer7, selectedBuildingType, selectedStatusUnit]);

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
      title: "Phân khu/Tòa",
      dataIndex: "zone",
      width: 40,
      render: (layer7: unknown, record: DataType) => {
        if (typeof layer7 === "string" && layer7.trim() !== "") return layer7;
        if (typeof record.layer3 === "string" && record.layer3.trim() !== "")
          return record.layer3;
        return "-";
      },
    },
       {
      title: "Loại nhà",
      dataIndex: "building_type",
      width: 50,
    },
     {
      title: "Trạng thái",
      dataIndex: "status_unit",
      width: 50,
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
          leafId={record.leaf_id}
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
      <EuiFlexGroup gutterSize="s" style={{ marginBottom: 8 }}>
        <EuiFlexItem>
          <AppSearch
            value={searchText}
            onSearch={(value) => setSearchText(value)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup gutterSize="s" style={{ marginBottom: 16 }}>
        <EuiFlexItem grow={false} style={{ width: 180 }}>
          <EuiFormControlLayout
            clear={
              selectedLayer7
                ? { onClick: () => setSelectedLayer7("") }
                : undefined
            }
          >
            <EuiSelect
              options={layer7Options}
              value={selectedLayer7}
              onChange={(e) => setSelectedLayer7(e.target.value)}
              fullWidth
            />
          </EuiFormControlLayout>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ width: 180 }}>
          <EuiFormControlLayout
            clear={
              selectedBuildingType
                ? { onClick: () => setSelectedBuildingType("") }
                : undefined
            }
          >
            <EuiSelect
              options={buildingTypeOptions}
              value={selectedBuildingType}
              onChange={(e) => setSelectedBuildingType(e.target.value)}
              fullWidth
            />
          </EuiFormControlLayout>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ width: 180 }}>
          <EuiFormControlLayout
            clear={
              selectedStatusUnit
                ? { onClick: () => setSelectedStatusUnit("") }
                : undefined
            }
          >
            <EuiSelect
              options={statusUnitOptions}
              value={selectedStatusUnit}
              onChange={(e) => setSelectedStatusUnit(e.target.value)}
              fullWidth
            />
          </EuiFormControlLayout>
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