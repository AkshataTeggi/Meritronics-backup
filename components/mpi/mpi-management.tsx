"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Search, AlertCircle, RefreshCw, ClipboardList, Factory, Settings } from "lucide-react"
import { MpiList } from "./mpi-list"
import { Mpi } from "@/types/mpi"
import { mpiApi } from "@/lib/mpi"

export default function MpiManagement() {
  const [mpis, setMpis] = useState<Mpi[]>([])
  const [filteredMpis, setFilteredMpis] = useState<Mpi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const fetchMpis = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Fetching MPIs...")
      const data = await mpiApi.findAll()
      console.log("MPIs fetched:", data)
      setMpis(data)
      setFilteredMpis(data)
    } catch (err) {
      console.error("Error fetching MPIs:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch MPIs.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMpis()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mpis.filter(
        (mpi) =>
          mpi.jobId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mpi.assemblyId?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredMpis(filtered)
    } else {
      setFilteredMpis(mpis)
    }
  }, [searchTerm, mpis])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchMpis()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MPI Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/mpi/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create MPI
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <p className="text-sm">
                Please check your API configuration and ensure the server is running. You can also check the browser
                console for more details.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total MPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : mpis.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Checklists Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : mpis.reduce((acc, mpi) => acc + (mpi.checklistMpis?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stations Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : mpis.reduce((acc, mpi) => acc + (mpi.stationMpis?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by Job ID or Assembly ID..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex items-center gap-2 flex-1">
            <ClipboardList className="h-4 w-4" />
            All MPIs
          </TabsTrigger>
          <TabsTrigger value="checklists" className="flex items-center gap-2 flex-1">
            <Settings className="h-4 w-4" />
            Checklist MPIs
          </TabsTrigger>
          <TabsTrigger value="stations" className="flex items-center gap-2 flex-1">
            <Factory className="h-4 w-4" />
            Station MPIs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <MpiList mpis={filteredMpis} isLoading={isLoading} error={error} />
        </TabsContent>
        <TabsContent value="checklists">
          <MpiList
            mpis={filteredMpis.filter((mpi) => mpi.checklistMpis?.length > 0)}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="stations">
          <MpiList
            mpis={filteredMpis.filter((mpi) => mpi.stationMpis?.length > 0)}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
