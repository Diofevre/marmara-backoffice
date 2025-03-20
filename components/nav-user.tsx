"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserButton />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.lastName}</span>
              <span className="truncate text-xs">{user?.emailAddresses?.map(email => email.emailAddress).join(", ")}</span>
            </div>
          </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
