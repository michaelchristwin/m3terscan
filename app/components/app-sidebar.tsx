import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavLink, useParams, Link, useSearchParams } from "react-router";
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
      url: `/m3ter/${m3terId}/ask-ai`,
      icon: Sparkles,
    },
  ];
  return navMain;
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const m3terId = params.m3terId as string;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[100px] p-3">
        <Link
          to={{ pathname: "/", search: searchParams.toString() }}
          className="w-[45px] font-semibold text-[12px] h-[45px] rounded-full bg-background-primary flex items-center justify-center"
        >
          <img
            src="/m3terhead.webp"
            alt="M3terhead"
            className="w-[40px] h-[40px]"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-[12px]">
        <SidebarMenu>
          {data(m3terId).map((item) => (
            <SidebarMenuItem key={item.title} title={item.title}>
              <NavLink
                to={{ pathname: item.url, search: searchParams.toString() }}
                className="text-[13px] gap-[9px] flex items-center"
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    asChild
                    data-active={isActive}
                    className="h-[50px] data-[active=true]:text-foreground data-[active=true]:dark:text-background data-[active=true]:bg-accent-tertiary hover:bg-accent data-[active=true]:font-medium data-[active=true]:hover:bg-accent hover:text-icon group/inner"
                  >
                    <div className="text-[13px] gap-[9px] flex items-center">
                      <div
                        className={`p-1.5 ${
                          isActive
                            ? "bg-accent-secondary"
                            : "bg-background-secondary"
                        } rounded-lg group-hover/inner:bg-accent`}
                      >
                        <item.icon
                          size={15}
                          className={
                            isActive
                              ? "text-foreground dark:text-background"
                              : ""
                          }
                        />
                      </div>
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
