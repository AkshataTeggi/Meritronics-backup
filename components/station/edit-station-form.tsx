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
import { Factory, Save, ArrowLeft } from "lucide-react"
import { stationApi } from "@/lib/stations"
import { Station, UpdateStationDto } from "@/types/station"

interface EditStationFormProps {
  stationId: string
}

export default function EditStationForm({ stationId }: EditStationFormProps) {
  const [station, setStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState<UpdateStationDto>({
    stationId: "",
    name: "",
    description: "",
    location: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const stationData = await stationApi.findOne(stationId)
        setStation(stationData)
        setFormData({
          stationId: stationData.stationId,
          name: stationData.name,
          description: stationData.description || "",
          location: stationData.location || "",
          status: stationData.status || "active",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch station")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStation()
  }, [stationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      await stationApi.update(stationId, formData)
      setSuccess("Station updated successfully!")
      setTimeout(() => {
        router.push("/dashboard/stations")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update station")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading station...</p>
        </div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Station not found</p>
        <Button onClick={() => router.push("/dashboard/stations")} className="mt-4">
          Back to Stations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit Station</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Factory className="h-5 w-5" />
            Edit Station: {station.name}
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
                <Label htmlFor="stationId" className="text-sm font-medium">
                  Station ID *
                </Label>
                <Input
                  id="stationId"
                  type="text"
                  value={formData.stationId}
                  onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                  placeholder="Enter station ID"
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Station Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter station name"
                  required
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "maintenance") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter station description"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Updating..." : "Update Station"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/stations")}
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
