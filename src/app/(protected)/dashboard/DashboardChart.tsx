"use client";

import RatingChart from "@/components/RatingChart";

interface DashboardChartProps {
  data: { matchIndex: number; rating: number }[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  return <RatingChart data={data} height={250} />;
}
