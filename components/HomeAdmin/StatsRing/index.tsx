"use client";

import React, { useEffect, useState } from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconSmartHome,
  IconChartDonut,
  IconDownload,
  IconCpu,
  IconActivity,
  IconPower,
  IconUsers,
  IconFlame,
  IconRefresh,
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
  Grid,
  Select,
  TextInput,
  Table,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { PieChart, BarChart } from "@mantine/charts";
// import "@mantine/charts/styles.css";

import { getListProject } from "../../../api/apigetlistProject";
import {  getListDevice} from "../../../api/apiGetDevice";
import { getListProjectControl} from "../../../api/apigetlistProjectControl";
import { getListanalysis} from "../../../api/apiGetanalysis";
import { getListActiveUsers} from "../../../api/apiGetlistActiveUsers";
import { getListHottrend} from "../../../api/apiGetlistHottrend";
import { getListUser } from "../../../api/apigetlistuse";

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

interface ActiveUser {
  id?: string | number;
  full_name?: string | null;
  email?: string | null;
}

export interface AnalysisData {
  project_id: string;
  summary: AnalysisSummary;
  daily_details: DailyDetail[];
}

interface HottrendData {
  metric_name?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  data?: {
    types?: Record<string, number>;
    users?: Record<string, number>;
  };
}

interface UserRecord {
  id?: string | number;
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
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
    if (isoString.includes("T")) {
      const timePart = isoString.split("T")[1];
      return timePart.split(".")[0];
    }
    return isoString.split(".")[0];
  } catch {
    return isoString;
  }
};

