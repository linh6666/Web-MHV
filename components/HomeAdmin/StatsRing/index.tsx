import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

const data = [
  { label: 'Còn Trống', stats: '456', progress: 65, color: 'teal', icon: 'up' },
  { label: 'Đang Đặt Cọc', stats: '150', progress: 72, color: 'yellow', icon: 'up' },
  {
    label: 'Đã bán',
    stats: '100',
    progress: 52,
    color: 'red',
    icon: 'down',
  },
] as const;

export function StatsRing() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={20} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}

// ✅ Thêm export mặc định
export default StatsRing;