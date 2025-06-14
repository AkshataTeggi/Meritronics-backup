"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Save, ArrowLeft, AlertCircle } from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { CreateMpiDto } from "@/types/mpi"

export default function CreateMpiForm() {
  const [formData, setFormData] = useState<CreateMpiDto>({
    jobId: "",
    assemblyId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate form
      if (!formData.jobId || !formData.assemblyId) {
        throw new Error("Job ID and Assembly ID are required")
      }

      // Create MPI
      await mpiApi.create(formData)

      setSuccess("MPI created successfully")
      setTimeout(() => {
        router.push("/dashboard/mpi")
      }, 2000)
    } catch (err) {
      console.error("Error creating MPI:", err)
      setError(err instanceof Error ? err.message : "Failed to create MPI.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold">Create New MPI</h1>
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
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create MPI"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/mpi")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
