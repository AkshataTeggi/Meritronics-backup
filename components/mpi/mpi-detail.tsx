"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Calendar,
  Settings,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi } from "@/types/mpi"

interface MpiDetailsProps {
  mpiId: string
}

export default function MpiDetails({ mpiId }: MpiDetailsProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const mpiData = await mpiApi.findOne(mpiId)
        setMpi(mpiData)
      } catch (err) {
        console.error("Error fetching MPI:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch MPI data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMpi()
  }, [mpiId])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !mpi) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MPIs
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "MPI not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MPIs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Details</h1>
            <p className="text-sm text-gray-500">Manufacturing Process Instruction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            MPI
          </Badge>
        </div>
      </div>

      {/* MPI Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{mpi.name}</CardTitle>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline">Rev: {mpi.revision}</Badge>
                  <span className="text-sm text-gray-500">Effective: {formatDate(mpi.effectiveDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revision</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mpi.revision}</div>
            <p className="text-xs text-muted-foreground">Current version</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effective Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatDate(mpi.effectiveDate)}</div>
            <p className="text-xs text-muted-foreground">Implementation date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatDate(mpi.updatedAt)}</div>
            <p className="text-xs text-muted-foreground">Last modification</p>
          </CardContent>
        </Card>
      </div>

      {/* MPI Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            MPI Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">MPI Name</label>
                <p className="text-base font-medium">{mpi.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Revision</label>
                <p className="text-base font-medium">{mpi.revision}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Effective Date</label>
                <p className="text-base font-medium">{formatDate(mpi.effectiveDate)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-base font-medium">{formatDateTime(mpi.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="text-base font-medium">{formatDateTime(mpi.updatedAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-base font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
