"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mpiApi, stationApi } from "@/lib/api"
import type { Mpi, Station, UpdateMpiDto } from "@/lib/types"
import { Settings, Save, ArrowLeft } from "lucide-react"

interface EditMpiFormProps {
  mpiId: string
}

export default function EditMpiForm({ mpiId }: EditMpiFormProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [formData, setFormData] = useState<UpdateMpiDto>({
    stationName: "",
    processName: "",
    parameters: {},
    specifications: {},
  })
  const [parametersText, setParametersText] = useState("")
  const [specificationsText, setSpecificationsText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mpiData, stationList] = await Promise.all([mpiApi.findOne(mpiId), stationApi.findAll()])

        setMpi(mpiData)
        setStations(stationList)
        setFormData({
          stationName: mpiData.stationName,
          processName: mpiData.processName,
          parameters: mpiData.parameters || {},
          specifications: mpiData.specifications || {},
        })
        setParametersText(mpiData.parameters ? JSON.stringify(mpiData.parameters, null, 2) : "")
        setSpecificationsText(mpiData.specifications ? JSON.stringify(mpiData.specifications, null, 2) : "")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch MPI")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [mpiId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const parameters = parametersText ? JSON.parse(parametersText) : {}
      const specifications = specificationsText ? JSON.parse(specificationsText) : {}

      await mpiApi.update(mpiId, {
        ...formData,
        parameters,
        specifications,
      })

      setSuccess("MPI updated successfully!")
      setTimeout(() => {
        router.push("/dashboard/mpi")
      }, 2000)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format in parameters or specifications")
      } else {
        setError(err instanceof Error ? err.message : "Failed to update MPI")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading MPI...</p>
        </div>
      </div>
    )
  }

  if (!mpi) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">MPI not found</p>
        <Button onClick={() => router.push("/dashboard/mpi")} className="mt-4">
          Back to MPIs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit MPI</h1>
      </div>

      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Settings className="h-5 w-5" />
            Edit MPI: {mpi.processName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stationName" className="text-sm font-medium">
                  Station Name *
                </Label>
                <Select
                  value={formData.stationName}
                  onValueChange={(value) => setFormData({ ...formData, stationName: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="processName" className="text-sm font-medium">
                  Process Name *
                </Label>
                <Input
                  id="processName"
                  type="text"
                  value={formData.processName}
                  onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                  placeholder="Enter process name"
                  required
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parameters" className="text-sm font-medium">
                Parameters (JSON format)
              </Label>
              <Textarea
                id="parameters"
                value={parametersText}
                onChange={(e) => setParametersText(e.target.value)}
                placeholder='{"temperature": 25, "pressure": 1.2}'
                rows={3}
                className="resize-none font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications" className="text-sm font-medium">
                Specifications (JSON format)
              </Label>
              <Textarea
                id="specifications"
                value={specificationsText}
                onChange={(e) => setSpecificationsText(e.target.value)}
                placeholder='{"tolerance": 0.1, "quality": "high"}'
                rows={3}
                className="resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Updating..." : "Update MPI"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/mpi")}
                disabled={isSubmitting}
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
