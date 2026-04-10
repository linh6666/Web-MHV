"use client";

import {
  Card,
  Text,
  Stack,
  Title,
  Group,
  ScrollArea,
  Badge,

} from "@mantine/core";
import { useEffect, useState } from "react";
import { getListCustomer } from "../../../../api/apigetlistcustomer";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconUserPlus,
} from "@tabler/icons-react";
import classes from "./ProjectDetail.module.css";

/* =======================
   TYPE
======================= */
interface Project {
  id: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  detal_address: string;
  creation_time: string;
  introducer_email: string;
  province_id: string;
  ward_id: string;
}

interface Props {
  project: Project | null;
}

/* =======================
   COMPONENT
======================= */
export default function ProjectDetail({ project }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;

    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await getListCustomer(project.id);
        setCustomers(res.items || []);
        setTotalCustomer(res.total || 0);
      } catch (error) {
        console.error("Lỗi lấy danh sách khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [project?.id]);

  if (!project) return null;

  return (
    <Card shadow="none" radius="md" withBorder p={0}>
      {/* ===== HEADER ===== */}
      <div className={classes.header}>
        <Group justify="space-between" align="center">
          <Title order={4} c="#762f0b">
            Danh sách khách hàng
          </Title>

          <Badge size="lg" variant="light" color="blue" radius="sm">
            Số lượng: {loading ? "..." : totalCustomer}
          </Badge>
        </Group>
      </div>

      {/* ===== CONTENT ===== */}
      <ScrollArea h={600} p="md" type="auto">
        <Stack gap="md">
          {loading && (
            <Text ta="center" py="xl" c="dimmed">
              Đang tải dữ liệu...
            </Text>
          )}

          {!loading && customers && customers.length === 0 && (
            <Card withBorder radius="md" py="xl" ta="center">
              <Text c="dimmed">Không có khách hàng nào trong dự án này</Text>
            </Card>
          )}

          {!loading &&
            customers &&
            customers.map((customer) => (
              <Card key={customer.id} withBorder radius="md" className={classes.card} p="md">
                <Stack gap="xs">
                  {/* Tên khách hàng */}
                  <Group gap="xs" align="center" mb={4}>
                    <IconUser size={25} color="#762f0b" className={classes.userIcon} />
                    <Text size="lg" className={classes.customerName}>
                      {customer.full_name}
                    </Text>
                  </Group>

                  {/* Thông tin liên hệ */}
                  <Group gap="xl" wrap="wrap">
                    <div className={classes.iconWrapper}>
                      <IconMail size={16} />
                      <Text size="sm">{customer.email}</Text>
                    </div>

                    <div className={classes.iconWrapper}>
                      <IconPhone size={16} />
                      <Text size="sm">{customer.phone}</Text>
                    </div>
                  </Group>

                  <div className={classes.iconWrapper}>
                    <IconMapPin size={16} />
                    <Text size="sm">{customer.detal_address || "Chưa cập nhật địa chỉ"}</Text>
                  </div>

                  <Group gap="xs">
                    <div className={classes.iconWrapper}>
                      <IconUserPlus size={16} />
                      <Text size="xs" c="dimmed">
                        Giới thiệu: {customer.introducer_email || "Trực tiếp"}
                      </Text>
                    </div>

                    <div className={classes.iconWrapper} style={{ marginLeft: "auto" }}>
                      <IconCalendar size={16} />
                      <Text size="xs" c="dimmed">
                        {new Date(customer.creation_time).toLocaleDateString("vi-VN")}
                      </Text>
                    </div>
                  </Group>
                </Stack>
              </Card>
            ))}
        </Stack>
      </ScrollArea>
    </Card>
  );
}
