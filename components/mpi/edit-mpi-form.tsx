"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Save, ArrowLeft, AlertCircle } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi, UpdateMpiDto } from "@/types/mpi"

interface EditMpiFormProps {
  mpiId: string
}

export default function EditMpiForm({ mpiId }: EditMpiFormProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [formData, setFormData] = useState<UpdateMpiDto>({
    jobId: "",
    assemblyId: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const mpiData = await mpiApi.findOne(mpiId)
        setMpi(mpiData)
        setFormData({
          jobId: mpiData.jobId,
          assemblyId: mpiData.assemblyId,
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
    setSuccess(null)

    try {
      // Validate form
      if (!formData.jobId || !formData.assemblyId) {
        throw new Error("Job ID and Assembly ID are required")
      }

      // Update MPI
      await mpiApi.update(mpiId, formData)

      setSuccess("MPI updated successfully")
      setTimeout(() => {
        router.push("/dashboard/mpi")
      }, 2000)
    } catch (err) {
      console.error("Error updating MPI:", err)
      setError(err instanceof Error ? err.message : "Failed to update MPI.")
    } finally {
      setIsSaving(false)
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
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold">Edit MPI</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MPI Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobId">Job ID</Label>
                <Input
                  id="jobId"
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  placeholder="Enter job ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assemblyId">Assembly ID</Label>
                <Input
                  id="assemblyId"
                  value={formData.assemblyId}
                  onChange={(e) => setFormData({ ...formData, assemblyId: e.target.value })}
                  placeholder="Enter assembly ID"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
