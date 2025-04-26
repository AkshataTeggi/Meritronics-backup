"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

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

export default function AddStationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: `sta-${Math.random().toString(36).substring(2, 10)}`,
    code: `STA-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    name: "",
    description: "",
    type: "",
    status: "active",
    location: "",
    operator: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    const now = new Date().toISOString()
    const today = new Date()
    const threeMonthsLater = new Date(today)
    threeMonthsLater.setMonth(today.getMonth() + 3)

    const formatDateString = (date: Date) => {
      return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
    }

    // Create the new station object with the correct structure
    const newStation = {
      id: formData.id,
      name: formData.name,
      description: formData.description || "",
      type: formData.type,
      code: formData.code,
      status: formData.status.toLowerCase(),
      location: formData.location || "Building A, Floor 1",
      operator: formData.operator || "Unassigned",
      lastMaintenance: formatDateString(today),
      nextMaintenance: formatDateString(threeMonthsLater),
      efficiency: 85, // Default efficiency
      equipment: [],
      createdAt: now,
      updatedAt: now,
    }

    try {
      // Get existing stations from localStorage
      const existingStationsJSON = localStorage.getItem(STORAGE_KEYS.STATIONS)
      const existingStations = existingStationsJSON ? JSON.parse(existingStationsJSON) : []

      // Add the new station
      const updatedStations = [...existingStations, newStation]

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(updatedStations))

      // Navigate back to stations page
      router.push("/stations")
    } catch (error) {
      console.error("Error saving station:", error)
      alert("There was an error saving the station. Please try again.")
    }
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New Station</h1>
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
              <Button type="submit">Add Station</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
