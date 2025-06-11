"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Factory, Edit, Trash2, RefreshCw } from "lucide-react"
import { stationApi } from "@/lib/stations"
import { Station } from "@/types/station"

export default function StationList() {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStations = async () => {
    setIsLoading(true)
    setError("")
    try {
      const stationList = await stationApi.findAll()
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

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Factory className="h-5 w-5" />
            Station List
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchStations} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
        ) : (
          <div className="grid gap-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{station.name}</h3>
                      <Badge className={getStatusColor(station.status)}>{station.status || "unknown"}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span className="font-medium">Station ID:</span> {station.stationId}
                      </p>
                      {station.location && (
                        <p>
                          <span className="font-medium">Location:</span> {station.location}
                        </p>
                      )}
                      {station.description && (
                        <p>
                          <span className="font-medium">Description:</span> {station.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(station.stationId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
