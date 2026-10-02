import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useParams, Link, useSearch } from "@tanstack/react-router";
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
  const {} = useSearch({ from: "/_app/" });
  const { m3terId } = useParams({ from: "/_app/" });

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-25 p-3">
        <Link
          to={{ pathname: "/", search: searchParams.toString() }}
          className="w-11.25 font-semibold text-[12px] h-11.25 rounded-full bg-background-primary flex items-center justify-center"
        >
          <img src="/m3terhead.webp" alt="M3terhead" className="w-10 h-10" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-3">
        <SidebarMenu>
          {data(m3terId).map((item) => (
            <SidebarMenuItem key={item.title} title={item.title}>
              <Link
                to={item.url}
                search={}
                className="text-[13px] gap-2.25 flex items-center"
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    asChild
                    data-active={isActive}
                    className="h-12.5 data-[active=true]:text-foreground data-[active=true]:dark:text-background data-[active=true]:bg-accent-tertiary hover:bg-accent data-[active=true]:font-medium data-[active=true]:hover:bg-accent hover:text-icon group/inner"
                  >
                    <div className="text-[13px] gap-2.25 flex items-center">
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
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
