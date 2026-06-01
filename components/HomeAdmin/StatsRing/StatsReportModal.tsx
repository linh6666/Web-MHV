"use client";

import React, { useState, useRef } from "react";
import { IconDownload, IconPower } from "@tabler/icons-react";
import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

// Import các types và helper function được export từ index.tsx
import {
  StatusData,
  ProjectInfo,
  AnalysisData,
  formatDuration,
  formatTimeOnly,
} from "./index";

interface StatsReportModalProps {
  opened: boolean;
  onClose: () => void;
  projectInfo: ProjectInfo | null;
  statsData: StatusData[];
  totalUnits: number;
  projectStatus: number | null;
  daysOn: number | null;
  totalCommands: number | null;
  analysisData: AnalysisData | null;
}

export function StatsReportModal({
  opened,
  onClose,
  projectInfo,
  statsData,
  totalUnits,
  projectStatus,
  daysOn,
  totalCommands,
  analysisData,
}: StatsReportModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

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

  const reportDaysOn = analysisData ? analysisData.summary.days_on : daysOn;
  const reportTotalCommands = analysisData ? analysisData.summary.total_commands : totalCommands;
  const reportAvgDailyOn = analysisData ? analysisData.summary.avg_daily_on : "0:00:00";
  const reportAvgDailyOnSeconds = analysisData ? analysisData.summary.avg_daily_on_seconds : 0;
  const reportAvgTimeOn = analysisData?.summary.avg_time_on || "—";
  const reportAvgTimeOff = analysisData?.summary.avg_time_off || "—";

  return (
    <Modal opened={opened} onClose={onClose} title="Xem trước báo cáo" size="lg">
      <Box className="stats-ring-report-scroll">
        <Box ref={pdfRef} bg="white" p="md" className="stats-ring-report">
          <Title order={4} mb="xl" ta="center" className="stats-ring-report-title">
            BÁO CÁO TỔNG QUAN DỰ ÁN & HOẠT ĐỘNG MÔ HÌNH
          </Title>

          <Stack gap={4} mb="xl">
            <Text size="sm">
              <b>Chủ đầu tư:</b> {projectInfo?.investor || "Đang cập nhật"}
            </Text>
            <Text size="sm">
              <b>Tên dự án:</b> {projectInfo?.name || "Đang cập nhật"}
            </Text>
            <Text size="sm">
              <b>Địa chỉ:</b> {projectInfo?.address || "Đang cập nhật"}
            </Text>
            <Text size="sm">
              <b>Cập nhật ngày:</b> {new Date().toLocaleDateString("vi-VN")}
            </Text>
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
                  <Table.Td fw={600} c="black">
                    {stat.label}
                  </Table.Td>
                  <Table.Td ta="right">{stat.stats}</Table.Td>
                  <Table.Td ta="right">{stat.progress}%</Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr fw={800}>
                <Table.Td colSpan={2} ta="right">
                  Tổng cộng:
                </Table.Td>
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
                <Table.Td fw={600} c="black">
                  Trạng thái hiện tại
                </Table.Td>
                <Table.Td
                  ta="right"
                  c={projectStatus === 1 ? "green.6" : "red.6"}
                  fw={700}
                >
                  {projectStatus === 1
                    ? "Đang hoạt động"
                    : projectStatus === 0
                    ? "Ngừng hoạt động"
                    : "Không xác định"}
                </Table.Td>
                <Table.Td>-</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>2</Table.Td>
                <Table.Td fw={600} c="black">
                  Số ngày bật mô hình
                </Table.Td>
                <Table.Td ta="right">
                  {reportDaysOn !== null ? reportDaysOn.toLocaleString() : "0"}
                </Table.Td>
                <Table.Td>ngày</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>3</Table.Td>
                <Table.Td fw={600} c="black">
                  Số lần điều khiển
                </Table.Td>
                <Table.Td ta="right">
                  {reportTotalCommands !== null ? reportTotalCommands.toLocaleString() : "0"}
                </Table.Td>
                <Table.Td>lượt</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>4</Table.Td>
                <Table.Td fw={600} c="black">
                  Thời gian bật trung bình/ngày
                </Table.Td>
                <Table.Td ta="right">
                  {reportAvgDailyOn}
                  {reportAvgDailyOnSeconds > 0
                    ? ` (${Math.round(reportAvgDailyOnSeconds)}s)`
                    : ""}
                </Table.Td>
                <Table.Td>thời gian</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>5</Table.Td>
                <Table.Td fw={600} c="black">
                  Giờ bật trung bình
                </Table.Td>
                <Table.Td ta="right">{reportAvgTimeOn}</Table.Td>
                <Table.Td>giờ</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>6</Table.Td>
                <Table.Td fw={600} c="black">
                  Giờ tắt trung bình
                </Table.Td>
                <Table.Td ta="right">{reportAvgTimeOff}</Table.Td>
                <Table.Td>giờ</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          {analysisData && analysisData.daily_details.length > 0 && (
            <>
              <Divider my="md" label="NHẬT KÝ HOẠT ĐỘNG CHI TIẾT" labelPosition="center" />

              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>STT</Table.Th>
                    <Table.Th>Ngày</Table.Th>
                    <Table.Th ta="right">Thời gian bật</Table.Th>
                    <Table.Th>Khung giờ bật/tắt</Table.Th>
                    <Table.Th ta="right">Số lệnh</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {analysisData.daily_details.map((day, index) => (
                    <Table.Tr key={day.date}>
                      <Table.Td>{index + 1}</Table.Td>
                      <Table.Td>
                        {new Date(day.date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Table.Td>
                      <Table.Td ta="right">
                        {day.total_time_on > 0 ? formatDuration(day.total_time_on) : "0s"}
                      </Table.Td>
                      <Table.Td>
                        {day.time_on
                          ? `${formatTimeOnly(day.time_on)} - ${formatTimeOnly(day.time_off)}`
                          : "—"}
                      </Table.Td>
                      <Table.Td ta="right">{day.total_cmd.toLocaleString()}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Box>
      </Box>

      <Group justify="flex-end" mt="md" className="stats-ring-modal-actions">
        <Button variant="default" onClick={onClose}>
          Đóng
        </Button>
        <Button
          leftSection={<IconDownload size={18} />}
          onClick={handleDownloadPDF}
          loading={isDownloading}
          color="blue"
        >
          Tải file PDF
        </Button>
      </Group>

      <style jsx global>{`
        .stats-ring-report {
          font-size: 12px;
        }

        .stats-ring-report-scroll {
          max-height: calc(80vh - 120px);
          overflow-y: auto;
          padding-right: 6px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .stats-ring-report-scroll::-webkit-scrollbar {
          display: none;
        }

        .stats-ring-modal-actions {
          position: sticky;
          bottom: 0;
          z-index: 2;
          margin-left: calc(var(--mantine-spacing-md) * -1);
          margin-right: calc(var(--mantine-spacing-md) * -1);
          margin-bottom: calc(var(--mantine-spacing-md) * -1);
          padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
          border-top: 1px solid #e9ecef;
          background: #ffffff;
        }

        .stats-ring-report-title {
          font-size: 15px;
          line-height: 1.35;
        }

        .stats-ring-report .mantine-Text-root,
        .stats-ring-report .mantine-Table-th,
        .stats-ring-report .mantine-Table-td {
          font-size: 11px;
          line-height: 1.35;
        }

        .stats-ring-report .mantine-Divider-label {
          font-size: 10px;
        }
      `}</style>
    </Modal>
  );
}

export default StatsReportModal;
