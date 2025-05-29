"use client";

import { type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUnreadNotifications } from "@/lib/services/notificationService";
import socket from "../lib/socket";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const [unreadNotifications, setUnreadNotifications] = useState();
  const { count } = useUnreadNotifications();

  useEffect(() => {
    setUnreadNotifications(count);

    socket.on("unreadNotificationsCount", (data) => {
      setUnreadNotifications(data.count);
    });

    return () => {
      socket.off("unreadNotificationsCount");
    };
  }, [count]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <a href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className="py-4">
                    {item.title}
                    {item.title === "Orders" &&
                      unreadNotifications !== undefined &&
                      unreadNotifications !== 0 && (
                        <span className="ml-4 text-sm bg-[#FE724C] rounded-full py-1 px-2">
                          {unreadNotifications}
                        </span>
                      )}
                  </span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
