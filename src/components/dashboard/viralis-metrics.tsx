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
  IconEye,
  IconHeart,
  IconUsers,
  IconTrendingUp,
  IconClick,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { AnimatedGroup } from "@/components/ui/AnimatedGroup";
import { Variants } from "framer-motion";

const transitionVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const metrics = [
  {
    key: "views",
    icon: IconEye,
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    key: "engagement",
    icon: IconHeart,
    value: "8.7%",
    change: "+2.1%",
    trend: "up",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    key: "ctr",
    icon: IconClick,
    value: "4.2%",
    change: "+0.8%",
    trend: "up",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    key: "subscribers",
    icon: IconUsers,
    value: "156K",
    change: "+3.2K",
    trend: "up",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    key: "retention",
    icon: IconTrendingUp,
    value: "68%",
    change: "+5.3%",
    trend: "up",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    key: "revenue",
    icon: IconCurrencyDollar,
    value: "$12.4K",
    change: "+18.2%",
    trend: "up",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
  },
];

export function NextintelBetterAuthMetrics() {
  const t = useTranslations("NextintelBetterAuth.analytics");

  return (
    <div className="px-4 lg:px-6">
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          },
          item: transitionVariants,
        }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.key}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(metric.key)}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center ${metric.color}`}>
                    <IconTrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </span>
                  {" from last month"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </AnimatedGroup>
    </div>
  );
}
