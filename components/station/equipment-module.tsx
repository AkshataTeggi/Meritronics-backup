"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Cpu,
  WrenchIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  PowerIcon,
  Settings,
  PenToolIcon as Tool,
  HardDrive,
  Gauge,
  Eye,
  Droplet,
  HandMetal,
  Zap,
  Printer,
  RotateCw,
  Search,
  Plus,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import types
import type { Equipment, EquipmentModuleProps } from "@/types/station"
// Define formatDate function locally
function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`
}

// Define getEquipment function locally
function getEquipment(): any[] {
  const equipment = localStorage.getItem(STORAGE_KEYS.EQUIPMENT)
  return equipment ? JSON.parse(equipment) : []
}

// Define initializeEquipmentData function locally
function initializeEquipmentData(): void {
  const existingEquipment = localStorage.getItem(STORAGE_KEYS.EQUIPMENT)
  if (!existingEquipment) {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(MOCK_EQUIPMENT))
  }
}

import { useRouter } from "next/navigation"
import { STORAGE_KEYS, MOCK_EQUIPMENT, EQUIPMENT_TYPE_ICONS } from "@/lib/constants"

export default function EquipmentModule({
  viewMode = "grid",
  filterStatus,
  searchQuery: initialSearchQuery = "",
}: EquipmentModuleProps) {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "")
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    id: `EQ-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    name: "",
    status: "operational",
    type: "",
    serialNumber: "",
    model: "",
    manufacturer: "",
    purchaseDate: formatDate(new Date()),
    lastMaintenance: formatDate(new Date()),
    nextMaintenance: formatDate(new Date(new Date().setMonth(new Date().getMonth() + 3))),
    location: "",
    assignedStation: "",
    notes: "",
  })

  // Initialize equipment with predefined list if none exist
  useEffect(() => {
    const savedEquipment = localStorage.getItem(STORAGE_KEYS.EQUIPMENT)

    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment))
    } else {
      // Initialize with data from constants
      initializeEquipmentData()
      setEquipment(getEquipment())
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(getEquipment()))
    }
  }, [])

  // Get appropriate icon based on type
  function getTypeIcon(type: string) {
    const iconName = EQUIPMENT_TYPE_ICONS[type.toLowerCase()] || "settings"

    switch (iconName) {
      case "eye":
        return <Eye className="h-5 w-5" />
      case "cpu":
        return <Cpu className="h-5 w-5" />
      case "droplet":
        return <Droplet className="h-5 w-5" />
      case "hand-metal":
        return <HandMetal className="h-5 w-5" />
      case "zap":
        return <Zap className="h-5 w-5" />
      case "printer":
        return <Printer className="h-5 w-5" />
      case "rotate-cw":
        return <RotateCw className="h-5 w-5" />
      case "tool":
        return <Tool className="h-5 w-5" />
      case "gauge":
        return <Gauge className="h-5 w-5" />
      case "hard-drive":
        return <HardDrive className="h-5 w-5" />
      case "check-circle":
        return <CheckCircle className="h-5 w-5" />
      case "wrench":
        return <WrenchIcon className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  // Get status icon based on status
  function getStatusIcon(status: string) {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  // Get status text color based on status
  function getStatusTextColor(status: string) {
    switch (status) {
      case "operational":
        return "text-green-500"
      case "offline":
        return "text-red-500"
      case "maintenance":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  // Capitalize first letter of each word
  function capitalize(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Handle edit equipment
  function editEquipment(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    router.push(`/equipment/edit/${id}`)
  }

  // Handle delete equipment
  function deleteEquipment(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (confirm("Are you sure you want to delete this equipment?")) {
      const updatedEquipment = equipment.filter((eq) => eq.id !== id)
      setEquipment(updatedEquipment)
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(updatedEquipment))
    }
  }

  // Handle set maintenance
  function setMaintenance(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const updatedEquipment = equipment.map((eq) =>
      eq.id === id
        ? {
            ...eq,
            status: "maintenance",
          }
        : eq,
    )

    setEquipment(updatedEquipment)
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(updatedEquipment))
  }

  // Handle set operational
  function setOperational(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const updatedEquipment = equipment.map((eq) =>
      eq.id === id
        ? {
            ...eq,
            status: "operational",
          }
        : eq,
    )

    setEquipment(updatedEquipment)
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(updatedEquipment))
  }

  // Filter equipment based on the search query and status
  const filteredEquipment = equipment
    .filter((item) => (filterStatus ? item.status === filterStatus : true))
    .filter((item) =>
      searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase()))
        : true,
    )



  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search equipment..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus || "all"}
            onValueChange={(value) => (filterStatus = value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => router.push("/equipment/add")} className="w-full sm:w-auto mt-2 sm:mt-0">
           
            Add Equipment
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {filteredEquipment.map((eq) => (
            <Card
              key={eq.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
            >
              <CardHeader className="p-3 sm:p-4 pb-2">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 mr-2 sm:mr-3 flex-shrink-0">
                    {getTypeIcon(eq.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm sm:text-base md:text-lg truncate">{eq.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => editEquipment(eq.id, e)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) =>
                              eq.status === "operational" ? setMaintenance(eq.id, e) : setOperational(eq.id, e)
                            }
                          >
                            {eq.status === "operational" ? (
                              <>
                                <WrenchIcon className="h-4 w-4 mr-2" />
                                Set to Maintenance
                              </>
                            ) : (
                              <>
                                <PowerIcon className="h-4 w-4 mr-2" />
                                Set to Operational
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={(e) => deleteEquipment(eq.id, e)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center mt-1 flex-wrap">
                      <span className="text-xs sm:text-sm font-medium truncate">{eq.serialNumber}</span>
                      <span className="mx-1 text-xs text-muted-foreground">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">{eq.type}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-3 sm:p-4 pt-2 pb-3 space-y-3 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(eq.status)}
                      <span className={`ml-1 text-sm font-medium ${getStatusTextColor(eq.status)}`}>
                        {capitalize(eq.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Model:</p>
                    <p className="font-medium truncate">{eq.model || "N/A"}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Manufacturer:</p>
                    <p className="font-medium truncate">{eq.manufacturer || "N/A"}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Last Maintenance:</p>
                    <p className="font-medium truncate">{eq.lastMaintenance || "N/A"}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Next Maintenance:</p>
                    <p className="font-medium truncate">{eq.nextMaintenance || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Location:</p>
                    <p className="font-medium text-sm truncate">{eq.location || "N/A"}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Assigned Station:</p>
                    <p className="font-medium text-sm truncate">{eq.assignedStation || "Unassigned"}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between items-center border-t mt-auto">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="text-xs">Purchase: {eq.purchaseDate || "N/A"}</span>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={(e) => editEquipment(eq.id, e)}>
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEquipment.map((eq) => (
            <div
              key={eq.id}
              className="bg-white border rounded-md p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <div className="p-2 rounded-md bg-gray-100 text-gray-700 mr-0 sm:mr-4 self-center sm:self-auto">
                {getTypeIcon(eq.type)}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <h3 className="font-medium text-base truncate">{eq.name}</h3>
                  <span className="hidden sm:inline mx-2 text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground truncate">{eq.type}</span>
                  <span className="hidden sm:inline mx-2 text-xs text-muted-foreground">•</span>
                  <span className="text-sm font-medium truncate">{eq.serialNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mt-1">
                  <div className="flex items-center mr-0 sm:mr-4">
                    {getStatusIcon(eq.status)}
                    <span className={`ml-1 text-sm font-medium ${getStatusTextColor(eq.status)}`}>
                      {capitalize(eq.status)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    Station: {eq.assignedStation || "Unassigned"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                <Button variant="outline" size="sm" onClick={(e) => editEquipment(eq.id, e)}>
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) =>
                        eq.status === "operational" ? setMaintenance(eq.id, e) : setOperational(eq.id, e)
                      }
                    >
                      {eq.status === "operational" ? (
                        <>
                          <WrenchIcon className="h-4 w-4 mr-2" />
                          Set to Maintenance
                        </>
                      ) : (
                        <>
                          <PowerIcon className="h-4 w-4 mr-2" />
                          Set to Operational
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={(e) => deleteEquipment(eq.id, e)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
