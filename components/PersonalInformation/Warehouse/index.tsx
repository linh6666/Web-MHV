"use client";

import { useEffect, useState } from "react";
import { Text, Loader, Center } from "@mantine/core";
import { IconCurrencyDollar, IconCheck, IconX, IconCreditCard, IconHeart } from "@tabler/icons-react";
import styles from "./FavoritesList.module.css"; 
import { getListProject } from "../../../api/apigetlistProject";

interface Project {
  total_revenue?: number | null;
  success_count?: number | null;
  canceled_count?: number | null;
  paying_count?: number | null;
  favorite_count?: number | null;
}

interface Totals {
  total_revenue: number;
  success_count: number;
  canceled_count: number;
  paying_count: number;
  favorite_count: number;
}

export default function Warehouse() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("access_token") || "";
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getListProject({ token, skip: 0, limit: 100 });
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Tính toán tổng các chỉ số từ danh sách dự án
  const totals = projects.reduce<Totals>((acc, curr) => {
    return {
      total_revenue: (acc.total_revenue || 0) + (curr.total_revenue || 0),
      success_count: (acc.success_count || 0) + (curr.success_count || 0),
      canceled_count: (acc.canceled_count || 0) + (curr.canceled_count || 0),
      paying_count: (acc.paying_count || 0) + (curr.paying_count || 0),
      favorite_count: (acc.favorite_count || 0) + (curr.favorite_count || 0),
    };
  }, {
    total_revenue: 0,
    success_count: 0,
    canceled_count: 0,
    paying_count: 0,
    favorite_count: 0,
  });

  const stats = [
    { 
      id: 'revenue',
      title: "Tổng doanh thu", 
      value: (totals.total_revenue || 0).toLocaleString('vi-VN') + " đ", 
      description: "Tổng tiền thu được từ dự án",
      icon: IconCurrencyDollar,
      className: styles.card_blue
    },
    { 
      id: 'success',
      title: "Đã chốt xong", 
      value: (totals.success_count || 0).toString(), 
      description: "Hợp đồng đã chốt",
      icon: IconCheck,
      className: styles.card_teal
    },
    { 
      id: 'canceled',
      title: "Đã hủy", 
      value: (totals.canceled_count || 0).toString(), 
      description: "Số lượng đơn đã hủy",
      icon: IconX,
      className: styles.card_red
    },
    { 
      id: 'paying',
      title: "Đang thanh toán", 
      value: (totals.paying_count || 0).toString(), 
      description: "Đơn đang thanh toán",
      icon: IconCreditCard,
      className: styles.card_orange
    },
    { 
      id: 'favorite',
      title: "Yêu thích", 
      value: (totals.favorite_count || 0).toString(), 
      description: "Số lượng yêu thích",
      icon: IconHeart,
      className: styles.card_pink
    },
  ];

  if (loading) {
    return (
      <Center style={{ height: '300px' }}>
        <Loader color="blue" size="md" type="dots" />
      </Center>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Text className={styles.mainTitle}>Tổng quan dự án </Text>
          <Text className={styles.subTitle}>
            Báo cáo chi tiết hiệu quả kinh doanh dự án.
          </Text>
        </header>

        <div className={styles.dashboardGrid}>
          {stats.map((stat) => (
            <div key={stat.id} className={`${styles.statCard} ${stat.className}`}>
              <div className={styles.iconBox}>
                <stat.icon size={18} stroke={2.5} />
              </div>
              <Text className={styles.statLabel}>{stat.title}</Text>
              <Text className={styles.statValue}>{stat.value}</Text>
              <Text className={styles.statDesc}>{stat.description}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
