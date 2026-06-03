"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconSmartHome,
  IconChartDonut,
  IconDownload,
  IconCpu,
  IconActivity,
  IconPower,
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
  Button,
  ThemeIcon,
  Flex,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { PieChart, BarChart } from "@mantine/charts";
// import "@mantine/charts/styles.css";

import { getListProject } from "../../../api/apigetlistProject";
import {  getListDevice} from "../../../api/apiGetDevice";
import { getListProjectControl} from "../../../api/apigetlistProjectControl";
import { getListanalysis} from "../../../api/apiGetanalysis";
import { getListActiveUsers} from "../../../api/apiGetlistActiveUsers";

import { StatsReportModal } from "./StatsReportModal";


// Định nghĩa interface để code sạch và chuyên nghiệp hơn
export interface StatusData {
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

export interface ProjectInfo {
  investor?: string;
  name?: string;
  address?: string;
}

interface AnalysisSummary {
  avg_daily_on_seconds: number;
  avg_daily_on: string;
  avg_time_on: string | null;
  avg_time_off: string | null;
  days_on: number;
  total_commands: number;
}

interface DailyDetail {
  date: string;
  total_time_on: number;
  time_on: string | null;
  time_off: string | null;
  total_cmd: number;
}

export interface AnalysisData {
  project_id: string;
  summary: AnalysisSummary;
  daily_details: DailyDetail[];
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export const formatDuration = (seconds: number) => {
  if (seconds === 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return parts.join(" ");
};

export const formatTimeOnly = (isoString: string | null) => {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
};

export function StatsRing() {
  const [statsData, setStatsData] = useState<StatusData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [daysOn, setDaysOn] = useState<number | null>(null);
  const [totalCommands, setTotalCommands] = useState<number | null>(null);
  const [projectStatus, setProjectStatus] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);

  const isMobile = useMediaQuery("(max-width: 576px)") ?? false;
  const isTablet = useMediaQuery("(max-width: 768px)") ?? false;

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Gọi song song các API để tăng tốc độ tải trang
        const [projectResResult, deviceResResult, controlResResult] = await Promise.allSettled([
          getListProject({ token, skip: 0, limit: 1 }),
          getListDevice({ token, skip: 0, limit: 1 }),
          getListProjectControl({ token, skip: 0, limit: 1 }),
        ]);

        // 1. Xử lý dữ liệu dự án
        if (projectResResult.status === "fulfilled") {
          const res = projectResResult.value;
          if (res?.data && res.data.length > 0) {
            const project = res.data[0];
            const statuses = project.unit_status_summary?.statuses || [];
            const total = project.unit_status_summary?.total_units || 0;
            
            setTotalUnits(total);
            setProjectInfo({
              investor: project.investor,
              name: project.name,
              address: project.address,
            });

            // Gọi API phân tích sử dụng project.id
            if (project.id) {
              try {
                const analysisRes = await getListanalysis(project.id);
                setAnalysisData(analysisRes);
                console.log("✅ Loaded analysis data:", analysisRes);
              } catch (error) {
                console.error("❌ Lỗi khi tải API getListanalysis:", error);
              }
            }

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
        } else {
          console.error("Lỗi tải API Dự án:", projectResResult.reason);
        }

        // 2. Xử lý dữ liệu thiết bị
        if (deviceResResult.status === "fulfilled") {
          const deviceRes = deviceResResult.value;
          if (deviceRes?.data) {
            let days_on = 0;
            let total_commands = 0;

            if (Array.isArray(deviceRes.data)) {
              const dev = deviceRes.data[0] || {};
              days_on = dev.days_on ?? 0;
              total_commands = dev.total_commands ?? 0;
            } else {
              days_on = deviceRes.data.days_on ?? 0;
              total_commands = deviceRes.data.total_commands ?? 0;
            }

            setDaysOn(days_on);
            setTotalCommands(total_commands);
          }
        } else {
          console.error("Lỗi tải API Thiết bị:", deviceResResult.reason);
        }

        // 3. Xử lý dữ liệu project control
        if (controlResResult.status === "fulfilled") {
          const controlRes = controlResResult.value;
          if (controlRes?.data && controlRes.data.length > 0) {
            setProjectStatus(controlRes.data[0].status ?? null);
          }
        } else {
          console.error("Lỗi tải API Control:", controlResResult.reason);
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
        radius="md" 
        p="sm" 
        key={stat.label}
        style={{
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default'
        }}
        shadow="xs"
      >
        <Group justify="space-between" wrap="nowrap">
          <Box>
            <Text c="dimmed" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
              {stat.label}
            </Text>
            <Text fw={800} size="20px" mt={2}>
              {stat.stats}
            </Text>
          </Box>

          <RingProgress
            size={50}
            roundCaps
            thickness={5}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={14} stroke={2} color={stat.color} />
              </Center>
            }
          />
        </Group>
      </Paper>
    );
  });



