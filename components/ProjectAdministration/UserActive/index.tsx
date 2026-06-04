"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { modals } from "@mantine/modals";
import { getListActiveUsers, UserOnline } from "../../../api/apiGetlistUseronline";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Group } from "@mantine/core";
import EditView from "./EditView";

// ✅ TYPE CHUẨN
interface DataType {
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  active_at: number;
}

export default function LargeFixedTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

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
      const result = await getListActiveUsers(20, null);

      // ✅ Map user data to DataType
      const users: DataType[] = (result.data || []).map((user: UserOnline) => ({
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        status: user.status,
        active_at: user.active_at,
      }));

      setData(users);
      setNextCursor(result.next_cursor);
      setHasMore(result.has_more);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ===========================
  // 🔥 LOAD MORE DATA
  // ===========================
  const loadMoreData = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor || !token) return;

    setLoadingMore(true);
    try {
      const result = await getListActiveUsers(20, nextCursor);

      // ✅ Map user data to DataType
      const newUsers: DataType[] = (result.data || []).map((user: UserOnline) => ({
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        status: user.status,
        active_at: user.active_at,
      }));

      setData((prev) => [...prev, ...newUsers]);
      setNextCursor(result.next_cursor);
      setHasMore(result.has_more);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Đã xảy ra lỗi khi tải thêm dữ liệu.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextCursor, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===========================
  // 🔥 INFINITE SCROLL OBSERVER
  // ===========================
  useEffect(() => {
    if (!hasMore || loading || loadingMore || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = observerRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, loading, loadingMore, nextCursor, loadMoreData]);

  // ===========================
  // 🔥 MODAL EDIT
  // ===========================
  const openEditUserModal = (item: DataType) => {
    modals.openConfirmModal({
      title: (
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Chi tiết trạng thái người dùng
        </div>
      ),
      children: <EditView email={item.email} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  // ===========================
  // 🔥 COLUMNS
  // ===========================
  const columns: ColumnsType<DataType> = [
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const isOnline = status?.toLowerCase() === "online";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isOnline ? "#52c41a" : "#bfbfbf",
                display: "inline-block",
              }}
            />
            <span>{status}</span>
          </div>
        );
      },
    },
    {
      title: "Thời gian hoạt động",
      dataIndex: "active_at",
      key: "active_at",
      width: 200,
      render: (active_at: number) => {
        if (!active_at) return "-";
        return new Date(active_at * 1000).toLocaleString("vi-VN");
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
              iconType="eye"
              aria-label="Xem chi tiết"
              color="success"
              onClick={() => openEditUserModal(item)}
              style={{ border: "none", background: "transparent", boxShadow: "none", outline: "none" }}
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
        rowKey="user_id"
      />

      {loadingMore && (
        <div style={{ textAlign: "center", marginTop: 12, color: "#8c8c8c" }}>
          Đang tải thêm người dùng...
        </div>
      )}

      {hasMore && !loadingMore && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button onClick={loadMoreData} type="dashed" style={{ width: "200px" }}>
            Xem thêm
          </Button>
        </div>
      )}

      <div ref={observerRef} style={{ height: 20 }} />

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </>
  );
}


