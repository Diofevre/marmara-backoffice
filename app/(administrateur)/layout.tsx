import { AppSidebar } from '@/components/admin-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children } : Props) {
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
  )
}
