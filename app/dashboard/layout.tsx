"use client"

import DashboardSidebar from "@/components/dashboard/sidebar"
import type React from "react"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [username] = useState("Admin") // This would come from auth context in real app
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    window.location.href = "/"
  }

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar onLogout={handleLogout} username={username} onToggle={handleSidebarToggle} />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
      >
        <div className="p-6 max-w-full">{children}</div>
      </main>
    </div>
  )
}
