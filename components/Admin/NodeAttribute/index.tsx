"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Select,
  ActionIcon,
  Group,
  Box,
  TextInput,
  Button,
  Loader,
  Paper,
  Card,
  Image,
  Text,
  Stack,
} from "@mantine/core";
import { IconPlus, IconChevronDown, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { getListProject } from "../../../api/apigetlistProject";
import { getListRoles } from "../../../api/apigetlistAttributes";
import { createProjectTemplate } from "../../../api/apiNodeAttribute";
import styles from "./NodeAttribute.module.css";

// ===========================
// ✅ TYPES
// ===========================

interface OverviewImage {
  url?: string;
  thumbnail_url?: string;
}

interface ProjectTemplate {
  id: string | number;
  name?: string;
  type?: string;
  address?: string;
  investor?: string;
  overview_image?: OverviewImage;
  thumbnail_url?: string;
}

interface ProjectOption {
  value: string;
  label: string;
  image: string;
  type?: string;
  address?: string;
  investor?: string;
}

interface RoleOption {
  id: string | number;
  label: string;
  name?: string;
}

interface SelectNode {
  id: string;
  value: string;
  quantity?: number;
  children: SelectNode[];
}

// ===========================
// 🔥 HELPER
// ===========================

const getImageUrl = (item: ProjectTemplate): string => {
  const url = item.thumbnail_url || item.overview_image?.url || "";
  if (!url) return "/placeholder.png";
  return url.replace("http://", "https://");
};

// ===========================
// COMPONENT
// ===========================

export default function RecursiveSelect() {
  // --- Bước 1: Danh sách dự án ---
  const [templateOptions, setTemplateOptions] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<ProjectOption | null>(null);

  // --- Bước 2: Cây thuộc tính ---
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectTree, setSelectTree] = useState<SelectNode[]>([
    { id: "root", value: "", children: [] },
  ]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") || ""
      : "";

  // 🧠 Lấy danh sách project (giữ nguyên API gốc getListProject)
  const fetchTemplateList = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await getListProject({ token, skip: 0, limit: 100 });
      const data: ProjectTemplate[] = res.data || [];
      const options = data.map((item) => ({
        value: item.id.toString(),
        label: item.name || `Project ${item.id}`,
        image: getImageUrl(item),
        type: item.type,
        address: item.address,
        investor: item.investor,
      }));
      setTemplateOptions(options);
    } catch (err) {
      console.error("Lỗi khi load danh sách project:", err);
      setTemplateOptions([]);
    } finally {
      setProjectsLoading(false);
    }
  }, [token]);

  // 🧠 Lấy danh sách roles (thuộc tính)
  const fetchRoles = useCallback(async () => {
    try {
      const res = await getListRoles({ token });
      const data: RoleOption[] = res.data || [];
      const opts = data.map((item) => ({
        value: item.id.toString(),
        label: item.name || `${item.label}`,
      }));
      setRoleOptions(opts);
    } catch (err) {
      console.error("Lỗi khi load roles:", err);
      setRoleOptions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplateList();
    fetchRoles();
  }, [fetchTemplateList, fetchRoles]);

  // 🎯 Chọn dự án từ card → chuyển sang bước 2
  const handleSelectProject = (option: ProjectOption) => {
    setSelectedOption(option);
    setSelectTree([{ id: "root", value: option.value, children: [] }]);
  };

  // 🔙 Quay lại chọn dự án
  const handleBack = () => {
    setSelectedOption(null);
    setSelectTree([{ id: "root", value: "", children: [] }]);
  };

  // ⬆️ Update node value
  const updateNodeValue = useCallback((id: string, newValue: string) => {
    const updateNode = (nodes: SelectNode[]): SelectNode[] =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, value: newValue };
        if (node.children.length > 0)
          return { ...node, children: updateNode(node.children) };
        return node;
      });

    setSelectTree((prev) => updateNode(prev));
  }, []);

  // ⬆️ Update quantity
  const updateNodeQuantity = useCallback(
    (id: string, newQty: number | undefined) => {
      const updateQty = (nodes: SelectNode[]): SelectNode[] =>
        nodes.map((node) => {
          if (node.id === id) return { ...node, quantity: newQty };
          if (node.children.length > 0)
            return { ...node, children: updateQty(node.children) };
          return node;
        });

      setSelectTree((prev) => updateQty(prev));
    },
    []
  );

  // ➕ Add child node
  const handleAddChild = useCallback((id: string) => {
    const addChild = (nodes: SelectNode[]): SelectNode[] =>
      nodes.map((node) => {
        if (node.id === id) {
          const quantity = node.quantity && node.quantity > 0 ? node.quantity : 1;

          const newChildren: SelectNode[] = [];
          for (let i = 0; i < quantity; i++) {
            newChildren.push({
              id: `${id}-${node.children.length + i + 1}`,
              value: "",
              quantity: 1,
              children: [],
            });
          }

          return { ...node, children: [...node.children, ...newChildren] };
        }

        if (node.children.length > 0) {
          return { ...node, children: addChild(node.children) };
        }

        return node;
      });

    setSelectTree((prev) => addChild(prev));
  }, []);

  // 🗑 Xóa node
  const handleDeleteNode = useCallback((id: string) => {
    if (!id) return;

    const deleteNode = (nodes: SelectNode[]): SelectNode[] =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) =>
          node.children.length > 0
            ? { ...node, children: deleteNode(node.children) }
            : node
        );

    setSelectTree((prev) => deleteNode(prev));
  }, []);

  // 🧹 Collect values lớp cuối
  const collectAllValues = (nodes: SelectNode[]): { value: string }[] => {
    let result: { value: string }[] = [];
    for (const node of nodes) {
      if (node.children.length === 0 && node.value.trim() !== "") {
        result.push({ value: node.value });
      } else if (node.children.length > 0) {
        result = result.concat(collectAllValues(node.children));
      }
    }
    return result;
  };

  // 🚀 Gửi API
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const project_id = selectTree[0]?.value || "";
      const attribute_id = selectTree[0]?.children?.[0]?.value || "";

      const values = collectAllValues(selectTree);

      if (!project_id || !attribute_id || values.length === 0) {
        alert("⚠️ Vui lòng chọn đủ Thuộc tính và nhập ít nhất 1 giá trị!");
        setLoading(false);
        return;
      }

      const payload = { project_id, attribute_id, values };

      const res = await createProjectTemplate(payload);
      console.log("Kết quả trả về:", res);

      alert("✅ Tạo dữ liệu thành công!");
      // Reset cây nhưng giữ project đã chọn
      setSelectTree([{ id: "root", value: selectedOption?.value || "", quantity: 1, children: [] }]);
    } catch (err) {
      console.error("❌ Lỗi khi tạo dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Render đệ quy (chỉ từ level 1 trở đi, level 0 đã chọn từ card)
  const renderSelects = (nodes: SelectNode[], level = 0) =>
    nodes.map((node) => {
      const content = (
        <Box mb="sm">
          <Group align="flex-end">
            {/* Level 0: ẩn Select, project_id đã được set từ card */}

            {level === 1 && (
              <Select
                label="Thuộc tính"
                placeholder="Chọn thuộc tính"
                data={roleOptions}
                value={node.value}
                onChange={(val) => updateNodeValue(node.id, val || "")}
                rightSection={<IconChevronDown size={16} />}
                withAsterisk
                clearable
                mb="xs"
              />
            )}

            {level >= 2 && (
              <Group align="flex-end">
                <TextInput
                  label={`Giá trị lớp ${level + 1}`}
                  placeholder="Nhập giá trị..."
                  value={node.value}
                  onChange={(e) =>
                    updateNodeValue(node.id, e.currentTarget.value)
                  }
                  style={{ flex: 2 }}
                />
                <TextInput
                  label="Số lượng"
                  type="number"
                  placeholder="nhập số lượng"
                  value={node.quantity ?? ""}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    const qty = val === "" ? undefined : parseInt(val, 10);
                    updateNodeQuantity(node.id, qty);
                  }}
                  style={{ width: "100px" }}
                />
              </Group>
            )}

            {node.id && node.id !== "root" && (
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => handleDeleteNode(node.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>

          {node.value && (
            <Group mb="sm" mt="xs">
              <ActionIcon
                color="blue"
                variant="filled"
                onClick={() => handleAddChild(node.id)}
              >
                <IconPlus size={16} />
              </ActionIcon>
              <span>Thêm lớp con</span>
            </Group>
          )}

          {node.children.length > 0 && renderSelects(node.children, level + 1)}
        </Box>
      );

      // ⭐ Chỉ bọc Paper cho level === 1 (ô thuộc tính)
      if (level === 1) {
        return (
          <Paper
            key={node.id}
            shadow="xs"
            radius="md"
            p="md"
            mb="md"
            withBorder
            style={{ marginLeft: level * 20 }}
          >
            {content}
          </Paper>
        );
      }

      // Các level khác render bình thường, không bọc Paper
      return <React.Fragment key={node.id}>{content}</React.Fragment>;
    });

  // ===========================
  // 📦 BƯỚC 1: Danh sách dự án dạng Card (giống Interact/index.tsx)
  // ===========================
  if (!selectedOption) {
    if (projectsLoading) {
      return (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Loader />
        </div>
      );
    }

    return (
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.cardGrid}>
            {templateOptions.map((option) => (
              <Card
                key={option.value}
                shadow="sm"
                radius="md"
                withBorder
                padding="0"
                className={styles.card}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectProject(option)}
              >
                {/* ===== IMAGE ===== */}
                <Image
                  src={option.image}
                  height={160}
                  alt={option.label}
                  style={{
                    borderTopLeftRadius: "var(--mantine-radius-md)",
                    borderTopRightRadius: "var(--mantine-radius-md)",
                  }}
                />

                {/* ===== CONTENT ===== */}
                <Stack gap={0} p="md" style={{ flexGrow: 1 }}>
                  <Text fw={500}>{option.label}</Text>
                  <Text size="sm" c="dimmed">Loại dự án: {option.type || "Thông tin chưa có"}</Text>
                  <Text size="sm" c="dimmed">Địa chỉ: {option.address || "Địa chỉ chưa có"}</Text>
                  <Text size="sm" c="dimmed">Nhà đầu tư: {option.investor || "Thông tin chưa có"}</Text>
                </Stack>

                {/* ===== BUTTON ===== */}
                <Button
                  className={`${styles.baseButton} ${styles.primaryButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProject(option);
                  }}
                >
                  Chọn dự án
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // 📝 BƯỚC 2: Nhập thuộc tính cho dự án đã chọn
  // ===========================
  return (
    <div>
      {/* Header: tên dự án đã chọn + nút quay lại */}
      <Group mb="md" align="center">
        <ActionIcon
          variant="light"
          color="blue"
          onClick={handleBack}
          title="Quay lại chọn dự án"
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text fw={600} size="lg">
          Dự án: {selectedOption.label}
        </Text>
      </Group>

      {renderSelects(selectTree)}

      <Group mt="xl">
        <Button onClick={handleCreateUser} color="green" disabled={loading}>
          {loading ? <Loader size="xs" /> : "Tạo dữ liệu"}
        </Button>
      </Group>
    </div>
  );
}
