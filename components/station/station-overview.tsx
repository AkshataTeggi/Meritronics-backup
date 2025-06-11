"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Factory, Plus, TrendingUp, AlertTriangle } from "lucide-react"
import { stationApi } from "@/lib/stations"
import { Station } from "@/types/station"

interface StationsOverviewProps {
  onNavigate: (page: string) => void
}

export default function StationsOverview({ onNavigate }: StationsOverviewProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationList = await stationApi.findAll()
        setStations(stationList)
      } catch (err) {
        console.error("Failed to fetch stations:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStations()
  }, [])

  const activeStations = stations.filter((s) => s.status === "active").length
  const maintenanceStations = stations.filter((s) => s.status === "maintenance").length
  const inactiveStations = stations.filter((s) => s.status === "inactive").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Stations Overview</h1>
        <Button
          onClick={() => onNavigate("create-station")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Station
        </Button>
      </div>

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[hsl(var(--primary))]">Recent Stations</CardTitle>
            <Button variant="outline" onClick={() => onNavigate("station-list")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading stations...</div>
          ) : stations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Factory className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No stations found</p>
              <p className="text-sm text-gray-400 mb-4">Get started by creating your first station</p>
              <Button onClick={() => onNavigate("create-station")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Station
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {stations.slice(0, 5).map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Factory className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-500">ID: {station.stationId}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      station.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : station.status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }
                  >
                    {station.status || "unknown"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
