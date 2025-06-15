"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Factory,
  MapPin,
  User,
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Edit,
  Activity,
  Gauge,
  Wrench,
  BookOpen,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/constants"
import { StationIcon } from "../station/station-icon"

// Use the correct API import path

interface Station {
  id: string
  stationId: string
  stationName: string
  stationCode?: string
  status?: string
  location?: string
  operator?: string
  description?: string
  specifications?: { id: string; name: string; type: string; isRequired: boolean; value?: string }[]
  technicalSpecifications?: { id: string; name: string; value: string; unit?: string }[]
  flowCharts?: { id: string; content: string; files?: { name: string; url: string }[] }[]
  documentation?: { id: string; content: string; files?: { name: string; url: string }[] }[]
  mpi?: { id: string; name: string; revision: string; effectiveDate: string }
}

// Station API functions
const stationApi = {
  async findOne(id: string): Promise<Station> {
    console.log(`Fetching station details for ID: ${id}`)
    const response = await fetch(`${API_BASE_URL}/stations/${id}`)

    if (!response.ok) {
      console.error(`Failed to fetch station ${id}:`, response.status, response.statusText)
      throw new Error(`Failed to fetch station: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Station ${id} data:`, data)
    return data
  },

  async findAll(): Promise<Station[]> {
    console.log("Fetching all stations")
    const response = await fetch(`${API_BASE_URL}/stations`)

    if (!response.ok) {
      console.error("Failed to fetch stations:", response.status, response.statusText)
      throw new Error(`Failed to fetch stations: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("All stations data:", data)
    return data
  },
}

export function StationDetailsTabsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")

  // Get selected station IDs from URL params
  const selectedStationIds = searchParams.get("stations")?.split(",") || []

  useEffect(() => {
    console.log("Selected station IDs from URL:", selectedStationIds)
    if (selectedStationIds.length > 0) {
      fetchSelectedStations()
    } else {
      setError("No stations selected")
      setIsLoading(false)
    }
  }, [selectedStationIds])

  useEffect(() => {
    // Set first station as active tab
    if (stations.length > 0 && !activeTab) {
      setActiveTab(stations[0].id)
      console.log("Set active tab to:", stations[0].id)
    }
  }, [stations, activeTab])

  const fetchSelectedStations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Fetching selected stations:", selectedStationIds)

      // Fetch each selected station
      const stationPromises = selectedStationIds.map(async (id) => {
        try {
          return await stationApi.findOne(id)
        } catch (err) {
          console.error(`Failed to fetch station ${id}:`, err)
          return null
        }
      })

      const stationResults = await Promise.allSettled(stationPromises)
      console.log("Station fetch results:", stationResults)

      const validStations = stationResults
        .filter(
          (result): result is PromiseFulfilledResult<Station> => result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => result.value)

      console.log("Valid stations:", validStations)

      if (validStations.length === 0) {
        setError("No valid stations found")
      } else {
        setStations(validStations)
      }
    } catch (err) {
      console.error("Failed to fetch station details:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch station details")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "inactive":
        return <AlertCircle className="h-3 w-3" />
      case "maintenance":
        return <Settings className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading station details...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="ml-2" onClick={fetchSelectedStations}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (stations.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No station details available. Please go back and select stations.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5" />
          Station Details ({stations.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Viewing details for {stations.length} selected station{stations.length > 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="grid w-full overflow-x-auto"
            style={{ gridTemplateColumns: `repeat(${stations.length}, minmax(0, 1fr))` }}
          >
            {stations.map((station) => (
              <TabsTrigger key={station.id} value={station.id} className="flex items-center gap-2 min-w-0">
                <StationIcon stationName={station.stationName || "default"} className="h-4 w-4" />
                <span className="truncate">{station.stationName || "Unknown Station"}</span>
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {(station.specifications?.length || 0) + (station.technicalSpecifications?.length || 0)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {stations.map((station) => (
            <TabsContent key={station.id} value={station.id} className="space-y-6 mt-6">
              {/* Station Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <StationIcon stationName={station.stationName || "default"} className="h-8 w-8" />
                      <div>
                        <CardTitle className="text-xl">{station.stationName || "Unknown Station"}</CardTitle>
                        <p className="text-muted-foreground">
                          ID: {station.stationId || "N/A"} • Code: {station.stationCode || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(station.status || "inactive")} flex items-center gap-1`}>
                        {getStatusIcon(station.status || "inactive")}
                        {(station.status || "inactive").charAt(0).toUpperCase() +
                          (station.status || "inactive").slice(1)}
                      </Badge>
                      {station.mpi && <Badge className="bg-purple-100 text-purple-800">MPI Assigned</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{station.location || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Operator</p>
                        <p className="text-sm text-muted-foreground">{station.operator || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">{station.status || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                  {station.description && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{station.description}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Specifications</p>
                        <p className="text-2xl font-bold">{station.specifications?.length || 0}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Tech Specs</p>
                        <p className="text-2xl font-bold">{station.technicalSpecifications?.length || 0}</p>
                      </div>
                      <Gauge className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Flow Charts</p>
                        <p className="text-2xl font-bold">{station.flowCharts?.length || 0}</p>
                      </div>
                      <Wrench className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Documents</p>
                        <p className="text-2xl font-bold">{station.documentation?.length || 0}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Specifications */}
                {station.specifications && station.specifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Specifications ({station.specifications.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {station.specifications.map((spec) => (
                          <div key={spec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{spec.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {spec.type}
                                </Badge>
                                {spec.isRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              {spec.value && <p className="text-xs text-muted-foreground mt-1">Value: {spec.value}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Technical Specifications */}
                {station.technicalSpecifications && station.technicalSpecifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-5 w-5" />
                        Technical Specifications ({station.technicalSpecifications.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {station.technicalSpecifications.map((tech) => (
                          <div key={tech.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{tech.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {tech.value} {tech.unit && `(${tech.unit})`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Flow Charts */}
                {station.flowCharts && station.flowCharts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Flow Charts ({station.flowCharts.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {station.flowCharts.map((chart) => (
                          <div key={chart.id} className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm">{chart.content}</p>
                            {chart.files && chart.files.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {chart.files.map((file, index) => (
                                  <Button key={index} variant="outline" size="sm" className="h-6 text-xs">
                                    <Download className="h-3 w-3 mr-1" />
                                    {file.name}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Documentation */}
                {station.documentation && station.documentation.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Documentation ({station.documentation.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {station.documentation.map((doc) => (
                          <div key={doc.id} className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-sm">{doc.content}</p>
                            {doc.files && doc.files.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {doc.files.map((file, index) => (
                                  <Button key={index} variant="outline" size="sm" className="h-6 text-xs">
                                    <Download className="h-3 w-3 mr-1" />
                                    {file.name}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* MPI Information */}
              {station.mpi && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Associated MPI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{station.mpi.name}</p>
                          <p className="text-sm text-muted-foreground">Revision: {station.mpi.revision}</p>
                          <p className="text-sm text-muted-foreground">
                            Effective Date: {new Date(station.mpi.effectiveDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View MPI
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit MPI
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Station: {station.stationName || "Unknown"} ({station.stationId || "N/A"})
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Station
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
