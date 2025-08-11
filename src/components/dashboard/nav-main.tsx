"use client";
import { type Icon } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { useTranslations } from "next-intl";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const t = useTranslations("Dashboard.sidebar");

  // Traduire les titres des éléments
  const translatedItems = items.map((item) => {
    // Trouver la clé de traduction correspondante
    const translationKey = item.title
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "");
    return {
      ...item,
      title: t(translationKey) || item.title,
    };
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {translatedItems.map((item) => {
            // Routes définies dans le routing next-intl
            const definedRoutes = ["/dashboard", "/dashboard/profile"];
            const isDefinedRoute = definedRoutes.includes(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                {isDefinedRoute ? (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link
                      href={item.url as "/dashboard" | "/dashboard/profile"}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : item.url === "#" ? (
                  <SidebarMenuButton tooltip={item.title} disabled>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <NextLink href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </NextLink>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
