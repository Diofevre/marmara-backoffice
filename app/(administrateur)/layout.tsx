"use client";

import { AppSidebar } from "@/components/admin-sidebar";
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
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto mt-6 lg:pl-0">
          {children}
        </main>
      </div>
    </div>
  );
}