"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import {  Group, Select } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import axios from "axios";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
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
  leaf_id:string;
  
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
  leaf_id:string;
}

/* =======================
   COMPONENT
======================= */
export default function LargeFixedTable() {
  const token = localStorage.getItem("access_token") || "";

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const [templateOptions, setTemplateOptions] = useState<
    { value: string; label: string }[]
  >([]);

  /* =======================
     1️⃣ LOAD TEMPLATE
  ======================= */
  const fetchTemplateList = useCallback(async () => {
    try {
      const res = await getListProject({
        token,
        skip: 0,
        limit: 100,
      });

      console.log("TEMPLATE API FULL:", res.data);

      const options = (res.data || [])
        .filter((item: ProjectTemplate) => item?.name)
        .map((item: ProjectTemplate) => ({
          value: item.id.toString(),
          label: item.name as string,
        }));

      setTemplateOptions(options);
    } catch (err) {
      console.error("Load template error:", err);
      setTemplateOptions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplateList();
  }, [fetchTemplateList]);

  /* =======================
     2️⃣ LOAD TABLE DATA
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

      console.log("WAREHOUSE RAW RESPONSE:", res);
      console.log("WAREHOUSE res.data:", res.data);

      /* =======================
         🔥 PARSE RESPONSE – FIX CHÍNH
      ======================= */
      let list: TemplateAttributeLink[] = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data?.result)) {
        list = res.data.result;
      } else if (Array.isArray(res.data?.items)) {
        list = res.data.items;
      } else if (Array.isArray(res.data?.data?.items)) {
        list = res.data.data.items;
      }

      console.log("WAREHOUSE FINAL LIST:", list);

      const rows: DataType[] = list.map((item) => ({
        id: String(item.id),
        layer7: item.layer7,
       building_type: item.building_type,
        unit_code: item.unit_code || "-",
        layer3: item .layer3 || "-",
        layer2: item .layer2 || "-",
      bedroom: item .bedroom || "-", // để string 
       bathroom: item .bathroom || 0, 
       direction: item.direction ,
        main_door_direction: item.main_door_direction ,
        balcony_direction: item.balcony_direction,
        status_unit: item.status_unit,
        leaf_id:item.leaf_id,
      }));

      console.log("ROWS ĐƯA VÀO TABLE:", rows);

      setData(rows);
      setTotal(
        res.data?.count ||
          res.data?.total ||
          res.data?.data?.count ||
          rows.length
      );
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
     DEBUG STATE
  ======================= */
  useEffect(() => {
    console.log("DATA STATE (FINAL):", data);
  }, [data]);

  /* =======================
     PAGINATION
  ======================= */
  const paginatedData = data.slice(
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
    fixed: "left",
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
    title: "Loại công trình/vị trí",
    dataIndex: "building_type",
    width: 60,
    render: (_: unknown, record: DataType) => {
      if (
        typeof record.building_type === "string" &&
        record.building_type.trim() !== ""
      ) {
        return record.building_type;
      }
      if (
        typeof record.layer2 === "string" &&
        record.layer2.trim() !== ""
      ) {
        return record.layer2;
      }
      return "-";
    },
  },

  {
    title: "Phòng ngủ",
    dataIndex: "bedroom",
    width: 50,
  },

  {
    title: "Phòng tắm",
    dataIndex: "bathroom",
    width: 50,
    render: (bathroom: unknown) => {
      if (
        bathroom === null ||
        bathroom === undefined ||
        bathroom === "skip"
      ) {
        return "Không có";
      }
      return String(bathroom);
    },
  },

  {
    title: "Hướng",
    dataIndex: "direction",
    width: 50,
    render: (direction: unknown) => {
      if (
        direction === null ||
        direction === undefined ||
        direction === "skip"
      ) {
        return "Không có";
      }
      return String(direction);
    },
  },

  {
    title: "Hướng cửa chính",
    dataIndex: "main_door_direction",
    width: 50,
    render: (mainDoorDirection: unknown) => {
      if (
        mainDoorDirection === null ||
        mainDoorDirection === undefined ||
        mainDoorDirection === "skip"
      ) {
        return "Không có";
      }
      return String(mainDoorDirection);
    },
  },

  {
    title: "Hướng ban công",
    dataIndex: "balcony_direction",
    width: 50,
    render: (balconyDirection: unknown) => {
      if (
        balconyDirection === null ||
        balconyDirection === undefined ||
        balconyDirection === "skip"
      ) {
        return "Không có";
      }
      return String(balconyDirection);
    },
  },

  {
    title: "Trạng thái",
    dataIndex: "status_unit",
    width: 50,
    render: (statusUnit: unknown) => {
      if (
        statusUnit === null ||
        statusUnit === undefined ||
        statusUnit === "skip"
      ) {
        return <span style={{ color: "gray" }}>Không có</span>;
      }

      if (typeof statusUnit !== "string") {
        return <span>-</span>;
      }

      let color = "#000";
      switch (statusUnit) {
        case "Quan tâm":
          color = "#b8893c";
          break;
        case "Đang bán":
          color = "#3d6985";
          break;
        case "Đã đặt cọc":
          color = "#cc5c34";
          break;
        case "Đã bán":
          color = "#b32f1f";
          break;
      }

      return <span style={{ color }}>{statusUnit}</span>;
    },
  },

  {
    title: "Hành động",
    width: 40,
    fixed: "right",
    render: (_: unknown, record: DataType) => (
      <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            iconType="image"
            aria-label="Hình ảnh"
            color="primary"
            onClick={() => openImgModal(record, templateId)}
          />
        </EuiFlexItem>

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

const openEditUserModal = (record: DataType) => {
  modals.openConfirmModal({
    title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa</div>,
    children: (
      <EditView
        id={record.id}
        leaf_id={record.leaf_id}
        project_id={templateId}   // 👈 project đang chọn
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
  const unit_code = record.unit_code || "-";

  modals.openConfirmModal({
    title: (
      <div style={{ fontWeight: 600, fontSize: 18 }}>
        Hình ảnh
      </div>
    ),

    size: "50%", // 👈 Thu nhỏ lại một chút để cân đối nhất

    children: (
      <DetailsImng
        projectId={project_id}
        unitCode={unit_code}
        onSearch={fetchWarehouse}
      />
    ),

    confirmProps: { display: "none" },
    cancelProps: { display: "none" },
  });
};

  return (
    <>
      <Group mb="md">
        <Select
          label="Chọn dự án"
          placeholder="Chọn dự án mẫu"
          data={templateOptions}
          value={templateId}
          onChange={(value) => {
            setTemplateId(value || "");
            setCurrentPage(1);
            setData([]);
            setTotal(0);
          }}
          rightSection={<IconChevronDown size={16} />}
          clearable
          withAsterisk
        />
      </Group>

      <Table
       scroll={{ x: 1600 }}
        columns={columns}
        dataSource={paginatedData}
        loading={loading}
        pagination={false}
        bordered
        rowKey="id"
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
