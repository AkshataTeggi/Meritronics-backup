"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
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

export default function EditEquipmentPage() {
  const router = useRouter()
  const params = useParams()
  const equipmentId = params.id as string

  const [stations, setStations] = useState<any[]>([])
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    status: "operational",
    type: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    purchaseDate: "",
    lastMaintenance: "",
    nextMaintenance: "",
    stationId: "",
    stationName: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [originalStationId, setOriginalStationId] = useState("")

  // Load equipment data and stations
  useEffect(() => {
    // Load stations
    const savedStations = localStorage.getItem("meritronics-stations")
    if (savedStations) {
      const parsedStations = JSON.parse(savedStations)
      setStations(parsedStations)

      // Find the equipment in the stations
      let foundEquipment = null
      let foundStationId = ""

      for (const station of parsedStations) {
        if (station.equipment && station.equipment.length > 0) {
          const equipment = station.equipment.find((eq: any) => eq.id === equipmentId)
          if (equipment) {
            foundEquipment = {
              ...equipment,
              stationId: station.id,
              stationName: station.name,
              manufacturer: equipment.manufacturer || "Unknown",
              model: equipment.model || "Unknown",
              purchaseDate: formatDateForInput(equipment.purchaseDate) || new Date().toISOString().split("T")[0],
              lastMaintenance: formatDateForInput(equipment.lastMaintenance) || new Date().toISOString().split("T")[0],
              nextMaintenance:
                formatDateForInput(equipment.nextMaintenance) ||
                new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split("T")[0],
              notes: equipment.notes || "",
            }
            foundStationId = station.id
            break
          }
        }
      }

      if (foundEquipment) {
        setFormData(foundEquipment)
        setOriginalStationId(foundStationId)
      } else {
        console.warn("Equipment not found. Staying on edit page.")
        setFormData((prev) => ({ ...prev, id: equipmentId }))
      }
      
    }
  }, [equipmentId, router])

  // Format date from DD-MM-YYYY to YYYY-MM-DD for input
  function formatDateForInput(dateString: string) {
    if (!dateString) return ""

    // Check if the date is in DD-MM-YYYY format
    const parts = dateString.split("-")
    if (parts.length === 3) {
      // Assuming DD-MM-YYYY format
      const [day, month, year] = parts
      return `${year}-${month}-${day}`
    }

    // If not in expected format, return as is
    return dateString
  }

  // Format date from YYYY-MM-DD to DD-MM-YYYY for storage
  function formatDateForStorage(dateString: string) {
    if (!dateString) return ""

    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Create the equipment object to save
    const equipmentToUpdate = {
      id: formData.id,
      name: formData.name,
      status: formData.status,
      type: formData.type,
      serialNumber: formData.serialNumber,
      manufacturer: formData.manufacturer || "Unknown",
      model: formData.model || "Unknown",
      purchaseDate: formatDateForStorage(formData.purchaseDate),
      lastMaintenance: formatDateForStorage(formData.lastMaintenance),
      nextMaintenance: formatDateForStorage(formData.nextMaintenance),
      stationId: formData.stationId,
      stationName: formData.stationName,
      notes: formData.notes || "",
    }

    // Update the equipment in the stations
    const savedStations = localStorage.getItem("meritronics-stations")
    if (savedStations) {
      const stations = JSON.parse(savedStations)

      // If station assignment changed, remove from old station and add to new one
      if (originalStationId !== formData.stationId) {
        // Remove from original station
        const updatedStations = stations.map((station: any) => {
          if (station.id === originalStationId && station.equipment && station.equipment.length > 0) {
            station.equipment = station.equipment.filter((eq: any) => eq.id !== equipmentId)
          }

          // Add to new station
          if (station.id === formData.stationId) {
            if (!station.equipment) {
              station.equipment = []
            }

            // Add basic equipment info to the station
            station.equipment.push({
              id: equipmentToUpdate.id,
              name: equipmentToUpdate.name,
              status: equipmentToUpdate.status,
              type: equipmentToUpdate.type,
              serialNumber: equipmentToUpdate.serialNumber,
            })
          }

          return station
        })

        // Save updated stations to localStorage
        localStorage.setItem("meritronics-stations", JSON.stringify(updatedStations))
      } else {
        // Just update the equipment in the current station
        const updatedStations = stations.map((station: any) => {
          if (station.id === formData.stationId && station.equipment && station.equipment.length > 0) {
            station.equipment = station.equipment.map((eq: any) => {
              if (eq.id === equipmentId) {
                return {
                  id: equipmentToUpdate.id,
                  name: equipmentToUpdate.name,
                  status: equipmentToUpdate.status,
                  type: equipmentToUpdate.type,
                  serialNumber: equipmentToUpdate.serialNumber,
                }
              }
              return eq
            })
          }
          return station
        })

        // Save updated stations to localStorage
        localStorage.setItem("meritronics-stations", JSON.stringify(updatedStations))
      }

      // Navigate back to equipment list
      router.push("/equipment")
    }
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Equipment</h1>
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
                  <Input id="id" name="id" value={formData.id} disabled />
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
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
