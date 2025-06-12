"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Plus, Edit, Trash2, TrendingUp, AlertTriangle, Eye, List, LayoutGrid } from "lucide-react"
import { StationIcon } from "./station-icon"
import { stationApi } from "@/lib/stations"
import { Station } from "@/types/station"

type ViewMode = "list" | "grid"

export default function StationsManagement() {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const router = useRouter()

  const fetchStations = async () => {
    setIsLoading(true)
    setError("")
    try {
      const stationList = await stationApi.findAll()
      console.log("Stations fetching response", stationList)
      setStations(stationList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stations")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStations()
  }, [])

  const handleDelete = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this station?")) return
    try {
      await stationApi.remove(stationId)
      await fetchStations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete station")
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStationId = (station: Station): string => {
    // Use the generated database ID (which is what the backend expects)
    const id = station.id || station.stationId
    console.log("Station ID for navigation:", {
      station: station.stationName,
      id: id,
      stationId: station.stationId,
      dbId: station.id,
    })
    return id
  }

  const handleViewStation = (station: Station) => {
    const id = getStationId(station)
    console.log("Navigating to station view:", id)
    router.push(`/dashboard/stations/${id}`)
  }

  const handleEditStation = (station: Station) => {
    const id = getStationId(station)
    console.log("Navigating to station edit:", id)
    router.push(`/dashboard/stations/edit/${id}`)
  }

  const handleDeleteStation = async (station: Station) => {
    const id = getStationId(station)
    console.log("Deleting station:", id)
    await handleDelete(id)
  }

  // Calculate statistics from actual data
  const activeStations = stations.filter((s) => s.status === "active").length
  const maintenanceStations = stations.filter((s) => s.status === "maintenance").length
  const inactiveStations = stations.filter((s) => s.status === "inactive").length

  const renderListView = () => (
    <div className="space-y-2">
      {stations.map((station) => (
        <div
          key={station.id || station.stationId}
          className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
              <StationIcon stationName={station.stationName} className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">{station.stationName}</h3>
              <p className="text-sm text-gray-500">
                ID: {station.stationId} 
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewStation(station)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditStation(station)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteStation(station)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stations.map((station) => (
        <Card key={station.id || station.stationId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                <StationIcon stationName={station.stationName} className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{station.stationName}</h3>
                <p className="text-sm text-gray-500">ID: {station.stationId}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" onClick={() => handleViewStation(station)} className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditStation(station)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStation(station)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Stations Management</h1>
        <Button
          onClick={() => router.push("/dashboard/stations/create")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Station
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">{isLoading ? "--" : stations.length}</div>
            <p className="text-xs text-muted-foreground">All manufacturing stations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{isLoading ? "--" : activeStations}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{isLoading ? "--" : maintenanceStations}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Factory className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{isLoading ? "--" : inactiveStations}</div>
            <p className="text-xs text-muted-foreground">Not operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Stations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
              <Factory className="h-5 w-5" />
              Stations
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading stations...</div>
          ) : stations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No stations found</div>
          ) : viewMode === "list" ? (
            renderListView()
          ) : (
            renderGridView()
          )}
        </CardContent>
      </Card>
    </div>
  )
}
