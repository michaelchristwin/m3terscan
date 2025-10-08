import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavLink, useParams, useLocation } from "react-router";
import {
  ChartLine,
  Activity,
  ShoppingCart,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

const data = (m3terId: string) => {
  const navMain = [
    {
      title: "Charts",
      url: `/m3ter/${m3terId}/charts`,
      icon: ChartLine,
    },
    {
      title: "Overview",
      url: `/m3ter/${m3terId}/overview`,
      icon: ClipboardCheck,
    },
    {
      title: "Trades",
      url: `/m3ter/${m3terId}/trades`,
      icon: ShoppingCart,
    },
    {
      title: "Activities",
      url: `/m3ter/${m3terId}/activities`,
      icon: Activity,
    },
    {
      title: "Ask M3ter AI",
      url: `/m3ters/${m3terId}/ask-ai`,
      icon: Sparkles,
    },
  ];
  return navMain;
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const m3terId = params.m3terId as string;
  let location = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[100px]"></SidebarHeader>
      <SidebarContent className="gap-0 px-[12px]">
        <SidebarMenu>
          {data(m3terId).map((item) => (
            <SidebarMenuItem key={item.title} title={item.title}>
              <SidebarMenuButton
                asChild
                className={`data-[active=true]:text-[var(--icon-color)] h-[50px] data-[active=true]:bg-[var(--accent-color-tertiary)] hover:bg-[var(--accent-color)] data-[active=true]:font-medium data-[active=true]:hover:bg-[var(--accent-color)] hover:text-[var(--icon-color)] group/inner`}
                isActive={item.url === location.pathname}
                key={item.title}
              >
                <NavLink
                  to={item.url}
                  className="text-[13px] gap-[9px] flex items-center"
                >
                  {({ isActive }) => (
                    <>
                      <div
                        key={item.title}
                        className={`p-1.5 ${
                          isActive
                            ? "bg-[var(--accent-color-secondary)]"
                            : "bg-[var(--background-secondary)]"
                        } rounded-lg group-hover/inner:bg-[var(--accent-color)]`}
                      >
                        <item.icon size={15} />
                      </div>
                      <span>{item.title}</span>
                    </>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
