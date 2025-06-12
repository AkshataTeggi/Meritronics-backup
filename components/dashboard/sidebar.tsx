// "use client"

// import { useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { Factory, LogOut, Menu, X, Home, Settings } from "lucide-react"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//     { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//     { id: "mpi", label: "MPI", icon: Settings, path: "/dashboard/mpi" },
//   ]

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed
//     setIsCollapsed(newCollapsedState)
//     if (onToggle) {
//       onToggle(newCollapsedState)
//     }
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL || "/placeholder.svg"}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//           </Button>
//         </div>
//         {/* {!isCollapsed && (
//           <div className="mt-2">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
//             <p className="text-sm font-medium text-[hsl(var(--primary))]">{username}</p>
//           </div>
//         )} */}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-[hsl(var(--primary))] text-white"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           variant="ghost"
//           className={`w-full justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "px-2" : "px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }




















"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Factory, LogOut, Menu, X, Home, Settings } from "lucide-react"

interface DashboardSidebarProps {
  onLogout: () => void
  username: string
  onToggle?: (collapsed: boolean) => void
}

const LOGO_URL =
  "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
    { id: "mpi", label: "MPI", icon: Settings, path: "/dashboard/mpi" },
  ]

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onToggle) {
      onToggle(newCollapsedState)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col fixed h-full z-10`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Image
              src={LOGO_URL || "/placeholder.svg"}
              alt="Meritronics Logo"
              width={120}
              height={32}
              className="h-auto"
            />
          )}
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
            <p className="text-sm font-medium text-[hsl(var(--primary))]">{username}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? "px-2" : "px-3"}`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
          onClick={onLogout}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
