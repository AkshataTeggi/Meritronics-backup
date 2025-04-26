"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import type { Station } from "@/types/station"

// Define constants locally in case they're not available from the import
const STATION_TYPES = [
  "Laser Etching",
  "Screen Printing",
  "Pick & Place",
  "Hand Placement",
  "Reflow",
  "AOI",
  "Visual Inspection",
  "Touch Up",
  "PTH",
  "X-Ray",
  "Wave Solder",
  "Wash Clean",
  "Chemical Wash",
]

const STATION_STATUSES = ["Active", "Maintenance", "Inactive"]

const STORAGE_KEYS = {
  STATIONS: "meritronics-stations",
}

export default function EditStationPage() {
  const router = useRouter()
  const params = useParams()
  const stationId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    code: "",
    type: "",
    location: "",
    operator: "",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStation = () => {
      try {
        // Get station from localStorage
        const stationsData = localStorage.getItem(STORAGE_KEYS.STATIONS)
        if (!stationsData) {
          console.error("No stations found in localStorage")
          router.push("/stations")
          return
        }

        const stations: Station[] = JSON.parse(stationsData)
        const station = stations.find((s) => s.id === stationId)

        if (!station) {
          console.error(`Station with id ${stationId} not found`)
          router.push("/stations")
          return
        }

        setFormData({
          name: station.name || "",
          description: station.description || "",
          status: station.status || "",
          code: station.code || "",
          type: station.type || "",
          location: station.location || "",
          operator: station.operator || "",
        })
        setLoading(false)
      } catch (error) {
        console.error("Error loading station:", error)
        router.push("/stations")
      }
    }

    loadStation()
  }, [stationId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get existing stations
      const stationsData = localStorage.getItem(STORAGE_KEYS.STATIONS)
      if (!stationsData) {
        console.error("No stations found in localStorage")
        return
      }

      const stations: Station[] = JSON.parse(stationsData)

      // Update the station
      const updatedStations = stations.map((station) =>
        station.id === stationId
          ? {
              ...station,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : station,
      )

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(updatedStations))

      // Navigate back to stations page
      router.push("/stations")
    } catch (error) {
      console.error("Error updating station:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-pulse">Loading station data...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Station</h1>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
       
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="Station ID"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Static Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., STA-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter station name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATION_STATUSES.map((status) => (
                        <SelectItem key={status.toLowerCase()} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter station description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Building A, Floor 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    name="operator"
                    value={formData.operator}
                    onChange={handleChange}
                    placeholder="Enter operator name"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
