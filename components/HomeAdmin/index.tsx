"use client";

import StatsRing from './StatsRing/index';
import Chart from './Chart/index';
import RevenueChart from './RevenueChart';
import { Divider } from '@mantine/core';


export default function SalesColumnChart() {
  return (
   <>
   <StatsRing/>
    <Divider my="md" />

   <Chart/>
    <Divider my="md" />

     <RevenueChart />
   </>
  );
}
