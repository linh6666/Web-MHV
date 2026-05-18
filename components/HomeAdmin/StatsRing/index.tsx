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
  Modal,
  Table,
  ThemeIcon,
  Flex,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { PieChart } from "@mantine/charts";
// import "@mantine/charts/styles.css";

import { getListProject } from "../../../api/apigetlistProject";
import {  getListDevice} from "../../../api/apiGetDevice";

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

interface ProjectInfo {
  investor?: string;
  name?: string;
  address?: string;
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function StatsRing() {
  const [statsData, setStatsData] = useState<StatusData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [daysOn, setDaysOn] = useState<number | null>(null);
  const [totalCommands, setTotalCommands] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [opened, setOpened] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width: 576px)") ?? false;
  const isTablet = useMediaQuery("(max-width: 768px)") ?? false;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    try {
      // Import động để tránh lỗi SSR trong Next.js
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2, // Tăng độ phân giải ảnh
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff", // Nền trắng để không bị đen nền khi tạo pdf
      });

      const imgWidth = 210; // Kích thước A4 (mm)
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const doc = new jsPDF("p", "mm", "a4");

      doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 10, imgWidth, imgHeight);
      doc.save("Bao_Cao_Trang_Thai_Du_An.pdf");
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Gọi song song hai API để tăng tốc độ tải trang
        const [projectResResult, deviceResResult] = await Promise.allSettled([
          getListProject({ token, skip: 0, limit: 1 }),
          getListDevice({ token, skip: 0, limit: 1 }),
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
    <Box>
      <Stack gap="md">
        {/* HEADER SECTION */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap="md"
        >
          <Box>
            <Title order={4} fw={800}>Báo cáo tổng quan</Title>
            <Text c="dimmed" size="xs">Số liệu thống kê thời gian thực từ hệ thống</Text>
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

      {/* STATS CARDS */}
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="sm">
        {stats}
      </SimpleGrid>

      {/* DEVICE ACTIVITY SECTION */}
      <Box>
        <Title order={6} fw={850} style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563' }}>Hoạt động của mô hình</Title>
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm" mt="xs">
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
                  {daysOn !== null ? daysOn.toLocaleString() : "0"}
                  <Text component="span" style={{ fontSize: "10px" }} fw={700} c="blue.7"> ngày</Text>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconCpu size={16} />
              </ThemeIcon>
            </Group>
          </Paper>

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
                  {totalCommands !== null ? totalCommands.toLocaleString() : "0"}
                  <Text component="span" style={{ fontSize: "10px" }} fw={700} c="purple.7"> lượt</Text>
                </Text>
              </Box>
              <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'purple', to: 'pink' }}>
                <IconActivity size={16} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>
      </Box>

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
      </Stack>

      {/* Modal View & Download PDF */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Xem trước báo cáo" size="lg">
        <Box ref={pdfRef} bg="white" p="md">
          <Title order={4} mb="xl" ta="center">BÁO CÁO TỔNG QUAN DỰ ÁN & HOẠT ĐỘNG MÔ HÌNH</Title>
          
          <Stack gap={4} mb="xl">
            <Text size="sm"><b>Chủ đầu tư:</b> {projectInfo?.investor || "Đang cập nhật"}</Text>
            <Text size="sm"><b>Tên dự án:</b> {projectInfo?.name || "Đang cập nhật"}</Text>
            <Text size="sm"><b>Địa chỉ:</b> {projectInfo?.address || "Đang cập nhật"}</Text>
            <Text size="sm"><b>Cập nhật ngày:</b> {new Date().toLocaleDateString('vi-VN')}</Text>
          </Stack>

          <Divider my="md" label="THÔNG TIN TRẠNG THÁI CĂN HỘ" labelPosition="center" />
          
          <Table striped highlightOnHover withTableBorder withColumnBorders mb="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>STT</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th ta="right">Số lượng (Căn)</Table.Th>
                <Table.Th ta="right">Tỷ lệ (%)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {statsData.map((stat, index) => (
                <Table.Tr key={stat.label}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td fw={600} c="black">{stat.label}</Table.Td>
                  <Table.Td ta="right">{stat.stats}</Table.Td>
                  <Table.Td ta="right">{stat.progress}%</Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr fw={800}>
                <Table.Td colSpan={2} ta="right">Tổng cộng:</Table.Td>
                <Table.Td ta="right">{totalUnits}</Table.Td>
                <Table.Td ta="right">100%</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Divider my="md" label="THÔNG TIN HOẠT ĐỘNG MÔ HÌNH" labelPosition="center" />

          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>STT</Table.Th>
                <Table.Th>Chỉ số hoạt động</Table.Th>
                <Table.Th ta="right">Giá trị thực tế</Table.Th>
                <Table.Th>Đơn vị</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>1</Table.Td>
                <Table.Td fw={600} c="black">Số ngày bật mô hình</Table.Td>
                <Table.Td ta="right">{daysOn !== null ? daysOn.toLocaleString() : "0"}</Table.Td>
                <Table.Td>ngày</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>2</Table.Td>
                <Table.Td fw={600} c="black">Số lần điều khiển</Table.Td>
                <Table.Td ta="right">{totalCommands !== null ? totalCommands.toLocaleString() : "0"}</Table.Td>
                <Table.Td>lượt</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setOpened(false)}>Đóng</Button>
          <Button 
            leftSection={<IconDownload size={18} />} 
            onClick={handleDownloadPDF} 
            loading={isDownloading}
            color="blue"
          >
            Tải file PDF
          </Button>
        </Group>
      </Modal>
    </Box>
  );

}

export default StatsRing;