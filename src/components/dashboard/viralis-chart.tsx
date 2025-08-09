"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", views: 186000, engagement: 8.2, ctr: 3.8 },
  { month: "Feb", views: 305000, engagement: 7.9, ctr: 4.1 },
  { month: "Mar", views: 237000, engagement: 8.5, ctr: 3.9 },
  { month: "Apr", views: 473000, engagement: 9.1, ctr: 4.3 },
  { month: "May", views: 209000, engagement: 8.7, ctr: 4.0 },
  { month: "Jun", views: 214000, engagement: 9.3, ctr: 4.5 },
  { month: "Jul", views: 389000, engagement: 8.9, ctr: 4.2 },
  { month: "Aug", views: 456000, engagement: 9.5, ctr: 4.7 },
  { month: "Sep", views: 523000, engagement: 9.2, ctr: 4.4 },
  { month: "Oct", views: 612000, engagement: 9.8, ctr: 4.9 },
  { month: "Nov", views: 578000, engagement: 9.6, ctr: 4.6 },
  { month: "Dec", views: 689000, engagement: 10.1, ctr: 5.2 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement Rate",
    color: "hsl(var(--chart-2))",
  },
  ctr: {
    label: "Click-Through Rate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function NextintelBetterAuthChart() {
  const t = useTranslations("NextintelBetterAuth.dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("performanceOverview")}</CardTitle>
        <CardDescription>{t("performanceDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              yAxisId="views"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis
              yAxisId="percentage"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              yAxisId="views"
              dataKey="views"
              type="natural"
              fill="var(--color-views)"
              fillOpacity={0.4}
              stroke="var(--color-views)"
              stackId="a"
            />
            <Area
              yAxisId="percentage"
              dataKey="engagement"
              type="natural"
              fill="var(--color-engagement)"
              fillOpacity={0.4}
              stroke="var(--color-engagement)"
              stackId="b"
            />
            <Area
              yAxisId="percentage"
              dataKey="ctr"
              type="natural"
              fill="var(--color-ctr)"
              fillOpacity={0.4}
              stroke="var(--color-ctr)"
              stackId="c"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
