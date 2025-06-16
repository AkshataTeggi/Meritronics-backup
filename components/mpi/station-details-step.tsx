"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  User,
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Activity,
  Gauge,
  Wrench,
  BookOpen,
  Calendar,
  Hash,
  Clock,
  X,
  Upload,
  Save,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/constants"
import { StationIcon } from "../station/station-icon"

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
  type: "TEXT" | "CHECKBOX" | "DROPDOWN" | "FILE_UPLOAD" | "NUMBER"
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
  unit?: string
  stationId: string
  mpiId?: string | null
  createdAt: string
  updatedAt: string
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

export function StationDetailsTabsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [modalType, setModalType] = useState<"specification" | "technical" | "flowchart" | "documentation" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "specifications" | "technical" | "flowcharts" | "documentation" | null
  >(null)

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Memoize selected station IDs to prevent unnecessary re-renders
  const selectedStationIds = useMemo(() => {
    const stationsParam = searchParams.get("stations")
    console.log("Raw stations param:", stationsParam)
    return stationsParam ? stationsParam.split(",").filter(Boolean) : []
  }, [searchParams])

  useEffect(() => {
    console.log("useEffect triggered with selectedStationIds:", selectedStationIds)
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
          console.log(`Fetching station with ID: ${id}`)
          const station = await stationApi.findOne(id)
          console.log(`Successfully fetched station ${id}:`, station)
          return station
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

  const getSpecificationTypeColor = (type: string) => {
    switch (type) {
      case "TEXT":
        return "bg-blue-100 text-blue-800"
      case "NUMBER":
        return "bg-green-100 text-green-800"
      case "CHECKBOX":
        return "bg-purple-100 text-purple-800"
      case "DROPDOWN":
        return "bg-indigo-100 text-indigo-800"
      case "FILE_UPLOAD":
        return "bg-pink-100 text-pink-800"
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

  const renderSpecificationField = (spec: Specification) => {
    const fieldId = `spec-${spec.id}`
    const fieldValue = formData[spec.slug] || ""

    const handleFieldChange = (value: any) => {
      setFormData((prev) => ({
        ...prev,
        [spec.slug]: value,
      }))

      // Clear error when user starts typing
      if (formErrors[spec.slug]) {
        setFormErrors((prev) => ({
          ...prev,
          [spec.slug]: "",
        }))
      }
    }

    const renderField = () => {
      switch (spec.type) {
        case "TEXT":
          return (
            <Input
              id={fieldId}
              value={fieldValue}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className={formErrors[spec.slug] ? "border-red-500" : ""}
            />
          )

        case "NUMBER":
          return (
            <Input
              id={fieldId}
              type="number"
              value={fieldValue}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className={formErrors[spec.slug] ? "border-red-500" : ""}
            />
          )

        case "DROPDOWN":
          return (
            <Select value={fieldValue} onValueChange={handleFieldChange}>
              <SelectTrigger className={formErrors[spec.slug] ? "border-red-500" : ""}>
                <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {spec.suggestions && spec.suggestions.length > 0 ? (
                  spec.suggestions.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No options available</div>
                )}
              </SelectContent>
            </Select>
          )

        case "CHECKBOX":
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldId}
                checked={fieldValue === true || fieldValue === "true"}
                onCheckedChange={(checked) => handleFieldChange(checked)}
              />
              <Label htmlFor={fieldId} className="text-sm font-normal">
                {spec.name}
              </Label>
            </div>
          )

        case "FILE_UPLOAD":
          return (
            <div className="space-y-2">
              <Input
                id={fieldId}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFieldChange(file.name)
                  }
                }}
                className={formErrors[spec.slug] ? "border-red-500" : ""}
              />
              {fieldValue && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <span>{fieldValue}</span>
                </div>
              )}
            </div>
          )

        default:
          return (
            <Input
              id={fieldId}
              value={fieldValue}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className={formErrors[spec.slug] ? "border-red-500" : ""}
            />
          )
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={fieldId} className="text-sm font-medium">
            {spec.name}
          </Label>
          {spec.isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        {renderField()}
        {formErrors[spec.slug] && <p className="text-sm text-red-500">{formErrors[spec.slug]}</p>}
      </div>
    )
  }

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {}

    // Validate required fields
    stations.forEach((station) => {
      station.specifications?.forEach((spec) => {
        if (spec.isRequired && !formData[spec.slug]) {
          errors[spec.slug] = `${spec.name} is required`
        }
      })
    })

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setIsSaving(true)
      console.log("Form submitted with data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Specifications saved successfully!")
    } catch (err) {
      console.error("Failed to save specifications:", err)
      setError("Failed to save specifications. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleItemClick = (item: any, type: "specification" | "technical" | "flowchart" | "documentation") => {
    setSelectedItem(item)
    setModalType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setModalType(null)
    setIsModalOpen(false)
  }

  const handleSectionClick = (section: "specifications" | "technical" | "flowcharts" | "documentation") => {
    setActiveSection(activeSection === section ? null : section)
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
      <CardContent className="mt-5">
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
                      {station.addStation === "yes" && (
                        <Badge className="bg-green-100 text-green-800">Can Add Station</Badge>
                      )}
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
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(station.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated: {formatDate(station.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Associated MPI Information */}
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
                            Effective Date: {formatDate(station.mpi.effectiveDate)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Created: {formatDate(station.mpi.createdAt)}</span>
                            <span>Updated: {formatDate(station.mpi.updatedAt)}</span>
                          </div>
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

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card
                  className={`cursor-pointer transition-colors ${
                    activeSection === "specifications" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSectionClick("specifications")}
                >
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
                <Card
                  className={`cursor-pointer transition-colors ${
                    activeSection === "technical" ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSectionClick("technical")}
                >
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
                <Card
                  className={`cursor-pointer transition-colors ${
                    activeSection === "flowcharts" ? "bg-purple-50 border-purple-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSectionClick("flowcharts")}
                >
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
                <Card
                  className={`cursor-pointer transition-colors ${
                    activeSection === "documentation" ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSectionClick("documentation")}
                >
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

              {/* Conditional Sections */}
              {activeSection === "specifications" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Station Specifications Form
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fill out the required specifications for this station
                    </p>
                  </CardHeader>
                  <CardContent>
                    {station.specifications && station.specifications.length > 0 ? (
                      <>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {station.specifications.map((spec) => (
                              <div key={spec.id}>{renderSpecificationField(spec)}</div>
                            ))}
                          </div>
                        </ScrollArea>

                        <Separator className="my-6" />

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setFormData({})}>
                            Clear Form
                          </Button>
                          <Button onClick={handleFormSubmit} disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Specifications
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No specifications found</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === "technical" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-5 w-5" />
                        Technical Specifications ({station.technicalSpecifications?.length || 0})
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {station.technicalSpecifications && station.technicalSpecifications.length > 0 ? (
                      <ScrollArea className="h-64 pr-4">
                        <div className="space-y-3">
                          {station.technicalSpecifications.map((tech) => (
                            <div
                              key={tech.id}
                              className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleItemClick(tech, "technical")
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{tech.name}</p>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {tech.value} {tech.unit && `(${tech.unit})`}
                                  </p>
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    <div>Created: {formatDate(tech.createdAt)}</div>
                                    <div>Updated: {formatDate(tech.updatedAt)}</div>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <Gauge className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No technical specifications found</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === "flowcharts" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Flow Charts ({station.flowCharts?.length || 0})
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {station.flowCharts && station.flowCharts.length > 0 ? (
                      <ScrollArea className="h-64 pr-4">
                        <div className="space-y-3">
                          {station.flowCharts.map((chart) => (
                            <div
                              key={chart.id}
                              className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors border border-transparent hover:border-purple-200"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleItemClick(chart, "flowchart")
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{chart.content}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Hash className="h-3 w-3 mr-1" />
                                      {chart.id.slice(-8)}
                                    </Badge>
                                    {chart.mpiId && (
                                      <Badge variant="outline" className="text-xs">
                                        MPI Linked
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    <div>Created: {formatDate(chart.createdAt)}</div>
                                    <div>Updated: {formatDate(chart.updatedAt)}</div>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No flow charts found</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === "documentation" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Documentation ({station.documentation?.length || 0})
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {station.documentation && station.documentation.length > 0 ? (
                      <ScrollArea className="h-64 pr-4">
                        <div className="space-y-3">
                          {station.documentation.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors border border-transparent hover:border-orange-200"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleItemClick(doc, "documentation")
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{doc.content}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Hash className="h-3 w-3 mr-1" />
                                      {doc.id.slice(-8)}
                                    </Badge>
                                    {doc.mpiId && (
                                      <Badge variant="outline" className="text-xs">
                                        MPI Linked
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    <div>Created: {formatDate(doc.createdAt)}</div>
                                    <div>Updated: {formatDate(doc.updatedAt)}</div>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No documentation found</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
        {/* Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {modalType === "specification" && <FileText className="h-5 w-5" />}
                {modalType === "technical" && <Gauge className="h-5 w-5" />}
                {modalType === "flowchart" && <Wrench className="h-5 w-5" />}
                {modalType === "documentation" && <BookOpen className="h-5 w-5" />}
                {modalType === "specification" && "Specification Details"}
                {modalType === "technical" && "Technical Specification Details"}
                {modalType === "flowchart" && "Flow Chart Details"}
                {modalType === "documentation" && "Documentation Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                {modalType === "specification" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Slug</Label>
                        <p className="text-sm text-muted-foreground font-mono">{selectedItem.slug}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Badge className={`text-xs ${getSpecificationTypeColor(selectedItem.type)}`}>
                          {selectedItem.type}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="flex gap-2">
                          {selectedItem.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {selectedItem.isActive && (
                            <Badge className="text-xs bg-green-100 text-green-800">Active</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedItem.suggestions && selectedItem.suggestions.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Available Options</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedItem.suggestions.map((suggestion: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p>{formatDate(selectedItem.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Updated</Label>
                        <p>{formatDate(selectedItem.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {modalType === "technical" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Value</Label>
                        <p className="text-sm text-muted-foreground font-mono">
                          {selectedItem.value} {selectedItem.unit && `(${selectedItem.unit})`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p>{formatDate(selectedItem.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Updated</Label>
                        <p>{formatDate(selectedItem.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {modalType === "flowchart" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Content</Label>
                      <div className="mt-2 p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm">{selectedItem.content}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p>{formatDate(selectedItem.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Updated</Label>
                        <p>{formatDate(selectedItem.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {modalType === "documentation" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Content</Label>
                      <div className="mt-2 p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm">{selectedItem.content}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p>{formatDate(selectedItem.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Updated</Label>
                        <p>{formatDate(selectedItem.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
