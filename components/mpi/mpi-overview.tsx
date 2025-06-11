"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, FileText, Factory } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { stationApi } from "@/lib/stations"
import { Mpi } from "@/types/mpi"
import { Station } from "@/types/station"

interface MpiOverviewProps {
  onNavigate: (page: string) => void
}

export default function MpiOverview({ onNavigate }: MpiOverviewProps) {
  const [mpis, setMpis] = useState<Mpi[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mpiList, stationList] = await Promise.all([mpiApi.findAll(), stationApi.findAll()])
        setMpis(mpiList)
        setStations(stationList)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStationMpiCount = () => {
    const stationCounts = new Map()
    mpis.forEach((mpi) => {
      const count = stationCounts.get(mpi.stationName) || 0
      stationCounts.set(mpi.stationName, count + 1)
    })
    return stationCounts
  }

  const stationMpiCounts = getStationMpiCount()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Overview</h1>
        <Button
          onClick={() => onNavigate("create-mpi")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create MPI
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total MPIs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">{isLoading ? "--" : mpis.length}</div>
            <p className="text-xs text-muted-foreground">Process instructions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stations with MPIs</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {isLoading ? "--" : stationMpiCounts.size}
            </div>
            <p className="text-xs text-muted-foreground">Configured stations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg MPIs per Station</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {isLoading
                ? "--"
                : stationMpiCounts.size > 0
                  ? Math.round((mpis.length / stationMpiCounts.size) * 10) / 10
                  : 0}
            </div>
            <p className="text-xs text-muted-foreground">Instructions per station</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unconfigured Stations</CardTitle>
            <Factory className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoading ? "--" : Math.max(0, stations.length - stationMpiCounts.size)}
            </div>
            <p className="text-xs text-muted-foreground">Stations without MPIs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[hsl(var(--primary))]">Recent MPIs</CardTitle>
              <Button variant="outline" onClick={() => onNavigate("mpi-list")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading MPIs...</div>
            ) : mpis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No MPIs found</p>
                <p className="text-sm text-gray-400 mb-4">Create your first Manufacturing Process Instruction</p>
                <Button onClick={() => onNavigate("create-mpi")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create MPI
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mpis.slice(0, 5).map((mpi) => (
                  <div
                    key={mpi.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-[hsl(var(--primary))]" />
                      <div>
                        <p className="font-medium">{mpi.processName}</p>
                        <p className="text-sm text-gray-500">Station: {mpi.stationName}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {mpi.stationName}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[hsl(var(--primary))]">Station MPI Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading data...</div>
            ) : stationMpiCounts.size === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No MPI distribution data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from(stationMpiCounts.entries())
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([stationName, count]) => (
                    <div key={stationName} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stationName}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[hsl(var(--primary))] h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...stationMpiCounts.values())) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
