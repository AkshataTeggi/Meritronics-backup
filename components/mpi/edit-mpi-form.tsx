"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, ArrowLeft, AlertCircle, Calendar, FileText, Edit, Trash2 } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi, UpdateMpiDto } from "@/types/mpi"

interface EditMpiFormProps {
  mpiId: string
}

export default function EditMpiForm({ mpiId }: EditMpiFormProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [formData, setFormData] = useState<UpdateMpiDto>({
    name: "",
    revision: "",
    effectiveDate: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const mpiData = await mpiApi.findOne(mpiId)
        setMpi(mpiData)

        const effectiveDate = mpiData.effectiveDate ? new Date(mpiData.effectiveDate).toISOString().slice(0, 16) : ""

        setFormData({
          name: mpiData.name,
          revision: mpiData.revision,
          effectiveDate: effectiveDate,
        })
      } catch (err) {
        console.error("Error fetching MPI:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch MPI data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMpi()
  }, [mpiId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (!formData.name || !formData.revision || !formData.effectiveDate) {
        throw new Error("Name, revision, and effective date are required")
      }

      await mpiApi.update(mpiId, formData)
      router.push("/dashboard/mpi")
    } catch (err) {
      console.error("Error updating MPI:", err)
      setError(err instanceof Error ? err.message : "Failed to update MPI.")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
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

  if (!mpi) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>MPI not found. It may have been deleted.</AlertDescription>
      </Alert>
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
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit MPI</h1>
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

      {/* MPI Overview Card */}
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
              <Button variant="outline" size="sm">
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

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit MPI Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">MPI Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter MPI name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revision">Revision *</Label>
                <Input
                  id="revision"
                  value={formData.revision || ""}
                  onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                  placeholder="Enter revision (e.g., 1.0, A, Rev-1)"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date *</Label>
              <div className="relative">
                <Input
                  id="effectiveDate"
                  type="datetime-local"
                  value={formData.effectiveDate || ""}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/mpi")} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
