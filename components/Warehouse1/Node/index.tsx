'use client';

import React from 'react';
import {
  Box,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  TextInput,
  Button,
  ActionIcon
} from '@mantine/core';
import { IconPlus, IconSearch, IconTrash, IconPencil } from '@tabler/icons-react';

export default function Node() {
  return (
    <Box p="md" maw={900} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Title order={3} c="#294b61" style={{ fontSize: '24px' }}>Ghi chú</Title>
          <Button leftSection={<IconPlus size={18} />} variant="filled" color="blue">
            Tạo mới
          </Button>
        </Group>

        {/* Thanh tìm kiếm */}
        <TextInput 
          placeholder="Tìm kiếm nhanh..." 
          leftSection={<IconSearch size={16} />} 
          radius="md"
        />

        {/* Danh sách ghi chú mẫu */}
        <Stack gap="sm">
          {[1, 2, 3].map((item) => (
            <Paper key={item} withBorder p="md" radius="md" shadow="xs" style={{ backgroundColor: '#fff' }}>
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Text fw={700} size="lg" mb={4} c="#294b61">Tiêu đề ghi chú mẫu #{item}</Text>
                  <Text size="sm" c="dimmed">
                    Đây là nội dung mô tả mẫu. Bạn chỉ cần tập trung vào phần giao diện này để hiển thị các ghi chú của người dùng một cách chuyên nghiệp.
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">15/05/2026</Text>
                </Box>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="gray"><IconPencil size={18} /></ActionIcon>
                  <ActionIcon variant="subtle" color="red"><IconTrash size={18} /></ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
