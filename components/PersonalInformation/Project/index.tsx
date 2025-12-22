"use client";

import {  Title ,Card, Image, Stack, Text, } from "@mantine/core";
import styles from "./Interact.module.css";

export default function ProfileInfo() {
  return (
    <div className={styles.Box}>
      <Title order={2} c="#294b61" ta="center" mb="lg">
        Dự án
      </Title>
   
      {/* Search Section */}  
      <div className={styles.cardGrid}>
        {/* Card 3 */}
        <Card shadow="sm" radius="md" withBorder padding="0" className={styles.card}>
          <Image
            src="https://img.heroui.chat/image/places?w=800&h=400&u=1"
            height={160}
            alt="Highrise Melbourne"
            style={{ borderTopLeftRadius: "var(--mantine-radius-md)", borderTopRightRadius: "var(--mantine-radius-md)" }}
          />
          <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
            <Text fw={500}>ECO RETREAT</Text>
            <Text size="sm" c="dimmed">Long An</Text>
            <Text size="sm" c="dimmed">100%</Text>
          </Stack>
         
        </Card>

<Card shadow="sm" radius="md" withBorder padding="0" className={styles.card}>
          <Image
            src="https://img.heroui.chat/image/places?w=800&h=400&u=8"
            height={160}
            alt="HIGHRISE MELBOURNE"
            style={{ borderTopLeftRadius: "var(--mantine-radius-md)", borderTopRightRadius: "var(--mantine-radius-md)" }}
          />
          <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
            <Text fw={500}>HIGHRISE MELBOURNE</Text>
            <Text size="sm" c="dimmed">Melbourne</Text>
            <Text size="sm" c="dimmed">6%, bao gồm 24 tầng, hướng biển</Text>
          </Stack>
         
        </Card>
 <Card shadow="sm" radius="md" withBorder padding="0" className={styles.card}>
          <Image
            src="https://img.heroui.chat/image/places?w=800&h=400&u=2"
            height={160}
            alt="Park Hill"
            style={{ borderTopLeftRadius: "var(--mantine-radius-md)", borderTopRightRadius: "var(--mantine-radius-md)" }}
          />
          <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
            <Text fw={500}>THANH XUÂN VALLEY</Text>
            <Text size="sm" c="dimmed">Thung Lũng Thanh Xuân</Text>
            <Text size="sm" c="dimmed">8%</Text>
          </Stack>
         
        </Card>
    <Card shadow="sm" radius="md" withBorder padding="0" className={styles.card}>
          <Image
            src="https://img.heroui.chat/image/places?w=800&h=400&u=5"
            height={160}
            alt="Park Hill"
            style={{ borderTopLeftRadius: "var(--mantine-radius-md)", borderTopRightRadius: "var(--mantine-radius-md)" }}
          />
          <Stack gap="xs" p="md" style={{ flexGrow: 1 }}>
            <Text fw={500}>SUN PREMIER VILLAGE PRIMAVERA</Text>
            <Text size="sm" c="dimmed">Nam Phú Quốc, Việt Nam</Text>
            <Text size="sm" c="dimmed">5%</Text>
          </Stack>
       
        </Card>       
      </div>
 
      
    </div>
  );
}