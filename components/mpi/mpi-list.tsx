"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Edit, Trash2, ClipboardList, Factory, AlertCircle } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi } from "@/types/mpi"

interface MpiListProps {
  mpis: Mpi[]
  isLoading: boolean
  error: string | null
}

export function MpiList({ mpis, isLoading, error }: MpiListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this MPI?")) {
      try {
        setDeletingId(id)
        setDeleteError(null)
        await mpiApi.remove(id)
        router.refresh()
      } catch (err) {
        console.error("Error deleting MPI:", err)
        setDeleteError(err instanceof Error ? err.message : "Failed to delete MPI.")
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (deleteError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{deleteError}</AlertDescription>
      </Alert>
    )
  }

  if (!mpis || mpis.length === 0) {
    return <div className="text-center p-8 text-gray-500">No MPIs found. Create your first MPI to get started.</div>
  }

  return (
    <div className="grid gap-4">
      {mpis.map((mpi) => (
        <Card key={mpi.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Job ID: {mpi.jobId || "N/A"}</h3>
                  <Badge variant="outline">Assembly: {mpi.assemblyId || "N/A"}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(mpi.id)}
                    disabled={deletingId === mpi.id}
                  >
                    {deletingId === mpi.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      Checklists ({mpi.checklistMpis ? mpi.checklistMpis.length : 0})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      Stations ({mpi.stationMpis ? mpi.stationMpis.length : 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
