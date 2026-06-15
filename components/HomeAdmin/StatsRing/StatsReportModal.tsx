"use client";

import React, { useState, useRef } from "react";
import { IconDownload } from "@tabler/icons-react";
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
  Badge,
} from "@mantine/core";
// import { PieChart } from "@mantine/charts"; // unused

// Import các types và helper function được export từ index.tsx
import {
  StatusData,
  ProjectInfo,
  AnalysisData,
  formatDuration,
  formatTimeOnly,
  formatDateVi,
} from "./index";

// Types for hot trend chart data and sorted users
interface HotTrendChartItem {
  name: string;
  value: number;
  color?: string;
}

interface SortedUser {
  id: string;
  name: string;
  email: string;
  count: number;
}

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
  activeUsersCount?: number | null;
  typeChartData?: HotTrendChartItem[];
  totalCommandsHottrend?: number;
  sortedUsers?: SortedUser[];
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
  activeUsersCount,
  typeChartData = [],
  totalCommandsHottrend = 0,
  sortedUsers = [],
}: StatsReportModalProps): JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportScrolled, setIsReportScrolled] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    try {
      // 1. Tải font chữ Roboto (Regular & Bold) hỗ trợ đầy đủ Tiếng Việt
      //    Dùng CDN pdfmake trên Cloudflare - bộ font đúng chuẩn unicode cmap cho jsPDF
      const regularUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/fonts/Roboto/Roboto-Regular.ttf";
      const boldUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/fonts/Roboto/Roboto-Medium.ttf";

      const [regRes, boldRes] = await Promise.all([
        fetch(regularUrl),
        fetch(boldUrl),
      ]);

      if (!regRes.ok || !boldRes.ok) {
        throw new Error(`Lỗi tải font: regular=${regRes.status}, bold=${boldRes.status}`);
      }

      const [regBuffer, boldBuffer] = await Promise.all([
        regRes.arrayBuffer(),
        boldRes.arrayBuffer(),
      ]);

      // Chuyển đổi array buffer của font sang base64 để nhúng vào jsPDF
      const toBase64 = (buffer: ArrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 8192; // Tránh stack overflow khi dùng spread trên mảng lớn
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
      };

      const base64Regular = toBase64(regBuffer);
      const base64Bold = toBase64(boldBuffer);
      
      // Import động để tránh lỗi SSR trong Next.js
      const jsPDF = (await import("jspdf")).default;

      const doc = new jsPDF("p", "mm", "a4");

      doc.addFileToVFS("Roboto-Regular.ttf", base64Regular);
      doc.addFileToVFS("Roboto-Medium.ttf", base64Bold);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.addFont("Roboto-Medium.ttf", "Roboto", "bold");
      doc.setFont("Roboto", "normal");

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const bottomMargin = 14;
      let y = 16;

      const addPageIfNeeded = (height: number) => {
        if (y + height > pageHeight - bottomMargin) {
          doc.addPage();
          doc.setFont("Roboto", "normal");
          y = 16;
        }
      };

      const writeText = (text: string, x: number, options?: { size?: number; bold?: boolean; align?: "left" | "center" | "right"; maxWidth?: number; lineHeight?: number }) => {
        const size = options?.size ?? 10;
        const lineHeight = options?.lineHeight ?? size * 0.42;
        doc.setFont("Roboto", options?.bold ? "bold" : "normal");
        doc.setFontSize(size);
        const lines = options?.maxWidth ? doc.splitTextToSize(text, options.maxWidth) : [text];
        addPageIfNeeded(lines.length * lineHeight);
        doc.text(lines, x, y, { align: options?.align ?? "left" });
        y += lines.length * lineHeight;
      };

      const sectionTitle = (title: string) => {
        addPageIfNeeded(12);
        y += 4;
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
        writeText(title, pageWidth / 2, { size: 10, bold: true, align: "center" });
        y += 2;
      };

              const drawTable = (headers: string[], rows: (string | number)[][], widths: number[], aligns: Array<"left" | "center" | "right"> = []) => {
          const rowPaddingY = 3;
          const cellPaddingX = 2;
          const lineHeight = 4.5;
          const drawRow = (cells: (string | number)[], isHeader = false) => {
            doc.setFont("Roboto", isHeader ? "bold" : "normal");
            doc.setFontSize(9);
            const cellLines = cells.map((cell, index) => doc.splitTextToSize(String(cell), widths[index] - cellPaddingX * 2));
            const rowHeight = Math.max(...cellLines.map((line) => line.length)) * lineHeight + rowPaddingY * 2;
            addPageIfNeeded(rowHeight);
            let x = margin;
            const startY = y;
            if (isHeader) {
              doc.setFillColor(244, 246, 248);
              doc.rect(margin, startY, widths.reduce((sum, width) => sum + width, 0), rowHeight, "F");
            }
            cells.forEach((_, index) => {
              doc.setDrawColor(205, 205, 205);
              doc.rect(x, startY, widths[index], rowHeight);
              const align = aligns[index] ?? "left";
              const textX = align === "right" ? x + widths[index] - cellPaddingX : align === "center" ? x + widths[index] / 2 : x + cellPaddingX;
              doc.text(cellLines[index], textX, startY + rowPaddingY + 3, { align });
              x += widths[index];
            });
            y += rowHeight;
          };
          drawRow(headers, true);
          rows.forEach((row) => drawRow(row));
          y += 2;
        };


      const reportDaysOnValue = analysisData ? analysisData.summary.days_on : daysOn;
      const reportTotalCommandsValue = analysisData ? analysisData.summary.total_commands : totalCommands;
      const reportAvgDailyOnValue = analysisData ? analysisData.summary.avg_daily_on : "0:00:00";
      const reportAvgDailyOnSecondsValue = analysisData ? analysisData.summary.avg_daily_on_seconds : 0;
      const reportAvgTimeOnValue = analysisData?.summary.avg_time_on || "—";
      const reportAvgTimeOffValue = analysisData?.summary.avg_time_off || "—";

      writeText("BÁO CÁO TỔNG QUAN DỰ ÁN & HOẠT ĐỘNG MÔ HÌNH", pageWidth / 2, { size: 13, bold: true, align: "center", maxWidth: pageWidth - margin * 2, lineHeight: 6 });
      y += 5;
      writeText(`Chủ đầu tư: ${projectInfo?.investor || "Đang cập nhật"}`, margin);
      writeText(`Tên dự án: ${projectInfo?.name || "Đang cập nhật"}`, margin);
      writeText(`Địa chỉ: ${projectInfo?.address || "Đang cập nhật"}`, margin, { maxWidth: pageWidth - margin * 2 });
      writeText(`Cập nhật ngày: ${new Date().toLocaleDateString("vi-VN")}`, margin);

      sectionTitle("THÔNG TIN TRẠNG THÁI CĂN HỘ");
      drawTable(
        ["STT", "Trạng thái", "Số lượng (Căn)", "Tỷ lệ (%)"],
        [...statsData.map((stat, index) => [index + 1, stat.label, stat.stats, `${stat.progress}%`]), ["", "Tổng cộng", totalUnits, "100%"]],
        [14, 82, 44, 42],
        ["center", "left", "right", "right"]
      );

      sectionTitle("THÔNG TIN HOẠT ĐỘNG MÔ HÌNH");
      drawTable(
        ["STT", "Chỉ số hoạt động", "Giá trị thực tế", "Đơn vị"],
        [
          [1, "Trạng thái hiện tại", projectStatus === 1 ? "Đang hoạt động" : projectStatus === 0 ? "Ngừng hoạt động" : "Không xác định", "-"],
          [2, "Số ngày bật mô hình", reportDaysOnValue !== null ? reportDaysOnValue.toLocaleString() : "0", "ngày"],
          [3, "Số lần điều khiển", reportTotalCommandsValue !== null ? reportTotalCommandsValue.toLocaleString() : "0", "lượt"],
          [4, "Thời gian bật trung bình/ngày", `${reportAvgDailyOnValue}${reportAvgDailyOnSecondsValue > 0 ? ` (${Math.round(reportAvgDailyOnSecondsValue)}s)` : ""}`, "thời gian"],
          [5, "Giờ bật trung bình", reportAvgTimeOnValue, "giờ"],
          [6, "Giờ tắt trung bình", reportAvgTimeOffValue, "giờ"],
          [7, "Người dùng trực tuyến", activeUsersCount != null ? activeUsersCount.toLocaleString() : "0", "người"],
        ],
        [14, 78, 58, 32],
        ["center", "left", "right", "left"]
      );

      if (analysisData && analysisData.daily_details.length > 0) {
        sectionTitle("NHẬT KÝ HOẠT ĐỘNG CHI TIẾT");
        drawTable(
          ["STT", "Ngày", "Thời gian bật", "Khung giờ bật/tắt", "Số lệnh"],
          analysisData.daily_details.map((day, index) => [
            index + 1,
            formatDateVi(day.date),
            day.total_time_on > 0 ? formatDuration(day.total_time_on) : "0s",
            day.time_on ? `${formatTimeOnly(day.time_on)} - ${formatTimeOnly(day.time_off)}` : "—",
            day.total_cmd.toLocaleString(),
          ]),
          [14, 56, 35, 48, 29],
          ["center", "left", "right", "left", "right"]
        );
      }

        // ==== NEW SECTION: Thống kê Xu hướng & Tương tác ====
        if (typeChartData && typeChartData.length > 0) {
          sectionTitle("Thống kê Xu hướng & Tương tác");
          const hotRows = typeChartData.map((item, idx) => [
            idx + 1,
            item.name,
            item.value,
            totalCommandsHottrend > 0 ? Math.round((item.value / totalCommandsHottrend) * 100) : 0,
          ]);
          hotRows.push(["Tổng cộng:", "", totalCommandsHottrend?.toLocaleString() ?? "0", "100%"]);
          drawTable(
            ["STT", "Loại lệnh", "Số lượng", "Tỷ lệ (%)"],
            hotRows,
            [14, 80, 40, 40],
            ["center", "left", "right", "right"]
          );
        }

        // ==== NEW SECTION: Top người dùng tích cực nhất ====
        if (sortedUsers && sortedUsers.length > 0) {
          sectionTitle("Top người dùng tích cực nhất");
          const topRows = sortedUsers.map((user, idx) => [
            idx + 1,
            `${user.name}\n${user.email}`,
            user.count,
          ]);
          drawTable(
            ["STT", "Người dùng", "Lượt điều khiển"],
            topRows,
            [14, 120, 40],
            ["center", "left", "right"]
          );
        }
        const pageCount = doc.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("Roboto", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Trang ${page}/${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
        doc.setTextColor(0);
      }
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
    <Modal opened={opened} onClose={onClose} title="Xem trước báo cáo" size="xl">
      <Box
        className="stats-ring-report-scroll"
        onScroll={(event) => setIsReportScrolled(event.currentTarget.scrollTop > 0)}
      >
        <Box ref={pdfRef} bg="white" p="md" className="stats-ring-report">
          <Box
            className={`stats-ring-report-header${
              isReportScrolled ? " stats-ring-report-header-scrolled" : ""
            }`}
          >
            <Title order={4} ta="center" className="stats-ring-report-title">
              BÁO CÁO TỔNG QUAN DỰ ÁN & HOẠT ĐỘNG MÔ HÌNH
            </Title>

            <Stack gap={4} mt="md">
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
          </Box>

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
              <Table.Tr>
                <Table.Td>7</Table.Td>
                <Table.Td fw={600} c="black">
                  Người dùng trực tuyến
                </Table.Td>
                <Table.Td ta="right">
                  {activeUsersCount != null ? activeUsersCount.toLocaleString() : "0"}
                </Table.Td>
                <Table.Td>người</Table.Td>
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
                      <Table.Td>{formatDateVi(day.date)}</Table.Td>
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

          {/* ==== NEW SECTION: Hottrend Summary ==== */}
          {typeChartData.length > 0 && (
            <Box mt="md">
              <Title order={5} fw={700}>Thống kê Xu hướng & Tương tác</Title>
              <Table striped highlightOnHover withTableBorder withColumnBorders mb="lg">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>STT</Table.Th>
                    <Table.Th>Loại lệnh</Table.Th>
                    <Table.Th ta="right">Số lượng</Table.Th>
                    <Table.Th ta="right">Tỷ lệ (%)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {typeChartData.map((item, idx) => (
                    <Table.Tr key={item.name}>
                      <Table.Td>{idx + 1}</Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td ta="right">{item.value.toLocaleString()}</Table.Td>
                      <Table.Td ta="right">{totalCommandsHottrend > 0 ? Math.round((item.value / totalCommandsHottrend) * 100) : 0}%</Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr fw={800}>
                    <Table.Td colSpan={2} ta="right">Tổng cộng:</Table.Td>
                    <Table.Td ta="right">{totalCommandsHottrend.toLocaleString()}</Table.Td>
                    <Table.Td ta="right">100%</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              {/* Leaderboard of top active users */}
              {sortedUsers.length > 0 && (
                <Box mt="md">
                  <Title order={5} fw={700}>Top người dùng tích cực nhất</Title>
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th w={60}>HẠNG</Table.Th>
                        <Table.Th>NGƯỜI DÙNG</Table.Th>
                        <Table.Th ta="right">LƯỢT ĐIỀU KHIỂN</Table.Th>
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
                            <Table.Td ta="right">{user.count.toLocaleString()}</Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </Box>
              )}
            </Box>
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
          font-size: 13px;
        }

        .stats-ring-report-header {
          position: sticky;
          top: 0;
          z-index: 2;
          margin: calc(var(--mantine-spacing-md) * -1)
            calc(var(--mantine-spacing-md) * -1) var(--mantine-spacing-xl);
          padding: var(--mantine-spacing-md);
          border-bottom: 1px solid #e9ecef;
          background: #ffffff;
          box-shadow: none;
          transition: box-shadow 160ms ease;
        }

        .stats-ring-report-header-scrolled {
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
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
          font-size: 17px;
          line-height: 1.35;
        }

        .stats-ring-report .mantine-Text-root,
        .stats-ring-report .mantine-Table-th,
        .stats-ring-report .mantine-Table-td {
          font-size: 12px;
          line-height: 1.45;
        }

        .stats-ring-report .mantine-Divider-label {
          font-size: 11px;
        }
      `}</style>
    </Modal>
  );
}

export default StatsReportModal;
