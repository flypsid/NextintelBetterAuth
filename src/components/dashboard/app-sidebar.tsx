"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  IconPhoto,
  IconChartBar,
  IconDashboard,
  IconTrendingUp,
  IconBulb,
  IconTarget,
  IconBell,
  IconSearch,
  IconHelp,
  IconSettings,
  IconVideo,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandInstagram,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Analytics Overview",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Thumbnail Studio",
      url: "#",
      icon: IconPhoto,
    },
    {
      title: "Performance Metrics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Trend Analysis",
      url: "#",
      icon: IconTrendingUp,
    },
    {
      title: "Content Ideas",
      url: "#",
      icon: IconBulb,
    },
  ],
  navClouds: [
    {
      title: "YouTube",
      icon: IconBrandYoutube,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Channel Analytics",
          url: "#",
        },
        {
          title: "Video Performance",
          url: "#",
        },
        {
          title: "Thumbnail A/B Tests",
          url: "#",
        },
      ],
    },
    {
      title: "TikTok",
      icon: IconBrandTiktok,
      url: "#",
      items: [
        {
          title: "Trending Hashtags",
          url: "#",
        },
        {
          title: "Viral Content",
          url: "#",
        },
        {
          title: "Engagement Metrics",
          url: "#",
        },
      ],
    },
    {
      title: "Instagram",
      icon: IconBrandInstagram,
      url: "#",
      items: [
        {
          title: "Story Analytics",
          url: "#",
        },
        {
          title: "Reel Performance",
          url: "#",
        },
        {
          title: "Post Optimization",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "AI Optimizer",
      url: "#",
      icon: IconTarget,
    },
    {
      name: "Trend Alerts",
      url: "#",
      icon: IconBell,
    },
    {
      name: "Video Library",
      url: "#",
      icon: IconVideo,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Données utilisateur avec fallback
  const userData = {
    name: user?.name || "Utilisateur",
    email: user?.email || "email@example.com",
    avatar: user?.image || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="NextintelBetterAuth Logo"
                  width={32}
                  height={32}
                  className="!size-5"
                  priority
                />
                <span className="text-base font-semibold">
                  NextintelBetterAuth
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
