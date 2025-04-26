"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Eye,
  Cpu,
  Droplet,
  HandMetal,
  Zap,
  Printer,
  RotateCw,
  PenToolIcon,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface Equipment {
  id: string
  name: string
  status: "operational" | "maintenance" | "offline"
  type: string
  serialNumber: string
  manufacturer: string
  model: string
  purchaseDate: string
  lastMaintenance: string
  nextMaintenance: string
  stationId: string
  stationName: string
}

export default function EquipmentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const equipmentId = params.id as string

  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)

  // Load equipment data
  useEffect(() => {
    const savedStations = localStorage.getItem("stations")
    if (savedStations) {
      const stations = JSON.parse(savedStations)

      // Find the equipment in the stations
      for (const station of stations) {
        if (station.equipment && station.equipment.length > 0) {
          const foundEquipment = station.equipment.find((eq: any) => eq.id === equipmentId)
          if (foundEquipment) {
            // Create a full equipment object with additional properties
            setEquipment({
              ...foundEquipment,
              stationId: station.id,
              stationName: station.name,
              manufacturer: foundEquipment.manufacturer || "Unknown",
              model: foundEquipment.model || "Unknown",
              purchaseDate: foundEquipment.purchaseDate || "01-01-2023",
              lastMaintenance: foundEquipment.lastMaintenance || "01-01-2023",
              nextMaintenance: foundEquipment.nextMaintenance || "01-01-2024",
            })
            break
          }
        }
      }
    }

    setLoading(false)
  }, [equipmentId])

  // Get appropriate icon based on type
  function getTypeIcon(type: string) {
    switch (type?.toLowerCase()) {
      case "inspection equipment":
        return <Eye className="h-5 w-5" />
      case "smt equipment":
        return <Cpu className="h-5 w-5" />
      case "cleaning equipment":
        return <Droplet className="h-5 w-5" />
      case "assembly equipment":
        return <HandMetal className="h-5 w-5" />
      case "soldering equipment":
        return <Zap className="h-5 w-5" />
      case "printing equipment":
        return <Printer className="h-5 w-5" />
      case "thermal equipment":
        return <RotateCw className="h-5 w-5" />
      case "rework equipment":
        return <PenToolIcon className="h-5 w-5" />
      case "quality control equipment":
        return <Eye className="h-5 w-5" />
      case "testing equipment":
        return <Settings className="h-5 w-5" />
      case "marking equipment":
        return <Zap className="h-5 w-5" />
      default:
        return <PenToolIcon className="h-5 w-5" />
    }
  }

  // Get status icon based on status
  function getStatusIcon(status: string) {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "offline":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  // Get status text color based on status
  function getStatusTextColor(status: string) {
    switch (status) {
      case "operational":
        return "text-green-500"
      case "offline":
        return "text-red-500"
      case "maintenance":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  // Capitalize first letter of each word
  function capitalize(str: string) {
    return str
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Loading Equipment Details...</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Equipment Not Found</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The equipment you are looking for could not be found.</p>
            <Button className="mt-4" onClick={() => router.push("/equipment")}>
              Go to Equipment List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gray-100 text-gray-700">{getTypeIcon(equipment.type)}</div>
          <h1 className="text-2xl font-bold">{equipment.name}</h1>
          <div className="flex items-center">
            {getStatusIcon(equipment.status)}
            <span className={`ml-1 text-sm font-medium ${getStatusTextColor(equipment.status)}`}>
              {capitalize(equipment.status)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => router.push(`/equipment/edit/${equipment.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
                    <p className="text-base">{equipment.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Serial Number</h3>
                    <p className="text-base">{equipment.serialNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                    <p className="text-base">{equipment.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="flex items-center">
                      {getStatusIcon(equipment.status)}
                      <span className={`ml-1 text-base font-medium ${getStatusTextColor(equipment.status)}`}>
                        {capitalize(equipment.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Manufacturer</h3>
                    <p className="text-base">{equipment.manufacturer}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
                    <p className="text-base">{equipment.model}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Purchase Date</h3>
                    <p className="text-base">{equipment.purchaseDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Maintenance</h3>
                    <p className="text-base">Last: {equipment.lastMaintenance}</p>
                    <p className="text-base">Next: {equipment.nextMaintenance}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned Station</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <Link href={`/stations/${equipment.stationId}`} className="text-base font-medium hover:underline">
                    {equipment.stationName}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">ID: {equipment.stationId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-md p-6 text-center">
                <p className="text-muted-foreground">No documentation available for this equipment.</p>
                <Button className="mt-4" variant="outline">
                  Upload Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-md p-6 text-center">
                <p className="text-muted-foreground">No specifications available for this equipment.</p>
                <Button className="mt-4" variant="outline">
                  Add Specifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
