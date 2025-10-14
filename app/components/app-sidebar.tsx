import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavLink, useParams, useLocation, Link } from "react-router";
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
  const params = useParams();
  const m3terId = params.m3terId as string;
  let location = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[100px] p-3">
        <Link
          to={"/"}
          className="w-[75px] font-semibold text-[12px] h-[30px] rounded-[20px] bg-background-primary flex items-center justify-center"
        >
          SWITCH
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-[12px]">
        <SidebarMenu>
          {data(m3terId).map((item) => (
            <SidebarMenuItem key={item.title} title={item.title}>
              <SidebarMenuButton
                asChild
                className={`data-[active=true]:text-icon h-[50px] data-[active=true]:bg-accent-tertiary hover:bg-accent data-[active=true]:font-medium data-[active=true]:hover:bg-accent hover:text-icon group/inner`}
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
                            ? "bg-accent-secondary"
                            : "bg-background-secondary"
                        } rounded-lg group-hover/inner:bg-accent`}
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
