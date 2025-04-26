"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Users, Settings, HelpCircle, Home } from "lucide-react"
import Image from "next/image"
import LoginForm from "./login-form"

// Meritronics logo URL from Vercel Blob
const LOGO_URL =
  "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// Define the navigation structure
const navigation = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    id: "stations",
    name: "Stations",
    path: "/stations",
    icon: Users,
  },
  {
    id: "equipment",
    name: "Equipment",
    path: "/equipment",
    icon: Settings,
  },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  // Check for existing login session
  useEffect(() => {
    const savedUser = localStorage.getItem("meritronics-user")
    if (savedUser) {
      setIsLoggedIn(true)
      setUsername(savedUser)
    }
  }, [])

  // Handle login
  const handleLogin = (user: string) => {
    setIsLoggedIn(true)
    setUsername(user)
    localStorage.setItem("meritronics-user", user)
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    localStorage.removeItem("meritronics-user")
  }

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  // Navigate to a path
  const navigateTo = (path: string) => {
    router.push(path)
    if (isMobileView) {
      setSidebarOpen(false)
    }
  }

  // If not logged in, show login form
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-3 left-3 z-30 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 shadow-md rounded-md"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-20 w-[280px] md:w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out overflow-hidden flex flex-col shadow-sm`}
      >
        {/* Sidebar Header with Logo */}
        <div className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <Image
              src={LOGO_URL || "/placeholder.svg"}
              alt="Meritronics Logo"
              width={160}
              height={45}
              className="h-8 w-auto"
              priority
            />
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <Button
                  variant={pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => navigateTo(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">{username || "User"}</div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 pt-12 md:pt-0">{children}</main>
    </div>
  )
}
