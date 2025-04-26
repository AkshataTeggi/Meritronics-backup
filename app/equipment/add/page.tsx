"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import MainLayout from "@/components/main-layout"

// Equipment types array
const equipmentTypes = [
  "Inspection Equipment",
  "Cleaning Equipment",
  "Assembly Equipment",
  "Marking Equipment",
  "SMT Equipment",
  "Thermal Equipment",
  "Printing Equipment",
  "Rework Equipment",
  "Quality Control Equipment",
  "Soldering Equipment",
  "Testing Equipment",
]

// Equipment statuses array
const equipmentStatuses = ["Operational", "Maintenance", "Offline"]

export default function AddEquipmentPage() {
  const router = useRouter()
  const [stations, setStations] = useState<any[]>([])
  const [formData, setFormData] = useState({
    id: `EQ-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    name: "",
    status: "operational",
    type: "",
    serialNumber: `SN-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    manufacturer: "",
    model: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    lastMaintenance: new Date().toISOString().split("T")[0],
    nextMaintenance: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split("T")[0],
    stationId: "",
    stationName: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load stations for dropdown
  useEffect(() => {
    const savedStations = localStorage.getItem("meritronics-stations")
    if (savedStations) {
      const parsedStations = JSON.parse(savedStations)
      setStations(parsedStations)
    }
  }, [])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // If station is selected, update the station name
    if (name === "stationId") {
      const selectedStation = stations.find((station) => station.id === value)
      if (selectedStation) {
        setFormData((prev) => ({ ...prev, stationName: selectedStation.name }))
      }
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Equipment name is required"
    }

    if (!formData.type) {
      newErrors.type = "Equipment type is required"
    }

    if (!formData.stationId) {
      newErrors.stationId = "Station assignment is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Format dates for display
    const formatDateString = (dateString: string) => {
      const date = new Date(dateString)
      return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
    }

    // Create the equipment object to save
    const equipmentToAdd = {
      id: formData.id,
      name: formData.name,
      status: formData.status,
      type: formData.type,
      serialNumber: formData.serialNumber || "Unknown",
      manufacturer: formData.manufacturer || "Unknown",
      model: formData.model || "Unknown",
      purchaseDate: formatDateString(formData.purchaseDate),
      lastMaintenance: formatDateString(formData.lastMaintenance),
      nextMaintenance: formatDateString(formData.nextMaintenance),
      location: "Building A, Floor 1", // Default location
      assignedStation: formData.stationName,
      notes: formData.notes || "",
    }

    // Get existing equipment
    const savedEquipment = localStorage.getItem("meritronics-equipment")
    const equipment = savedEquipment ? JSON.parse(savedEquipment) : []

    // Add new equipment
    equipment.push(equipmentToAdd)

    // Save updated equipment
    localStorage.setItem("meritronics-equipment", JSON.stringify(equipment))

    // Add the equipment to the station
    const savedStations = localStorage.getItem("meritronics-stations")
    if (savedStations) {
      const stations = JSON.parse(savedStations)
      const updatedStations = stations.map((station: any) => {
        if (station.id === formData.stationId) {
          if (!station.equipment) {
            station.equipment = []
          }

          // Add basic equipment info to the station
          station.equipment.push({
            id: equipmentToAdd.id,
            name: equipmentToAdd.name,
            status: equipmentToAdd.status,
            type: equipmentToAdd.type,
            serialNumber: equipmentToAdd.serialNumber,
          })
        }
        return station
      })

      // Save updated stations to localStorage
      localStorage.setItem("meritronics-stations", JSON.stringify(updatedStations))

      // Navigate back to equipment list
      router.push("/equipment")
    }
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New Equipment</h1>
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
                  <Input id="id" name="id" value={formData.id} onChange={handleInputChange} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Enter serial number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter equipment name"
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
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
                      {equipmentStatuses.map((status) => (
                        <SelectItem key={status.toLowerCase()} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="Enter manufacturer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter model"
                  />
                </div>
              </div>

           

              <div className="space-y-2">
                <Label htmlFor="stationId">Assign to Station *</Label>
                <Select
                  name="stationId"
                  value={formData.stationId}
                  onValueChange={(value) => handleSelectChange("stationId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stationId && <p className="text-sm text-red-500">{errors.stationId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter additional notes about this equipment"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Add Equipment</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
