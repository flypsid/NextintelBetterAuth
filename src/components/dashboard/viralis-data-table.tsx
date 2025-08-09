"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconExternalLink,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

const videoData = [
  {
    id: "1",
    title: "10 AI Tools That Will Change Your Life",
    platform: "YouTube",
    views: "2.4M",
    engagement: "12.5%",
    ctr: "8.2%",
    revenue: "$1,240",
    trend: "up",
    status: "viral",
    publishedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "React vs Vue: The Ultimate Comparison",
    platform: "YouTube",
    views: "856K",
    engagement: "9.8%",
    ctr: "6.4%",
    revenue: "$680",
    trend: "up",
    status: "trending",
    publishedAt: "2024-01-12",
  },
  {
    id: "3",
    title: "Day in the Life of a Developer",
    platform: "TikTok",
    views: "1.2M",
    engagement: "15.3%",
    ctr: "12.1%",
    revenue: "$420",
    trend: "up",
    status: "viral",
    publishedAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Building a SaaS in 30 Days",
    platform: "YouTube",
    views: "432K",
    engagement: "7.2%",
    ctr: "4.8%",
    revenue: "$320",
    trend: "down",
    status: "normal",
    publishedAt: "2024-01-08",
  },
  {
    id: "5",
    title: "Instagram Growth Hacks 2024",
    platform: "Instagram",
    views: "678K",
    engagement: "11.4%",
    ctr: "7.9%",
    revenue: "$540",
    trend: "up",
    status: "trending",
    publishedAt: "2024-01-05",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "viral":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          Viral
        </Badge>
      );
    case "trending":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          Trending
        </Badge>
      );
    case "normal":
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          Normal
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPlatformBadge = (platform: string) => {
  switch (platform) {
    case "YouTube":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          YouTube
        </Badge>
      );
    case "TikTok":
      return (
        <Badge className="bg-black text-white dark:bg-white dark:text-black">
          TikTok
        </Badge>
      );
    case "Instagram":
      return (
        <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400">
          Instagram
        </Badge>
      );
    default:
      return <Badge variant="secondary">{platform}</Badge>;
  }
};

export function NextintelBetterAuthDataTable() {
  const t = useTranslations("NextintelBetterAuth.dashboard");

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("recentVideos")}</CardTitle>
          <CardDescription>{t("recentVideosDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("videoTitle")}</TableHead>
                <TableHead>{t("platform")}</TableHead>
                <TableHead>{t("views")}</TableHead>
                <TableHead>{t("engagement")}</TableHead>
                <TableHead>{t("ctr")}</TableHead>
                <TableHead>{t("revenue")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoData.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{video.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getPlatformBadge(video.platform)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {video.views}
                      {video.trend === "up" ? (
                        <IconTrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <IconTrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{video.engagement}</TableCell>
                  <TableCell>{video.ctr}</TableCell>
                  <TableCell className="font-medium">{video.revenue}</TableCell>
                  <TableCell>{getStatusBadge(video.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <IconExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
