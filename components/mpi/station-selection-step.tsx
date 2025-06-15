"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Factory,
  MapPin,
  User,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Gauge,
  Eye,
  Calendar,
  Workflow,
  BookOpen,
  Wrench,
  Database,
  Hash,
  Clock,
  Building,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/constants"
import { StationIcon } from "../station/station-icon"

// Use the correct API base URL

interface MPI {
  id: string
  name: string
  revision: string
  effectiveDate: string
  createdAt: string
  updatedAt: string
}

interface Specification {
  id: string
  name: string
  slug: string
  type: "TEXT" | "NUMBER" | "BOOLEAN_TYPE" | "DATE" | "DROPDOWN"
  isRequired: boolean
  isActive: boolean
  suggestions: string[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  stationId: string
  mpiId: string | null
}

interface TechnicalSpecification {
  id: string
  name: string
  value: string
  stationId: string
  mpiId?: string | null
}

interface FlowChart {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  mpiId: string | null
}

interface Documentation {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  mpiId: string | null
}

interface Station {
  id: string
  stationId: string
  stationName: string
  status: string
  stationCode: string
  description: string
  location: string
  operator: string
  addStation: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  mpiId?: string | null
  mpi?: MPI | null
  technicalSpecifications: TechnicalSpecification[]
  specifications: Specification[]
  flowCharts: FlowChart[]
  documentation: Documentation[]
}

// Station API functions
const stationApi = {
  async findAll(): Promise<Station[]> {
    console.log("Fetching all stations from:", `${API_BASE_URL}/stations`)
    const response = await fetch(`${API_BASE_URL}/stations`)

    if (!response.ok) {
      console.error("Failed to fetch stations:", response.status, response.statusText)
      throw new Error(`Failed to fetch stations: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Fetched stations:", data)
    return data
  },

  async findOne(id: string): Promise<Station> {
    console.log(`Fetching station details for ID: ${id}`)
    const response = await fetch(`${API_BASE_URL}/mpi/station/${id}`)

    if (!response.ok) {
      console.error(`Failed to fetch station ${id}:`, response.status, response.statusText)
      throw new Error(`Failed to fetch station: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Station ${id} data:`, data)
    return data
  },
}

export function StationSelectionPage() {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [selectedStationDetails, setSelectedStationDetails] = useState<Station[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStations()
  }, [])

  // Fetch detailed information for selected stations
  useEffect(() => {
    if (selectedStations.length > 0) {
      fetchSelectedStationDetails()
    } else {
      setSelectedStationDetails([])
    }
  }, [selectedStations])

  const fetchStations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await stationApi.findAll()
      setStations(response)
    } catch (err) {
      console.error("Failed to fetch stations:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stations")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSelectedStationDetails = async () => {
    try {
      setIsLoadingDetails(true)
      console.log("Fetching details for selected stations:", selectedStations)

      const stationPromises = selectedStations.map(async (id) => {
        try {
          return await stationApi.findOne(id)
        } catch (err) {
          console.error(`Failed to fetch station ${id}:`, err)
          return null
        }
      })

      const stationResults = await Promise.allSettled(stationPromises)
      const validStations = stationResults
        .filter(
          (result): result is PromiseFulfilledResult<Station> => result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => result.value)

      console.log("Valid selected station details:", validStations)
      setSelectedStationDetails(validStations)
    } catch (err) {
      console.error("Failed to fetch selected station details:", err)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleStationToggle = (stationId: string) => {
    setSelectedStations((prev) => {
      if (prev.includes(stationId)) {
        return prev.filter((id) => id !== stationId)
      } else {
        return [...prev, stationId]
      }
    })
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

  const getSpecificationTypeColor = (type: string) => {
    switch (type) {
      case "TEXT":
        return "bg-blue-100 text-blue-800"
      case "NUMBER":
        return "bg-green-100 text-green-800"
      case "BOOLEAN_TYPE":
        return "bg-purple-100 text-purple-800"
      case "DATE":
        return "bg-orange-100 text-orange-800"
      case "DROPDOWN":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredStations = stations.filter(
    (station) =>
      station.stationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.stationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading stations...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      {selectedStations.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {selectedStations.length} station{selectedStations.length > 1 ? "s" : ""} selected
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={fetchStations}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Station List */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Available Stations ({filteredStations.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                      selectedStations.includes(station.id)
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      id={station.id}
                      checked={selectedStations.includes(station.id)}
                      onCheckedChange={() => handleStationToggle(station.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={station.id} className="text-sm font-semibold cursor-pointer">
                          {station.stationName || "Unknown Station"}
                        </Label>
                        <Badge className={`${getStatusColor(station.status || "inactive")} flex items-center gap-1`}>
                          {getStatusIcon(station.status || "inactive")}
                          {(station.status || "inactive").charAt(0).toUpperCase() +
                            (station.status || "inactive").slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">ID:</span> {station.stationId || "N/A"} •{" "}
                          <span className="font-medium">Code:</span> {station.stationCode || "N/A"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {station.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{station.location}</span>
                            </div>
                          )}
                          {station.operator && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{station.operator}</span>
                            </div>
                          )}
                        </div>
                        {station.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{station.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStations.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Factory className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No stations found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Station Details */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Selected Station Details
              {selectedStations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedStations.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No stations selected</p>
                <p className="text-sm">Select stations from the left to view their details</p>
              </div>
            ) : isLoadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-3 text-lg">Loading station details...</span>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {selectedStationDetails.map((station, index) => (
                    <div key={station.id}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        {/* Station Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <StationIcon stationName={station.stationName || "default"} className="h-8 w-8" />
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">
                                {station.stationName || "Unknown Station"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {station.stationId} • {station.stationCode}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(station.status || "inactive")} flex items-center gap-1`}>
                            {getStatusIcon(station.status || "inactive")}
                            {(station.status || "inactive").charAt(0).toUpperCase() +
                              (station.status || "inactive").slice(1)}
                          </Badge>
                        </div>

                        {/* Basic Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Location</p>
                                <p className="text-sm text-muted-foreground">{station.location || "Not specified"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Operator</p>
                                <p className="text-sm text-muted-foreground">{station.operator || "Not assigned"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Add Station</p>
                                <p className="text-sm text-muted-foreground">{station.addStation || "N/A"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Updated</p>
                                <p className="text-sm text-muted-foreground">{formatDate(station.updatedAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {station.description && (
                          <>
                            <Separator className="my-4" />
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                                <FileText className="h-4 w-4" />
                                Description
                              </p>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded border italic">
                                "{station.description}"
                              </p>
                            </div>
                          </>
                        )}

                        {/* MPI Information */}
                        {station.mpi && (
                          <>
                            <Separator className="my-4" />
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
                                <Database className="h-4 w-4" />
                                Associated MPI
                              </p>
                              <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-gray-900">{station.mpi.name}</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {station.mpi.revision}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Effective: {formatDate(station.mpi.effectiveDate)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    ID: {station.mpi.id.slice(-8)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-white p-3 rounded-lg border text-center">
                            <Wrench className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                            <p className="text-xs font-medium text-gray-700">Specifications</p>
                            <p className="text-lg font-bold text-blue-600">{station.specifications?.length || 0}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border text-center">
                            <Gauge className="h-5 w-5 mx-auto mb-1 text-green-600" />
                            <p className="text-xs font-medium text-gray-700">Tech Specs</p>
                            <p className="text-lg font-bold text-green-600">
                              {station.technicalSpecifications?.length || 0}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border text-center">
                            <Workflow className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                            <p className="text-xs font-medium text-gray-700">Flow Charts</p>
                            <p className="text-lg font-bold text-purple-600">{station.flowCharts?.length || 0}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border text-center">
                            <BookOpen className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                            <p className="text-xs font-medium text-gray-700">Documentation</p>
                            <p className="text-lg font-bold text-orange-600">{station.documentation?.length || 0}</p>
                          </div>
                        </div>

                        {/* Specifications Preview */}
                        {station.specifications && station.specifications.length > 0 && (
                          <>
                            <Separator className="my-4" />
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
                                <Wrench className="h-4 w-4" />
                                Key Specifications ({station.specifications.length})
                              </p>
                              <div className="space-y-2">
                                {station.specifications.slice(0, 3).map((spec) => (
                                  <div key={spec.id} className="bg-white p-3 rounded-lg border">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm text-gray-900">{spec.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge className={getSpecificationTypeColor(spec.type)} variant="outline">
                                          {spec.type}
                                        </Badge>
                                        {spec.isRequired && (
                                          <Badge variant="destructive" className="text-xs">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Slug: {spec.slug}</p>
                                  </div>
                                ))}
                                {station.specifications.length > 3 && (
                                  <p className="text-xs text-muted-foreground text-center py-2">
                                    +{station.specifications.length - 3} more specifications available
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      {selectedStations.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedStations.length} station{selectedStations.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-muted-foreground">Ready to proceed with selected stations</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedStations([])} className="border-blue-200">
                  Clear Selection
                </Button>
                <Button
                  onClick={() => {
                    console.log("Selected stations:", selectedStations)
                    router.push(`/dashboard/mpi/station-selection/details?stations=${selectedStations.join(",")}`)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue with Selected Stations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
