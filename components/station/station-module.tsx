"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Eye,
  Cpu,
  Droplet,
  HandMetal,
  Zap,
  Printer,
  RotateCw,
  Layers,
  PenToolIcon as Tool,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  WrenchIcon,
  PowerIcon,
  ChevronRight,
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
import type { Station } from "@/types/station"
import { STORAGE_KEYS, MOCK_STATIONS, STATION_TYPE_ICONS } from "@/lib/constants"


// Define formatDate function locally
function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`
}

// Define getStations function locally
function getStations(): any[] {
  const stations = localStorage.getItem(STORAGE_KEYS.STATIONS)
  return stations ? JSON.parse(stations) : []
}

// Define initializeStationsData function locally
function initializeStationsData(): void {
  const existingStations = localStorage.getItem(STORAGE_KEYS.STATIONS)
  if (!existingStations) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(MOCK_STATIONS))
  }
}

interface StationModuleProps {
  viewMode?: "grid" | "list"
  filterStatus?: "active" | "maintenance" | "inactive"
  searchQuery?: string
  onFilterChange?: (status: string | undefined) => void
}

export default function StationModule({
  viewMode = "grid",
  filterStatus,
  searchQuery: initialSearchQuery = "",
  ...props
}: StationModuleProps) {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery)

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Initialize stations with predefined list if none exist
  useEffect(() => {
    const savedStations = localStorage.getItem(STORAGE_KEYS.STATIONS)

    if (savedStations) {
      setStations(JSON.parse(savedStations))
    } else {
      // Initialize with data from constants
      initializeStationsData()
      setStations(getStations())
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(getStations()))
    }
  }, [])

  // Get appropriate icon based on type
  function getTypeIcon(type: string) {
    const iconName = STATION_TYPE_ICONS[type.toLowerCase()] || "tool"

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
      case "pen-tool":
        return <Tool className="h-5 w-5" />
      case "layers":
        return <Layers className="h-5 w-5" />
      default:
        return <Tool className="h-5 w-5" />
    }
  }

  // Get status icon based on status
  function getStatusIcon(status: string) {
    switch (status) {
      case "active":
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
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
      case "active":
      case "operational":
        return "text-green-500"
      case "inactive":
      case "offline":
        return "text-red-500"
      case "maintenance":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  // Handle view station details
  function viewStation(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()

    // Save the current stations to STORAGE_KEYS.STATIONS for the details page
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations))

    router.push(`/stations/${id}`)
  }

  // Handle edit station - redirect to edit page
  function editStation(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    router.push(`/stations/edit/${id}`)
  }

  // Handle delete station
  function deleteStation(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (confirm("Are you sure you want to delete this station?")) {
      const updatedStations = stations.filter((station) => station.id !== id)
      setStations(updatedStations)
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(updatedStations))
    }
  }

  // Handle set maintenance
  function setMaintenance(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const updatedStations = stations.map((station) =>
      station.id === id
        ? {
            ...station,
            status: "maintenance",
            updatedAt: new Date().toISOString(),
          }
        : station,
    )

    setStations(updatedStations)
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(updatedStations))
  }

  // Handle set active
  function setActive(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const updatedStations = stations.map((station) =>
      station.id === id
        ? {
            ...station,
            status: "active",
            updatedAt: new Date().toISOString(),
          }
        : station,
    )

    setStations(updatedStations)
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(updatedStations))
  }

  // Capitalize first letter of each word
  function capitalize(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Filter stations based on status and search query
  const filteredStations = stations
    .filter((station) => (filterStatus ? station.status.toLowerCase() === filterStatus.toLowerCase() : true))
    .filter((station) =>
      searchQuery
        ? station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.code.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search stations..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus || "all"}
            onValueChange={(value) => {
              // Use a callback to inform the parent component about the filter change
              if (typeof props.onFilterChange === "function") {
                props.onFilterChange(value === "all" ? undefined : value)
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => router.push("/stations/add")} className="w-full sm:w-auto mt-2 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Station
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {filteredStations.map((station) => (
            <Card
              key={station.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
              onClick={() => viewStation(station.id)}
            >
              <CardHeader className="p-3 sm:p-4 pb-2">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-700 mr-2 sm:mr-3 flex-shrink-0">
                    {getTypeIcon(station.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm sm:text-base md:text-lg truncate">{station.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => viewStation(station.id, e)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => editStation(station.id, e)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) =>
                              station.status === "active" ? setMaintenance(station.id, e) : setActive(station.id, e)
                            }
                          >
                            {station.status === "active" ? (
                              <>
                                <WrenchIcon className="h-4 w-4 mr-2" />
                                Set to Maintenance
                              </>
                            ) : (
                              <>
                                <PowerIcon className="h-4 w-4 mr-2" />
                                Set to Active
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={(e) => deleteStation(station.id, e)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center mt-1 flex-wrap">
                      <span className="text-xs sm:text-sm font-medium truncate">{station.code}</span>
                      <span className="mx-1 text-xs text-muted-foreground">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">{station.type}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-3 sm:p-4 pt-2 pb-3 space-y-3 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(station.status)}
                      <span className={`ml-1 text-sm font-medium ${getStatusTextColor(station.status)}`}>
                        {capitalize(station.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Location:</p>
                    <p className="font-medium truncate">{station.location}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Operator:</p>
                    <p className="font-medium truncate">{station.operator}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Last Maintenance:</p>
                    <p className="font-medium truncate">{station.lastMaintenance}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Efficiency:</p>
                    <p className="font-medium truncate">{station.efficiency}%</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Equipment ({station.equipment.length})</h4>
                  </div>

                  {station.equipment.map((equipment) => (
                    <div key={equipment.id} className="bg-gray-50 rounded-md p-2 mb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap">
                            <p className="font-medium text-sm truncate">{equipment.name}</p>
                            <div className="flex items-center">
                              {getStatusIcon(equipment.status)}
                              <span className={`ml-1 text-xs font-medium ${getStatusTextColor(equipment.status)}`}>
                                {capitalize(equipment.status)}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {equipment.type} • SN: {equipment.serialNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between items-center border-t mt-auto">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={(e) => viewStation(station.id, e)}
                  >
                    Details
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={(e) => editStation(station.id, e)}>
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="bg-white border rounded-md p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-3"
              onClick={() => viewStation(station.id)}
            >
              <div className="p-2 rounded-md bg-gray-100 text-gray-700 mr-0 sm:mr-4 self-center sm:self-auto">
                {getTypeIcon(station.type)}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <h3 className="font-medium text-base truncate">{station.name}</h3>
                  <span className="hidden sm:inline mx-2 text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground truncate">{station.type}</span>
                  <span className="hidden sm:inline mx-2 text-xs text-muted-foreground">•</span>
                  <span className="text-sm font-medium truncate">{station.code}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mt-1">
                  <div className="flex items-center mr-0 sm:mr-4">
                    {getStatusIcon(station.status)}
                    <span className={`ml-1 text-sm font-medium ${getStatusTextColor(station.status)}`}>
                      {capitalize(station.status)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">Location: {station.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={(e) => viewStation(station.id, e)}
                >
                  Details
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => editStation(station.id, e)}>
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
                        station.status === "active" ? setMaintenance(station.id, e) : setActive(station.id, e)
                      }
                    >
                      {station.status === "active" ? (
                        <>
                          <WrenchIcon className="h-4 w-4 mr-2" />
                          Set to Maintenance
                        </>
                      ) : (
                        <>
                          <PowerIcon className="h-4 w-4 mr-2" />
                          Set to Active
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={(e) => deleteStation(station.id, e)}
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
