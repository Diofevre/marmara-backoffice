"use client";
import { AppSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import socket from "../../lib/socket";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  useEffect(() => {
    socket.on("newNotification", (data) => {
      toast.info(data.message, {
        duration: Infinity,
        closeButton: true,
      });
    });

    socket.on("unreadNotificationsCount", () => {});

    return () => {
      socket.off("newNotification");
      socket.off("unreadNotificationsCount");
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full min-h-screen bg-gray-50 backdrop-blur-lg">
        <div className="flex gap-3 items-center">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
