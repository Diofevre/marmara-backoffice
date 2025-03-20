"use client";

import * as React from "react";
import {
  BlendIcon,
  ChefHat,
  ListOrdered,
  TicketPercent,
  Wallet2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  teams: [
    {
      name: "MARMARA SPRA",
      logo: ChefHat,
      plan: "Burger and Pizza",
    },
  ],
  navMain: [
    {
      title: "Menues - Dishes",
      url: "/menues",
      icon: ChefHat,
      isActive: true,
    },
    {
      title: "Promotions",
      url: "/promotions",
      icon: TicketPercent,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ListOrdered,
      isActive: true,
    },
    {
      title: "Pack",
      url: "/packs",
      icon: BlendIcon,
      isActive: true,
    },
  ],
  projects: [
    {
      name: "Payements",
      url: "#",
      icon: Wallet2,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href='/'>
        <TeamSwitcher teams={data.teams} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
