"use client";

import React, { useEffect, useState } from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconSmartHome,
  IconChartDonut,
} from "@tabler/icons-react";

import {
  Center,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Text,
  Loader,
  Stack,
  Title,
  Box,
  Divider,
} from "@mantine/core";

import { PieChart } from "@mantine/charts";
import "@mantine/charts/styles.css";

import { getListProject } from "../../../api/apigetlistProject";

// Định nghĩa interface để code sạch và chuyên nghiệp hơn
interface StatusData {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon: "up" | "down";
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface StatusItem {
  id: string;
  status_name: string;
  count: number;
  percent: number;
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function StatsRing() {
  const [statsData, setStatsData] = useState<StatusData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") ?? "";
        const res = await getListProject({
          token,
          skip: 0,
          limit: 1,
        });

        if (res?.data && res.data.length > 0) {
          const project = res.data[0];
          const statuses = project.unit_status_summary?.statuses || [];
          const total = project.unit_status_summary?.total_units || 0;
          setTotalUnits(total);

          // Mapping dữ liệu cho Card
          const mapped: StatusData[] = statuses.map((s: StatusItem) => {
            let color = "#22c55e"; // Success green
            let icon: "up" | "down" = "up";
            const name = s.status_name.toUpperCase();

            if (name.includes("ĐANG BÁN")) {
              color = "#10b981"; // Emerald
              icon = "up";
            } else if (name.includes("ĐẶT CỌC")) {
              color = "#f59e0b"; // Amber
              icon = "up";
            } else if (name.includes("ĐÃ BÁN")) {
              color = "#ef4444"; // Red
              icon = "down";
            }

            return {
              label: s.status_name,
              stats: s.count.toLocaleString(),
              progress: Math.round(s.percent),
              color,
              icon,
            };
          });

          // Mapping dữ liệu cho Donut Chart
          const pieMapped: ChartData[] = statuses.map((s: StatusItem) => {
            let color = "#3b82f6";
            const name = s.status_name.toUpperCase();

            if (name.includes("ĐANG BÁN")) color = "#10b981";
            else if (name.includes("ĐẶT CỌC")) color = "#f59e0b";
            else if (name.includes("ĐÃ BÁN")) color = "#ef4444";

            return {
              name: s.status_name,
              value: s.count,
              color,
            };
          });

          setStatsData(mapped);
          setChartData(pieMapped);
        }
      } catch (error) {
        console.error("Lỗi tải API StatsRing:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader size="lg" variant="dots" color="blue" />
      </Group>
    );
  }

  const stats = statsData.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper 
        withBorder 
        radius="lg" 
        p="md" 
        key={stat.label}
        style={{
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default'
        }}
        shadow="xs"
      >
        <Group justify="space-between" wrap="nowrap">
          <Box>
            <Text c="dimmed" size="xs" tt="uppercase" fw={800}>
              {stat.label}
            </Text>
            <Text fw={800} size="24px" mt={4}>
              {stat.stats}
            </Text>
          </Box>

          <RingProgress
            size={70}
            roundCaps
            thickness={6}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={18} stroke={2} color={stat.color} />
              </Center>
            }
          />
        </Group>
      </Paper>
    );
  });

  return (
    <Stack gap="xl">
      {/* HEADER SECTION */}
      <Group justify="space-between">
        <Box>
          <Title order={3} fw={800}>Báo cáo tổng quan</Title>
          <Text c="dimmed" size="sm">Số liệu thống kê thời gian thực từ hệ thống</Text>
        </Box>
        <Paper withBorder radius="md" px="md" py="xs" bg="gray.0">
          <Group gap="xs">
            <IconSmartHome size={20} color="gray" />
            <Text size="sm" fw={600}>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</Text>
          </Group>
        </Paper>
      </Group>

      {/* STATS CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {stats}
      </SimpleGrid>

      {/* CHART SECTION */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder radius="lg" p="xl" shadow="sm">
          <Group mb="xl" justify="space-between">
            <Group gap="xs">
              <IconChartDonut size={24} color="blue" />
              <Title order={4} fw={700}>Phân bổ trạng thái</Title>
            </Group>
          </Group>

          <Box pos="relative" h={320}>
            <Center h="100%">
              <PieChart
                data={chartData}
                withTooltip
                tooltipDataSource="segment"
                strokeWidth={2}
                size={350}
                withLabels
                labelsPosition="outside"
                labelsType="percent"
                pieProps={{ innerRadius: 100, outerRadius: 130, paddingAngle: 0.5 }}
              />
              {/* TOTAL TEXT IN CENTER */}
              <Stack gap={0} align="center" pos="absolute" style={{ pointerEvents: 'none' }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={800}>Tổng số</Text>
                <Text size="32px" fw={900} style={{ lineHeight: 1 }}>{totalUnits}</Text>
                <Text size="xs" c="dimmed" fw={600}>Căn hộ</Text>
              </Stack>
            </Center>
          </Box>
        </Paper>

        <Paper withBorder radius="lg" p="xl" shadow="sm">
          <Title order={4} fw={700} mb="xl">Chi tiết tỷ trọng</Title>
          <Stack gap="md">
            {chartData.map((item) => (
              <Box key={item.name}>
                <Group justify="space-between" mb={4}>
                  <Group gap="xs">
                    <Box w={12} h={12} style={{ borderRadius: '50%', backgroundColor: item.color }} />
                    <Text size="sm" fw={600}>{item.name}</Text>
                  </Group>
                  <Text size="sm" fw={700}>{item.value} căn</Text>
                </Group>
                <Divider size="xs" color="gray.1" />
              </Box>
            ))}
            <Box mt="auto" p="md" bg="blue.0" style={{ borderRadius: '8px' }}>
              <Text size="xs" c="blue.8" fw={600}>
                * Dữ liệu được tính toán dựa trên tổng số {totalUnits} căn hộ hiện có trong dự án.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );

}

export default StatsRing;