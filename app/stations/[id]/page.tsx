"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Trash2,
  MoreVertical,
  Eye,
  Download,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Update the Equipment interface to include installationDate
interface Equipment {
  id: string
  name: string
  status: string
  type: string
  serialNumber: string
  installationDate?: string
  documentation?: string[]
}

interface Station {
  id: string
  name: string
  description: string
  status: string
  code: string
  category?: string
  type?: string
  location: string
  operator: string
  lastMaintenance: string
  nextMaintenance?: string
  efficiency: number
  equipment: Equipment[]
  createdAt: string
  updatedAt: string
}

// Add this helper function near the top of the file, after the other utility functions
function formatDateForInput(dateString: string) {
  if (!dateString) return ""

  // Check if the date is in DD-MM-YYYY format
  if (dateString.includes("-")) {
    const [day, month, year] = dateString.split("-")
    if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`
    }
  }

  // If not in expected format, return as is
  return dateString
}

export default function StationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stationId = params.id as string
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const stationTypes = ["Type A", "Type B", "Type C"]
  const stationStatuses = ["Active", "Inactive", "Maintenance"]

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    // Load stations from localStorage
    const loadStation = () => {
      setLoading(true)

      const savedStations = localStorage.getItem("meritronics-stations") || localStorage.getItem("stations")
      if (savedStations) {
        try {
          const stations: Station[] = JSON.parse(savedStations)
          const foundStation = stations.find((s) => s.id === stationId)

          if (foundStation) {
            // Ensure the station has a category field (for backward compatibility)
            if (!foundStation.category && foundStation.type) {
              foundStation.category = foundStation.type
            }

            // Add nextMaintenance if not present
            if (!foundStation.nextMaintenance) {
              // Calculate next maintenance as 3 months after last maintenance
              const lastDate = new Date(foundStation.lastMaintenance.split("-").reverse().join("-"))
              lastDate.setMonth(lastDate.getMonth() + 3)
              foundStation.nextMaintenance = `${lastDate.getDate().toString().padStart(2, "0")}-${(lastDate.getMonth() + 1).toString().padStart(2, "0")}-${lastDate.getFullYear()}`
            }

            setStation(foundStation)

            // After setting the station in the useEffect, add this code to update the equipment status for demo purposes
            if (foundStation && foundStation.equipment && foundStation.equipment.length > 0) {
              // For demo purposes, set the first equipment to "Needs Attention" if it's not already
              if (foundStation.equipment[0].status.toLowerCase() !== "needs attention") {
                foundStation.equipment[0].status = "Needs Attention"
                foundStation.equipment[0].id = "EQ014"
                foundStation.equipment[0].type = "Cleaning Equipment"
                foundStation.equipment[0].name = "Chemical Processing System"
                foundStation.equipment[0].serialNumber = "CPS-2022-019"
                foundStation.equipment[0].installationDate = "15/01/2022"
              }

              // Add a second equipment for demo purposes if not already present
              if (foundStation.equipment.length === 1) {
                foundStation.equipment.push({
                  id: "EQ007",
                  name: "Automated Optical Inspection System",
                  type: "Inspection Equipment",
                  status: "Operational",
                  serialNumber: "AOI-3D-2022-056",
                  installationDate: "28/02/2022",
                })
              }
            }
          } else {
            setStation(null)
          }
        } catch (error) {
          console.error("Error parsing stations:", error)
          setStation(null)
        }
      } else {
        setStation(null)
      }

      setLoading(false)
    }

    loadStation()
  }, [stationId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
      case "offline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "needs attention":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "operational":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "inactive":
      case "offline":
        return <AlertCircle className="h-4 w-4 mr-1" />
      case "maintenance":
        return <Clock className="h-4 w-4 mr-1" />
      case "needs attention":
        return <AlertCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  const handleSetMaintenance = () => {
    if (station) {
      const updatedStation = {
        ...station,
        status: "Maintenance",
      }
      setStation(updatedStation)

      // Update in localStorage
      const savedStations = localStorage.getItem("meritronics-stations") || localStorage.getItem("stations")
      if (savedStations) {
        try {
          const stations: Station[] = JSON.parse(savedStations)
          const updatedStations = stations.map((s) => (s.id === station.id ? updatedStation : s))
          localStorage.setItem("meritronics-stations", JSON.stringify(updatedStations))
          localStorage.setItem("stations", JSON.stringify(updatedStations))
        } catch (error) {
          console.error("Error updating station:", error)
        }
      }
    }
  }

  const handleSaveEquipment = (updatedEquipment: Equipment) => {
    if (station) {
      const updatedEquipmentList = station.equipment.map((eq) =>
        eq.id === updatedEquipment.id ? updatedEquipment : eq,
      )

      const updatedStation = {
        ...station,
        equipment: updatedEquipmentList,
      }

      setStation(updatedStation)

      // Update in localStorage
      const savedStations = localStorage.getItem("meritronics-stations") || localStorage.getItem("stations")
      if (savedStations) {
        try {
          const stations: Station[] = JSON.parse(savedStations)
          const updatedStations = stations.map((s) => (s.id === station.id ? updatedStation : s))
          localStorage.setItem("meritronics-stations", JSON.stringify(updatedStations))
          localStorage.setItem("stations", JSON.stringify(updatedStations))
        } catch (error) {
          console.error("Error updating station:", error)
        }
      }

      setEditingEquipment(null)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/stations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">Loading station information...</div>
        </div>
      </MainLayout>
    )
  }

  if (!station) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/stations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-2">Station Not Found</h2>
                <p className="text-muted-foreground">
                  The station you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/stations" className="mt-4 inline-block">
                  <Button>Go to Station Management</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">{station.name}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/stations/edit/${station.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Link href="/stations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Station ID and Type Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Station ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">ST{station.id.split("-").pop()?.padStart(3, "0")}</div>
              <div className="text-sm text-muted-foreground">{station.code}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{station.category || station.type}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${station.efficiency}%` }}></div>
                </div>
                <span className="text-lg font-semibold">{station.efficiency}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto overflow-x-auto">
            <TabsTrigger value="details" className="py-2 px-1 sm:px-2">
              Station Details
            </TabsTrigger>
            <TabsTrigger value="equipment" className="py-2 px-1 sm:px-2">
              Equipment ({station.equipment.length})
            </TabsTrigger>
            <TabsTrigger value="documentation" className="py-2 px-1 sm:px-2">
              Documentation
            </TabsTrigger>
            <TabsTrigger value="flowcharts" className="py-2 px-1 sm:px-2">
              Flow Charts
            </TabsTrigger>
            <TabsTrigger value="mpi" className="py-2 px-1 sm:px-2">
              MPI
            </TabsTrigger>
          </TabsList>

          {/* Station Details Tab */}
          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Station Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Location:</h4>
                        <p className="font-medium">{station.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Operator:</h4>
                        <p className="font-medium">{station.operator}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status:</h4>
                        <p className="font-medium">{station.status}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p>{station.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Equipment List</CardTitle>
                <CardDescription>Manage equipment assigned to this station</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {station.equipment.length} {station.equipment.length === 1 ? "item" : "items"}
                </div>

                {station.equipment.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full min-w-[700px]">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Type</th>
                            <th className="text-left p-3 font-medium">Serial Number</th>
                            <th className="text-left p-3 font-medium">Installation Date</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Documentation</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {station.equipment.map((equipment) => {
                            // For demo purposes, add installation date if not present
                            const installDate = equipment.installationDate || "15/01/2022"

                            return (
                              <tr key={equipment.id} className="border-t">
                                <td className="p-3">{equipment.id}</td>
                                <td className="p-3">{equipment.name}</td>
                                <td className="p-3">{equipment.type}</td>
                                <td className="p-3">{equipment.serialNumber}</td>
                                <td className="p-3">{installDate}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                                      equipment.status.toLowerCase() === "needs attention"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : getStatusColor(equipment.status)
                                    }`}
                                  >
                                    {equipment.status.toLowerCase() === "needs attention" ? (
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      getStatusIcon(equipment.status)
                                    )}
                                    {equipment.status}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </td>
                                <td className="p-3">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => router.push(`/equipment/edit/${equipment.id}`)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Documentation
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">No equipment assigned to this station.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button>Add Equipment</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="mt-0">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>All documentation for this station and equipment</CardDescription>
                </div>
                <Button onClick={() => router.push(`/stations/${stationId}/upload-document`)}>
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Upload Document</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Equipment Manuals</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Chemical Processing System - User Manual</div>
                          <div className="text-xs text-muted-foreground">PDF • 2.4 MB • Uploaded on 15/01/2022</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">AOI Operation Manual</div>
                          <div className="text-xs text-muted-foreground">PDF • 3.1 MB • Uploaded on 30/05/2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium">Technical Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">
                            Chemical Processing System - Technical Specifications
                          </div>
                          <div className="text-xs text-muted-foreground">PDF • 1.8 MB • Uploaded on 15/01/2022</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">AOI System - Technical Specifications</div>
                          <div className="text-xs text-muted-foreground">PDF • 2.2 MB • Uploaded on 28/02/2022</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium">Operating Instructions</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Calibration Procedure</div>
                          <div className="text-xs text-muted-foreground">PDF • 2.1 MB • Uploaded on 30/05/2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Troubleshooting Guide</div>
                          <div className="text-xs text-muted-foreground">PDF • 1.5 MB • Uploaded on 15/04/2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium">Additional Resources</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Quick Start Guide</div>
                          <div className="text-xs text-muted-foreground">PDF • 1.2 MB • Uploaded on 10/02/2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md border gap-3">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Safety Guidelines</div>
                          <div className="text-xs text-muted-foreground">PDF • 0.8 MB • Uploaded on 05/03/2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flow Charts Tab */}
          <TabsContent value="flowcharts" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Flow Charts</CardTitle>
                <CardDescription>Station flow charts and diagrams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>No flow charts available for this station.</p>
                  <Button variant="outline" className="mt-4">
                    Upload Flow Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MPI Tab */}
          <TabsContent value="mpi" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Manufacturing Process Instructions</CardTitle>
                <CardDescription>Standard operating procedures for this station</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Pre-Operation Checklist</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Verify all safety equipment is in place and functional</li>
                      <li>Check that all required materials are available</li>
                      <li>Ensure the work area is clean and free of obstructions</li>
                      <li>Confirm equipment is properly calibrated</li>
                    </ul>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Operation Procedure</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <p className="font-medium">Equipment Setup</p>
                        <p className="text-sm text-muted-foreground">
                          Power on the system and wait for initialization to complete
                        </p>
                      </li>
                      <li>
                        <p className="font-medium">Material Loading</p>
                        <p className="text-sm text-muted-foreground">
                          Load materials according to the specifications in the job order
                        </p>
                      </li>
                      <li>
                        <p className="font-medium">Process Execution</p>
                        <p className="text-sm text-muted-foreground">Start the process and monitor for any anomalies</p>
                      </li>
                      <li>
                        <p className="font-medium">Quality Check</p>
                        <p className="text-sm text-muted-foreground">Perform quality inspection on completed work</p>
                      </li>
                      <li>
                        <p className="font-medium">Shutdown Procedure</p>
                        <p className="text-sm text-muted-foreground">
                          Properly shut down equipment and clean work area
                        </p>
                      </li>
                    </ol>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Safety Precautions</h3>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-600">Always wear appropriate PPE:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Safety glasses</li>
                        <li>Gloves</li>
                        <li>Protective footwear</li>
                      </ul>
                      <p className="text-sm font-medium text-red-600 mt-2">Emergency Procedures:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>In case of equipment malfunction, press the emergency stop button</li>
                        <li>Report all incidents to the supervisor immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
