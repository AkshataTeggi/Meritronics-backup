"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Edit, Trash2, RefreshCw, Search } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi } from "@/types/mpi"

export default function MpiList() {
  const [mpis, setMpis] = useState<Mpi[]>([])
  const [filteredMpis, setFilteredMpis] = useState<Mpi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchMpis = async () => {
    setIsLoading(true)
    setError("")
    try {
      const mpiList = await mpiApi.findAll()
      setMpis(mpiList)
      setFilteredMpis(mpiList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch MPIs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMpis()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mpis.filter(
        (mpi) =>
          mpi.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mpi.processName.toLowerCase().includes(searchTerm.toLowerCase()),
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
      await fetchMpis()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete MPI")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Settings className="h-5 w-5" />
            MPI List
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchMpis} disabled={isLoading}>
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
              placeholder="Search by station name or process name..."
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
                      <h3 className="font-semibold text-lg">{mpi.processName}</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {mpi.stationName}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {mpi.parameters && Object.keys(mpi.parameters).length > 0 && (
                        <div>
                          <span className="font-medium">Parameters:</span>
                          <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(mpi.parameters, null, 2)}
                          </pre>
                        </div>
                      )}
                      {mpi.specifications && Object.keys(mpi.specifications).length > 0 && (
                        <div>
                          <span className="font-medium">Specifications:</span>
                          <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(mpi.specifications, null, 2)}
                          </pre>
                        </div>
                      )}
                      {mpi.createdAt && (
                        <p>
                          <span className="font-medium">Created:</span> {new Date(mpi.createdAt).toLocaleDateString()}
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
  )
}