export const formatDateVi = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const weekday = days[date.getDay()];
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${weekday}, ${dd}/${mm}/${y}`;
  } catch {
    return dateStr;
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
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);
  const [activeUsersList, setActiveUsersList] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);

  // States for Hot Trend
  const [projectId, setProjectId] = useState<string>("");
  const [hottrendData, setHottrendData] = useState<HottrendData | null>(null);
  const [hottrendLoading, setHottrendLoading] = useState(false);
  const [metricName] = useState("cmd_daily_overview");
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // 30 ngày trước
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [usersMap, setUsersMap] = useState<Record<string, { full_name: string; email: string }>>({});

  const isMobile = useMediaQuery("(max-width: 576px)") ?? false;
  const isTablet = useMediaQuery("(max-width: 768px)") ?? false;

  const fetchHottrendData = async (
    projId: string,
    mName: string,
    pPeriod: string,
    sDate: string,
    eDate: string
  ) => {
    if (!projId) return;
    setHottrendLoading(true);
    try {
      const res = await getListHottrend(projId, {
        metric_name: mName,
        period: pPeriod,
        start_date: sDate,
        end_date: eDate,
      });
      setHottrendData(res);
      console.log("✅ Loaded hot trend data:", res);
    } catch (error) {
      console.error("❌ Lỗi khi tải API getListHottrend:", error);
    } finally {
      setHottrendLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Gọi song song các API để tăng tốc độ tải trang
        const [projectResResult, deviceResResult, controlResResult, activeUsersResResult] = await Promise.allSettled([
          getListProject({ token, skip: 0, limit: 1 }),
          getListDevice({ token, skip: 0, limit: 1 }),
          getListProjectControl({ token, skip: 0, limit: 1 }),
          getListActiveUsers(),
        ]);

        // 0. Tải danh sách user để map thông tin người dùng trong hot trend
        try {
          const usersRes = await getListUser({ token, skip: 0, limit: 100 });
          if (usersRes?.data) {
            const map: Record<string, { full_name: string; email: string }> = {};
            usersRes.data.forEach((u: UserRecord) => {
              if (u.id) {
                map[String(u.id)] = {
                  full_name: u.full_name || u.name || "Chưa đặt tên",
                  email: u.email || "Không có email",
                };
              }
            });
            setUsersMap(map);
          }
        } catch (error) {
          console.error("Lỗi khi tải API getListUser:", error);
        }

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
              setProjectId(project.id);
              try {
                const analysisRes = await getListanalysis(project.id);
                setAnalysisData(analysisRes);
                console.log("✅ Loaded analysis data:", analysisRes);
              } catch (error) {
                console.error("❌ Lỗi khi tải API getListanalysis:", error);
              }

              // Gọi API hottrend
              const defaultEnd = new Date().toISOString().split("T")[0];
              const d = new Date();
              d.setDate(d.getDate() - 30);
              const defaultStart = d.toISOString().split("T")[0];
              fetchHottrendData(project.id, "cmd_daily_overview", "daily", defaultStart, defaultEnd);
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

        // 4. Xử lý dữ liệu người dùng trực tuyến
        if (activeUsersResResult.status === "fulfilled") {
          const activeUsersRes = activeUsersResResult.value;
          if (activeUsersRes) {
            setActiveUsersCount(activeUsersRes.total ?? 0);
            setActiveUsersList(activeUsersRes.data || []);
            // Thêm các user online vào usersMap nếu chưa có
            activeUsersRes.data.forEach((u: UserRecord) => {
              if (u.id) {
                setUsersMap(prev => ({
                  ...prev,
                  [String(u.id)]: {
                    full_name: u.full_name || "Chưa đặt tên",
                    email: u.email || "Không có email"
                  }
                }));
              }
            });
          }
        } else {
          console.error("Lỗi tải API Người dùng trực tuyến:", activeUsersResResult.reason);
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

  // Map Hot Trend command types for PieChart/BarChart
  const typesData = hottrendData?.data?.types || {};
  const typeChartData = Object.entries(typesData).map(([key, val]) => {
    let name = key;
    let color = "#3b82f6"; // default blue
    if (key === "all") { name = "Tất cả"; color = "#10b981"; }
    else if (key === "eff") { name = "Hiệu ứng"; color = "#f59e0b"; }
    else if (key === "one") { name = "Đơn lẻ"; color = "#3b82f6"; }
    else if (key === "filter") { name = "Bộ lọc"; color = "#8b5cf6"; }
      else if (key === "mapping") { name = "Projection Mapping"; color = "#294b61"; }

    return {
      name,
      value: Number(val),
      color,
    };
  });

  const totalCommandsHottrend = Object.values(typesData).reduce((sum: number, val: unknown) => sum + Number(val), 0);

  // Map Hot Trend users leaderboard
  const usersData = hottrendData?.data?.users || {};
  const sortedUsers = Object.entries(usersData)
    .map(([userId, count]) => {
      const userDetail = usersMap[userId] || {
        full_name: `User ${userId.slice(0, 8)}`,
        email: "Chưa cập nhật thông tin"
      };
      return {
        id: userId,
        name: userDetail.full_name,
        email: userDetail.email,
        count: Number(count),
      };
    })
    .sort((a, b) => b.count - a.count);

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

        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 5 }} spacing="sm">
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

          {/* Card 5: Người dùng trực tuyến */}
          <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
              background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
              borderColor: "#a5b4fc",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            shadow="xs"
          >
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text c="indigo.7" style={{ fontSize: "10px" }} tt="uppercase" fw={800}>
                  Người dùng trực tuyến
                </Text>
                <Text fw={800} size="18px" mt={2} c="indigo.9" style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  {activeUsersCount !== null ? activeUsersCount.toLocaleString() : "0"}
                  <Text component="span" style={{ fontSize: "10px" }} fw={700} c="indigo.7"> người</Text>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'indigo', to: 'violet' }}>
                <IconUsers size={16} />
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
                data={[...analysisData.daily_details].reverse().map(item => {
                  const parts = item.date.split("-");
                  const shortDate = parts.length >= 3 ? `${parts[2]}/${parts[1]}` : item.date;
                  return {
                    date: shortDate,
                    "Số lệnh": item.total_cmd,
                  };
                })}
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
                        <Text size="xs" fw={700}>{formatDateVi(day.date)}</Text>
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

      {/* HOT TREND SECTION */}
      <Paper withBorder radius="md" p="md" shadow="xs" style={{ position: "relative" }}>
        {hottrendLoading && (
          <Center
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
              borderRadius: "8px",
            }}
          >
            <Loader size="md" variant="dots" color="orange" />
          </Center>
        )}

        <Stack gap="md">
          {/* Header */}
          <Flex direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }} gap="xs">
            <Box>
              <Group gap="xs" mb={4}>
                <ThemeIcon size={28} radius="md" variant="light" color="orange">
                  <IconFlame size={16} />
                </ThemeIcon>
                <Title order={5} fw={700}>Thống kê Xu hướng & Tương tác</Title>
              </Group>
              <Text size="xs" c="dimmed" pl={36}>
                Phân tích tần suất gửi lệnh và xếp hạng người dùng hoạt động tích cực
              </Text>
            </Box>

            {/* Filter controls inline */}
            <Group gap="xs" wrap="wrap" w={{ base: "100%", sm: "auto" }}>
              <TextInput
                type="date"
                label="Từ ngày"
                size="xs"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                styles={{ label: { fontSize: "10px", fontWeight: 700 } }}
              />
              <TextInput
                type="date"
                label="Đến ngày"
                size="xs"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                styles={{ label: { fontSize: "10px", fontWeight: 700 } }}
              />
              <Select
                label="Chu kỳ"
                size="xs"
                w={110}
                value={period}
                onChange={(val) => setPeriod(val || "daily")}
                data={[
                  { value: "daily", label: "Hàng ngày" },
                  { value: "weekly", label: "Hàng tuần" },
                  { value: "monthly", label: "Hàng tháng" },
                ]}
                styles={{ label: { fontSize: "10px", fontWeight: 700 } }}
              />
              <Button
                size="xs"
                color="orange"
                onClick={() => fetchHottrendData(projectId, metricName, period, startDate, endDate)}
                leftSection={<IconRefresh size={14} />}
                style={{ alignSelf: "flex-end" }}
              >
                Cập nhật
              </Button>
            </Group>
          </Flex>

          <Divider size="xs" color="gray.1" />

          {/* Results grid */}
          <Grid gutter="md">
            {/* Left: Chart of command types */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper withBorder radius="md" p="sm" bg="gray.0">
                <Text fw={750} size="xs" c="gray.7" tt="uppercase" mb="xs">Phân bổ loại lệnh ({totalCommandsHottrend} lệnh)</Text>
                
                {typeChartData.length > 0 ? (
                  <Box pos="relative" h={200}>
                    <Center h="100%">
                      <PieChart
                        data={typeChartData}
                        withTooltip
                        tooltipDataSource="segment"
                        strokeWidth={1.5}
                        size={140}
                        pieProps={{
                          innerRadius: 45,
                          outerRadius: 60,
                          paddingAngle: 1,
                        }}
                      />
                      <Stack gap={0} align="center" pos="absolute" style={{ pointerEvents: 'none' }}>
                        <Text style={{ fontSize: "9px" }} c="dimmed" tt="uppercase" fw={800}>TỔNG LỆNH</Text>
                        <Text size="lg" fw={900}>{totalCommandsHottrend}</Text>
                      </Stack>
                    </Center>
                  </Box>
                ) : (
                  <Center h={200}>
                    <Text size="xs" c="dimmed">Không có dữ liệu loại lệnh</Text>
                  </Center>
                )}

                {/* Legend list */}
                <Stack gap="xs" mt="xs">
                  {typeChartData.map((item) => (
                    <Group key={item.name} justify="space-between" style={{ fontSize: "11px" }}>
                      <Group gap="xs">
                        <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: item.color }} />
                        <Text fw={600} c="gray.8">{item.name}</Text>
                      </Group>
                      <Text fw={700}>{item.value} ({totalCommandsHottrend > 0 ? Math.round((item.value / totalCommandsHottrend) * 100) : 0}%)</Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Right: Leaderboard of top users */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper withBorder radius="md" p="sm" bg="gray.0" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
                <Text fw={750} size="xs" c="gray.7" tt="uppercase" mb="xs">Top người dùng tích cực nhất</Text>
                
                <ScrollArea h={220} offsetScrollbars style={{ flexGrow: 1 }}>
                  {sortedUsers.length > 0 ? (
                    <Table verticalSpacing="xs" horizontalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr style={{ fontSize: "10px", color: "gray" }}>
                          <Table.Th w={60}>HẠNG</Table.Th>
                          <Table.Th>NGƯỜI DÙNG</Table.Th>
                          <Table.Th align="right" style={{ textAlign: 'right' }}>LƯỢT ĐIỀU KHIỂN</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {sortedUsers.map((user, idx) => {
                          const rank = idx + 1;
                          let rankBadgeColor = "gray";
                          let rankBadgeVariant = "light";
                          if (rank === 1) { rankBadgeColor = "yellow"; rankBadgeVariant = "filled"; }
                          else if (rank === 2) { rankBadgeColor = "blue"; rankBadgeVariant = "filled"; }
                          else if (rank === 3) { rankBadgeColor = "orange"; rankBadgeVariant = "filled"; }
                          
                          return (
                            <Table.Tr key={user.id} style={{ fontSize: "11px" }}>
                              <Table.Td>
                                <Badge size="xs" color={rankBadgeColor} variant={rankBadgeVariant} style={{ width: '22px', height: '22px', padding: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {rank}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Box>
                                  <Text size="xs" fw={700}>{user.name}</Text>
                                  <Text style={{ fontSize: '9px' }} c="dimmed">{user.email}</Text>
                                </Box>
                              </Table.Td>
                              <Table.Td align="right" style={{ textAlign: 'right', fontWeight: 800, color: 'var(--mantine-color-orange-filled)' }}>
                                {user.count.toLocaleString()}
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  ) : (
                    <Center h={180}>
                      <Text size="xs" c="dimmed">Không tìm thấy dữ liệu tương tác người dùng</Text>
                    </Center>
                  )}
                </ScrollArea>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>

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

      {/* ACTIVE USERS LIST SECTION */}
      {activeUsersList.length > 0 && (
        <Paper withBorder radius="md" p="md" shadow="xs" mt="md">
          <Group mb="md" justify="space-between">
            <Group gap="xs">
              <IconUsers size={20} color="teal" />
              <Title order={5} fw={700}>Danh sách người dùng đang online</Title>
            </Group>
            <Badge color="teal" variant="light">{activeUsersList.length} đang hoạt động</Badge>
          </Group>
          <ScrollArea h={180} offsetScrollbars>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {activeUsersList.map((user, idx) => (
                <Paper key={user.id || idx} withBorder p="xs" radius="sm" bg="gray.0">
                  <Group wrap="nowrap" gap="xs">
                    <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                      <IconUsers size={14} />
                    </ThemeIcon>
                    <Box style={{ overflow: 'hidden' }}>
                      <Text size="xs" fw={700} truncate="end">{user.full_name || "Chưa đặt tên"}</Text>
                      <Text size="10px" c="dimmed" truncate="end">{user.email || "Không có email"}</Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
          </ScrollArea>
        </Paper>
      )}
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
          startDate={startDate}
          endDate={endDate}
          typeChartData={typeChartData}
          totalCommandsHottrend={totalCommandsHottrend}
          sortedUsers={sortedUsers}
          analysisData={analysisData}
          activeUsersCount={activeUsersCount}
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
