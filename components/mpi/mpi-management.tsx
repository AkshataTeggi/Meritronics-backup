"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Plus, Edit, Trash2, RefreshCw, Search, Factory, FileText } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { stationApi } from "@/lib/stations"
import { Mpi } from "@/types/mpi"
import { Station } from "@/types/station"

export default function MpiManagement() {
  const [mpis, setMpis] = useState<Mpi[]>([])
  const [filteredMpis, setFilteredMpis] = useState<Mpi[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchData = async () => {
    setIsLoading(true)
    setError("")
    try {
      const [mpiList, stationList] = await Promise.all([mpiApi.findAll(), stationApi.findAll()])
      console.log("MPI fetching response", mpiList)
      setMpis(mpiList)
      setFilteredMpis(mpiList)
      setStations(stationList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mpis.filter(
        (mpi) =>
          mpi.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (mpi.purpose && mpi.purpose.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredMpis(filtered)
    } else {
      setFilteredMpis(mpis)
    }
  }, [searchTerm, mpis])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this MPI?")) return
    try {
      await mpiApi.remove(id)
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete MPI")
    }
  }

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
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Management</h1>
        <Button
          onClick={() => router.push("/dashboard/mpi/create")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create MPI
        </Button>
      </div>

      {/* Statistics Cards */}
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

      {/* Search and MPI List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
              <Settings className="h-5 w-5" />
              All MPIs
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search MPIs
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by station name or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
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
            <div className="text-center py-8 text-gray-500">Loading MPIs...</div>
          ) : filteredMpis.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No MPIs found matching your search" : "No MPIs found"}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMpis.map((mpi) => (
                <div
                  key={mpi.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{mpi.stationName}</h3>
                        {mpi.revision && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {mpi.revision}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {mpi.purpose && (
                          <p>
                            <span className="font-medium">Purpose:</span> {mpi.purpose.substring(0, 100)}
                            {mpi.purpose.length > 100 ? "..." : ""}
                          </p>
                        )}
                        {mpi.effectiveDate && (
                          <p>
                            <span className="font-medium">Effective Date:</span>{" "}
                            {new Date(mpi.effectiveDate).toLocaleDateString()}
                          </p>
                        )}
                        {mpi.createdAt && (
                          <p>
                            <span className="font-medium">Created:</span> {new Date(mpi.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mpi.id)}
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
    </div>
  )
}
