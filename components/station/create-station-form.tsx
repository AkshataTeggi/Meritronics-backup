


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw, ArrowLeft, Plus, X } from "lucide-react"
import { FileUploadField } from "./file-upload-field"
import { documentationApi } from "@/lib/documentation"
import { flowChartsApi } from "@/lib/flow-chart"
import { specificationsApi } from "@/lib/specifications"
import { stationApi } from "@/lib/stations"
import { technicalSpecificationsApi } from "@/lib/technical-specifications"
import type {
  CreateStationDto,
  CreateSpecificationDto,
  SpecificationType,
  CreateTechnicalSpecificationDto,
  CreateDocumentationDto,
  CreateFlowChartDto,
} from "@/types/station"

export default function CreateStationFormWithSpecs() {
  const [formData, setFormData] = useState<CreateStationDto>({
    stationId: "",
    stationName: "",
    status: "active",
    stationCode: "", // Changed from staticCode
    description: "",
    location: "",
    operator: "",
    addStation: "yes",
    specifications: [],
  })

  // State for specifications
  const [specifications, setSpecifications] = useState<CreateSpecificationDto[]>([])
  const [availableTypes, setAvailableTypes] = useState<SpecificationType[]>([])

  // State for technical specifications
  const [technicalSpecs, setTechnicalSpecs] = useState<CreateTechnicalSpecificationDto[]>([])

  // State for documentation
  const [documentations, setDocumentations] = useState<Array<{ content: string; files: File[] }>>([])

  // State for flow charts
  const [flowCharts, setFlowCharts] = useState<Array<{ content: string; files: File[] }>>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Fetch available specification types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await specificationsApi.getTypes()
        setAvailableTypes(types)
        console.log("Fetched specification types:", types)
      } catch (err) {
        console.error("Failed to fetch specification types:", err)
        // Don't set default types, just show the error
        setError("Failed to load specification types. Please try again later.")
      }
    }
    fetchTypes()
  }, [])

  // Specification handlers
  const addSpecification = () => {
    const newSpec: CreateSpecificationDto = {
      name: "",
      slug: "",
      type: "TEXT",
      isRequired: false,
      isActive: true,
      suggestions: [],
      stationId: formData.stationId,
    }
    setSpecifications([...specifications, newSpec])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const updateSpecification = (index: number, field: keyof CreateSpecificationDto, value: any) => {
    const updated = [...specifications]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-generate slug from name
    if (field === "name") {
      updated[index].slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    setSpecifications(updated)
  }

  const addSuggestion = (specIndex: number, suggestion: string) => {
    if (!suggestion.trim()) return

    const updated = [...specifications]
    updated[specIndex].suggestions = [...updated[specIndex].suggestions, suggestion.trim()]
    setSpecifications(updated)
  }

  const removeSuggestion = (specIndex: number, suggestionIndex: number) => {
    const updated = [...specifications]
    updated[specIndex].suggestions = updated[specIndex].suggestions.filter((_, i) => i !== suggestionIndex)
    setSpecifications(updated)
  }

  // Technical specification handlers
  const addTechnicalSpec = () => {
    const newTechSpec: CreateTechnicalSpecificationDto = {
      name: "",
      value: "",
      stationId: formData.stationId,
    }
    setTechnicalSpecs([...technicalSpecs, newTechSpec])
  }

  const removeTechnicalSpec = (index: number) => {
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index))
  }

  const updateTechnicalSpec = (index: number, field: keyof CreateTechnicalSpecificationDto, value: any) => {
    const updated = [...technicalSpecs]
    updated[index] = { ...updated[index], [field]: value }
    setTechnicalSpecs(updated)
  }

  // Documentation handlers
  const addDocumentation = () => {
    setDocumentations([...documentations, { content: "", files: [] }])
  }

  const removeDocumentation = (index: number) => {
    setDocumentations(documentations.filter((_, i) => i !== index))
  }

  const updateDocumentation = (index: number, field: "content" | "files", value: any) => {
    const updated = [...documentations]
    updated[index] = { ...updated[index], [field]: value }
    setDocumentations(updated)
  }

  // Flow chart handlers
  const addFlowChart = () => {
    setFlowCharts([...flowCharts, { content: "", files: [] }])
  }

  const removeFlowChart = (index: number) => {
    setFlowCharts(flowCharts.filter((_, i) => i !== index))
  }

  const updateFlowChart = (index: number, field: "content" | "files", value: any) => {
    const updated = [...flowCharts]
    updated[index] = { ...updated[index], [field]: value }
    setFlowCharts(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate required fields
      if (!formData.stationId || !formData.stationName) {
        throw new Error("Station ID and Station Name are required")
      }

      // Create the station first
      const stationData: CreateStationDto = {
        ...formData,
      }

      console.log("Creating station:", stationData)
      const createdStation = await stationApi.create(stationData)
      console.log("Station created:", createdStation)

      // Create specifications
      const validSpecs = specifications.filter((spec) => spec.name.trim() !== "")
      for (const spec of validSpecs) {
        spec.stationId = createdStation.id
        await specificationsApi.create(spec)
      }

      // Create technical specifications
      const validTechSpecs = technicalSpecs.filter((spec) => spec.name.trim() !== "" && spec.value.trim() !== "")
      for (const techSpec of validTechSpecs) {
        techSpec.stationId = createdStation.id
        await technicalSpecificationsApi.create(techSpec)
      }

      // Create documentation entries
      for (const doc of documentations) {
        if (doc.content.trim() !== "") {
          const docData: CreateDocumentationDto = {
            content: doc.content,
            stationId: createdStation.id,
          }
          await documentationApi.create(docData, doc.files)
        }
      }

      // Create flow chart entries
      for (const chart of flowCharts) {
        if (chart.content.trim() !== "") {
          const chartData: CreateFlowChartDto = {
            content: chart.content,
            stationId: createdStation.id,
          }
          await flowChartsApi.create(chartData, chart.files)
        }
      }

      setSuccess("Station created successfully!")
      setTimeout(() => {
        router.push("/dashboard/stations")
      }, 2000)
    } catch (err) {
      console.error("Station creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create station")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      stationId: "",
      stationName: "",
      status: "active",
      stationCode: "", // Changed from staticCode
      description: "",
      location: "",
      operator: "",
      addStation: "yes",
      specifications: [],
    })
    setSpecifications([])
    setTechnicalSpecs([])
    setDocumentations([])
    setFlowCharts([])
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-6 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Create New Station</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
      </div>

      <Card>
        <CardContent className="mt-5">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="technical">Technical Specs</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="flowcharts">Flow Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Station Details</h3>

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
                      <Label htmlFor="stationName" className="text-sm font-medium">
                        Station Name *
                      </Label>
                      <Input
                        id="stationName"
                        type="text"
                        value={formData.stationName}
                        onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                        placeholder="Enter station name"
                        required
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stationCode" className="text-sm font-medium">
                        Station Code
                      </Label>
                      <Input
                        id="stationCode"
                        type="text"
                        value={formData.stationCode}
                        onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                        placeholder="Enter station code"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
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
                      <Label htmlFor="operator" className="text-sm font-medium">
                        Operator
                      </Label>
                      <Input
                        id="operator"
                        type="text"
                        value={formData.operator}
                        onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                        placeholder="Enter operator name"
                        className="h-9"
                      />
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
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Station Specifications</h3>
                    <Button type="button" onClick={addSpecification} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Specification
                    </Button>
                  </div>

                  {specifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No specifications added yet</p>
                      <Button type="button" onClick={addSpecification} variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Specification
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {specifications.map((spec, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Specification {index + 1}</h4>
                              <Button
                                type="button"
                                onClick={() => removeSpecification(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Name *</Label>
                                <Input
                                  value={spec.name}
                                  onChange={(e) => updateSpecification(index, "name", e.target.value)}
                                  placeholder="Enter specification name"
                                  className="h-9"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Type</Label>
                                <Select
                                  value={spec.type}
                                  onValueChange={(value: SpecificationType) =>
                                    updateSpecification(index, "type", value)
                                  }
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableTypes.length > 0 ? (
                                      availableTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type
                                            .replace(/_/g, " ")
                                            .toLowerCase()
                                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <>
                                        <SelectItem value="TEXT">Text</SelectItem>
                                        <SelectItem value="NUMBER">Number</SelectItem>
                                        <SelectItem value="BOOLEAN_TYPE">Boolean</SelectItem>
                                        <SelectItem value="DATE">Date</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`required-${index}`}
                                    checked={spec.isRequired}
                                    onChange={(e) => updateSpecification(index, "isRequired", e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor={`required-${index}`} className="text-sm">
                                    Required
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`active-${index}`}
                                    checked={spec.isActive}
                                    onChange={(e) => updateSpecification(index, "isActive", e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor={`active-${index}`} className="text-sm">
                                    Active
                                  </Label>
                                </div>
                              </div>
                            </div>

                            {spec.type === "DROPDOWN" && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Options</Label>
                                <div className="space-y-2">
                                  {spec.suggestions.map((suggestion, suggestionIndex) => (
                                    <div key={suggestionIndex} className="flex items-center gap-2">
                                      <Input
                                        value={suggestion}
                                        onChange={(e) => {
                                          const updated = [...specifications]
                                          updated[index].suggestions[suggestionIndex] = e.target.value
                                          setSpecifications(updated)
                                        }}
                                        className="h-9 flex-1"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeSuggestion(index, suggestionIndex)}
                                        variant="ghost"
                                        size="sm"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <div className="flex items-center gap-2">
                                    <Input
                                      placeholder="Add new option"
                                      className="h-9 flex-1"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault()
                                          addSuggestion(index, (e.target as HTMLInputElement).value)
                                          ;(e.target as HTMLInputElement).value = ""
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                        addSuggestion(index, input.value)
                                        input.value = ""
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Technical Specifications</h3>
                    <Button type="button" onClick={addTechnicalSpec} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Technical Spec
                    </Button>
                  </div>

                  {technicalSpecs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No technical specifications added yet</p>
                      <Button type="button" onClick={addTechnicalSpec} variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Technical Spec
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {technicalSpecs.map((techSpec, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Technical Specification {index + 1}</h4>
                              <Button
                                type="button"
                                onClick={() => removeTechnicalSpec(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Name *</Label>
                                <Input
                                  value={techSpec.name}
                                  onChange={(e) => updateTechnicalSpec(index, "name", e.target.value)}
                                  placeholder="Enter specification name (e.g., Speed)"
                                  className="h-9"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Value *</Label>
                                <Input
                                  value={techSpec.value}
                                  onChange={(e) => updateTechnicalSpec(index, "value", e.target.value)}
                                  placeholder="Enter specification value (e.g., 120 mm/s)"
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Documentation</h3>
                    <Button type="button" onClick={addDocumentation} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Documentation
                    </Button>
                  </div>

                  {documentations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No documentation added yet</p>
                      <Button type="button" onClick={addDocumentation} variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Documentation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {documentations.map((doc, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Documentation {index + 1}</h4>
                              <Button
                                type="button"
                                onClick={() => removeDocumentation(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Description</Label>
                                <Textarea
                                  value={doc.content}
                                  onChange={(e) => updateDocumentation(index, "content", e.target.value)}
                                  placeholder="Enter documentation description"
                                  rows={3}
                                  className="resize-none"
                                />
                              </div>

                              <FileUploadField
                                id={`documentation-files-${index}`}
                                label="Documentation Files"
                                multiple={true}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                onChange={(files) => updateDocumentation(index, "files", files)}
                                value={doc.files}
                                helpText="Upload documentation files (PDF, Word, Excel, Images)"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="flowcharts" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Flow Charts</h3>
                    <Button type="button" onClick={addFlowChart} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Flow Chart
                    </Button>
                  </div>

                  {flowCharts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No flow charts added yet</p>
                      <Button type="button" onClick={addFlowChart} variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Flow Chart
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {flowCharts.map((chart, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Flow Chart {index + 1}</h4>
                              <Button
                                type="button"
                                onClick={() => removeFlowChart(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Description</Label>
                                <Textarea
                                  value={chart.content}
                                  onChange={(e) => updateFlowChart(index, "content", e.target.value)}
                                  placeholder="Enter flow chart description"
                                  rows={3}
                                  className="resize-none"
                                />
                              </div>

                              <FileUploadField
                                id={`flowchart-files-${index}`}
                                label="Flow Chart Files"
                                multiple={true}
                                accept=".pdf,.png,.jpg,.jpeg,.svg,.drawio"
                                onChange={(files) => updateFlowChart(index, "files", files)}
                                value={chart.files}
                                helpText="Upload flow chart images or diagrams"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center gap-3 pt-6 border-t">
              {/* Left side - Cancel button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/stations")}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              {/* Right side - Save and Reset buttons */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Station"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