  return (
    <Box className="stats-ring-root">
      <Stack gap="md" className="stats-ring-layout">
        {/* HEADER SECTION */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap="md"
        >
          <Box>
            <Title order={4} fw={800}>Báo cáo tổng quan</Title>
            <Text c="dimmed" size="xs">
              Số liệu thống kê thời gian thực từ hệ thống
              {/* {analysisData && ` - Phân tích: ${analysisData.summary.total_commands.toLocaleString()} lệnh`} */}
            </Text>
          </Box>
          <Flex
            gap="xs"
            wrap="wrap"
            w={{ base: "100%", sm: "auto" }}
            justify={{ base: "space-between", sm: "flex-end" }}
          >
            <Paper withBorder radius="md" px="xs" py="4px" bg="gray.0">
              <Group gap="5px">
                <IconSmartHome size={16} color="gray" />
                <Text style={{ fontSize: "11px" }} fw={600}>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</Text>
              </Group>
            </Paper>
            <Button
              leftSection={<IconDownload size={14} />}
              color="blue"
              size="xs"
              onClick={() => setOpened(true)}
            >
              Xem báo cáo PDF
            </Button>
          </Flex>
        </Flex>

      <Box className="stats-ring-scroll-content">
        {/* STATS CARDS */}
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="sm">
          {stats}
        </SimpleGrid>

        {/* DEVICE ACTIVITY SECTION */}
        <Box>
          <Group gap="xs" align="center" mb="xs">
            <Title order={6} fw={850} style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563' }}>Hoạt động của mô hình</Title>
            {projectStatus !== null && (
              <Group gap={6}>
                <ThemeIcon size={20} radius="xl" variant="light" color={projectStatus === 1 ? "green" : "red"}>
                  <IconPower size={14} />
                </ThemeIcon>
                <Text size="xs" fw={700} c={projectStatus === 1 ? "green.6" : "red.6"}>
                  {projectStatus === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Text>
              </Group>
            )}
          </Group>

        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="sm">
          {/* Card 1: Số ngày bật */}
          <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderColor: "#bfdbfe",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            shadow="xs"
          >
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text c="blue.7" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
                  Số ngày bật mô hình
                </Text>
                <Text fw={800} size="18px" mt={2} c="blue.9" style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  {analysisData ? analysisData.summary.days_on.toLocaleString() : (daysOn !== null ? daysOn.toLocaleString() : "0")}
                  <Text component="span" style={{ fontSize: "10px" }} fw={700} c="blue.7"> ngày</Text>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconCpu size={16} />
              </ThemeIcon>
            </Group>
          </Paper>

          {/* Card 2: Số lần điều khiển */}
          <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
              background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
              borderColor: "#e9d5ff",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            shadow="xs"
          >
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text c="purple.7" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
                  Số lần điều khiển
                </Text>
                <Text fw={800} size="18px" mt={2} c="purple.9" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  {analysisData ? analysisData.summary.total_commands.toLocaleString() : (totalCommands !== null ? totalCommands.toLocaleString() : "0")}
                  <Text component="span" style={{ fontSize: "10px" }} fw={700} c="purple.7"> lượt</Text>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'purple', to: 'pink' }}>
                <IconActivity size={16} />
              </ThemeIcon>
            </Group>
          </Paper>

          {/* Card 3: Thời gian bật TB / Ngày */}
          <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              borderColor: "#bbf7d0",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            shadow="xs"
          >
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text c="green.7" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
                  Thời gian bật TB/Ngày
                </Text>
                <Text fw={800} size="18px" mt={2} c="green.9" style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  {analysisData ? analysisData.summary.avg_daily_on : "0:00:00"}
                  {analysisData && analysisData.summary.avg_daily_on_seconds > 0 && (
                    <Text component="span" style={{ fontSize: "10px" }} fw={700} c="green.7"> ({Math.round(analysisData.summary.avg_daily_on_seconds)}s)</Text>
                  )}
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
                <IconSmartHome size={16} />
              </ThemeIcon>
            </Group>
          </Paper>

          {/* Card 4: Khung giờ bật/tắt TB */}
          <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
              background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
              borderColor: "#fed7aa",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            shadow="xs"
          >
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text c="orange.7" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
                  Khung giờ hoạt động TB
                </Text>
                <Text fw={850} size="11px" mt={2} c="orange.9" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span>Bật: {analysisData?.summary.avg_time_on ? analysisData.summary.avg_time_on : "—"}</span>
                  <span>Tắt: {analysisData?.summary.avg_time_off ? analysisData.summary.avg_time_off : "—"}</span>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                <IconPower size={16} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>
      </Box>

      {/* ANALYSIS CHART & HISTORY SECTION */}
      {analysisData && analysisData.daily_details && analysisData.daily_details.length > 0 && (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {/* Daily Command Chart */}
          <Paper withBorder radius="md" p="md" shadow="xs">
            <Group mb="md" justify="space-between">
              <Group gap="xs">
                <IconChartDonut size={20} color="violet" />
                <Title order={5} fw={700}>Tần suất lệnh điều khiển</Title>
              </Group>
              <Text size="xs" c="dimmed">Hoạt động 9 ngày gần nhất</Text>
            </Group>

            <Box h={220} mt="lg">
              <BarChart
                h={200}
                data={[...analysisData.daily_details].reverse().map(item => ({
                  date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                  "Số lệnh": item.total_cmd,
                }))}
                dataKey="date"
                series={[{ name: "Số lệnh", color: "violet" }]}
                tickLine="y"
                gridAxis="xy"
                withLegend={false}
              />
            </Box>
          </Paper>

          {/* Daily Details History Log */}
          <Paper withBorder radius="md" p="md" shadow="xs">
            <Title order={5} fw={700} mb="md">Nhật ký hoạt động chi tiết</Title>
            <ScrollArea h={220} offsetScrollbars>
              <Stack gap="xs" pr="xs">
                {analysisData.daily_details.map((day, idx) => (
                  <Box key={day.date} p="xs" style={{ borderRadius: '8px', border: '1px solid #f1f3f5', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Box>
                        <Text size="xs" fw={700}>{new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                        <Group gap="md" mt={4}>
                          <Text size="10px" c="dimmed">
                            Thời gian bật: <span style={{ fontWeight: 600, color: '#495057' }}>{day.total_time_on > 0 ? formatDuration(day.total_time_on) : "0s"}</span>
                          </Text>
                          {day.time_on && (
                            <Text size="10px" c="dimmed">
                              Khung giờ: <span style={{ fontWeight: 600, color: '#495057' }}>{formatTimeOnly(day.time_on)} - {formatTimeOnly(day.time_off)}</span>
                            </Text>
                          )}
                        </Group>
                      </Box>
                      <Badge color={day.total_cmd > 0 ? "violet" : "gray"} variant="light" size="sm">
                        {day.total_cmd.toLocaleString()} lệnh
                      </Badge>
                    </Group>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          </Paper>
        </SimpleGrid>
      )}

      {/* CHART SECTION */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper withBorder radius="md" p="md" shadow="xs">
          <Group mb="md" justify="space-between">
            <Group gap="xs">
              <IconChartDonut size={20} color="blue" />
              <Title order={5} fw={700}>Phân bổ trạng thái</Title>
            </Group>
          </Group>

          <Box pos="relative" h={240}>
            <Center h="100%">
              <PieChart
                data={chartData}
                withTooltip
                tooltipDataSource="segment"
                strokeWidth={2}
                size={isMobile ? 160 : isTablet ? 200 : 240}
                withLabels
                labelsPosition="outside"
                labelsType="percent"
                pieProps={{ 
                  innerRadius: isMobile ? 50 : isTablet ? 65 : 80, 
                  outerRadius: isMobile ? 70 : isTablet ? 85 : 100, 
                  paddingAngle: 0.5 
                }}
              />
              {/* TOTAL TEXT IN CENTER */}
              <Stack gap={0} align="center" pos="absolute" style={{ pointerEvents: 'none' }}>
                <Text style={{ fontSize: "10px" }} c="dimmed" tt="uppercase" fw={800}>Tổng số</Text>
                <Text size={isMobile ? "18px" : "24px"} fw={900} style={{ lineHeight: 1 }}>{totalUnits}</Text>
                <Text style={{ fontSize: "10px" }} c="dimmed" fw={600}>Căn hộ</Text>
              </Stack>
            </Center>
          </Box>
        </Paper>

        <Paper withBorder radius="md" p="md" shadow="xs">
          <Title order={5} fw={700} mb="md">Chi tiết tỷ trọng</Title>
          <Stack gap="xs">
            {chartData.map((item) => (
              <Box key={item.name}>
                <Group justify="space-between" mb={4}>
                  <Group gap="xs">
                    <Box w={10} h={10} style={{ borderRadius: '50%', backgroundColor: item.color }} />
                    <Text size="xs" fw={600}>{item.name}</Text>
                  </Group>
                  <Text size="xs" fw={700}>{item.value} căn</Text>
                </Group>
                <Divider size="xs" color="gray.1" />
              </Box>
            ))}
            <Box mt="sm" p="xs" bg="blue.0" style={{ borderRadius: '8px' }}>
              <Text style={{ fontSize: "11px" }} c="blue.8" fw={600}>
                * Dữ liệu được tính toán dựa trên tổng số {totalUnits} căn hộ hiện có trong dự án.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
      </Box>
      </Stack>

      {/* Modal View & Download PDF */}
      <StatsReportModal
        opened={opened}
        onClose={() => setOpened(false)}
        projectInfo={projectInfo}
        statsData={statsData}
        totalUnits={totalUnits}
        projectStatus={projectStatus}
        daysOn={daysOn}
        totalCommands={totalCommands}
        analysisData={analysisData}
      />

      <style jsx global>{`
        .stats-ring-scroll-content {
          display: flex;
          flex-direction: column;
          gap: var(--mantine-spacing-md);
          max-height: 65vh;
          overflow-y: auto;
          padding-right: 8px;
          padding-bottom: 24px;
          box-sizing: border-box;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .stats-ring-root,
        .stats-ring-layout {
          min-height: 0;
        }

        @media (max-width: 768px) {
          .stats-ring-scroll-content {
            max-height: 55vh;
          }
        }

        .stats-ring-scroll-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Box>
  );

}

export default StatsRing;
