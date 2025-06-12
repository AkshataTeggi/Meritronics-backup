"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw, ArrowLeft, FileText, GitBranch, Settings, Upload, X, File } from "lucide-react"
import { stationApi } from "@/lib/stations"
import { CreateStationDto, LabelLocation, PcbBoardSide, BoardDirection } from "@/types/station"

export default function CreateStationForm() {
  const [formData, setFormData] = useState<CreateStationDto>({
    stationId: "",
    stationName: "",
    labelLocation: undefined,
    programName: "",
    labelFormat: "",
    labelRange: "",
    boardDirectionFirstSide: undefined,
    boardDirectionSecondSide: undefined,
    pcbBoardSide: undefined,
    stencilName: "",
    stencilRevision: "",
    pwb: "",
    pwbRevision: "",
    stencilThickness: "",
    printingMaterial: "",
    solderPasteType: "",
    squeegeeType: "",
    documentation: "",
    flowCharts: "",
    specifications: "",
  })

  // File upload states
  const [documentationFiles, setDocumentationFiles] = useState<File[]>([])
  const [flowChartFiles, setFlowChartFiles] = useState<File[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleFileUpload = (files: FileList | null, type: "documentation" | "flowcharts") => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      // Accept common document and image formats
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]

      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    if (type === "documentation") {
      setDocumentationFiles((prev) => [...prev, ...validFiles])
    } else {
      setFlowChartFiles((prev) => [...prev, ...validFiles])
    }
  }

  const removeFile = (index: number, type: "documentation" | "flowcharts") => {
    if (type === "documentation") {
      setDocumentationFiles((prev) => prev.filter((_, i) => i !== index))
    } else {
      setFlowChartFiles((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // In a real implementation, you would upload files to a storage service
      // and get URLs back to store in the database
      const documentationFileNames = documentationFiles.map((f) => f.name).join(", ")
      const flowChartFileNames = flowChartFiles.map((f) => f.name).join(", ")

      // Add file information to the form data
      const dataWithFiles = {
        ...formData,
        documentation:
          formData.documentation + (documentationFileNames ? `\n\nUploaded files: ${documentationFileNames}` : ""),
        flowCharts: formData.flowCharts + (flowChartFileNames ? `\n\nUploaded files: ${flowChartFileNames}` : ""),
      }

      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(dataWithFiles).filter(([_, value]) => value !== "" && value !== undefined),
      ) as CreateStationDto

      console.log("Submitting station data:", cleanedData)
      await stationApi.create(cleanedData)
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
      labelLocation: undefined,
      programName: "",
      labelFormat: "",
      labelRange: "",
      boardDirectionFirstSide: undefined,
      boardDirectionSecondSide: undefined,
      pcbBoardSide: undefined,
      stencilName: "",
      stencilRevision: "",
      pwb: "",
      pwbRevision: "",
      stencilThickness: "",
      printingMaterial: "",
      solderPasteType: "",
      squeegeeType: "",
      documentation: "",
      flowCharts: "",
      specifications: "",
    })
    setDocumentationFiles([])
    setFlowChartFiles([])
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
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="flowcharts">Flow Charts</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stationId" className="text-sm font-medium">
                        Station ID *
                      </Label>
                      <Input
                        id="stationId"
                        type="text"
                        value={formData.stationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stationId: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stationName: e.target.value,
                          })
                        }
                        placeholder="Enter station name"
                        required
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Label Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Label Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="labelLocation" className="text-sm font-medium">
                        Label Location
                      </Label>
                      <Select
                        value={formData.labelLocation || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            labelLocation: value as LabelLocation,
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOP">Top</SelectItem>
                          <SelectItem value="BOTTOM">Bottom</SelectItem>
                          <SelectItem value="LEFT">Left</SelectItem>
                          <SelectItem value="RIGHT">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="labelFormat" className="text-sm font-medium">
                        Label Format
                      </Label>
                      <Input
                        id="labelFormat"
                        type="text"
                        value={formData.labelFormat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            labelFormat: e.target.value,
                          })
                        }
                        placeholder="e.g., QR-2x2"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="labelRange" className="text-sm font-medium">
                        Label Range
                      </Label>
                      <Input
                        id="labelRange"
                        type="text"
                        value={formData.labelRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            labelRange: e.target.value,
                          })
                        }
                        placeholder="e.g., 001-200"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                {/* Program and Board Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Program & Board Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="programName" className="text-sm font-medium">
                        Program Name
                      </Label>
                      <Input
                        id="programName"
                        type="text"
                        value={formData.programName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programName: e.target.value,
                          })
                        }
                        placeholder="Enter program name"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pcbBoardSide" className="text-sm font-medium">
                        PCB Board Side
                      </Label>
                      <Select
                        value={formData.pcbBoardSide || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            pcbBoardSide: value as PcbBoardSide,
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOP">Top</SelectItem>
                          <SelectItem value="BOTTOM">Bottom</SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boardDirectionFirstSide" className="text-sm font-medium">
                        Board Direction (First Side)
                      </Label>
                      <Select
                        value={formData.boardDirectionFirstSide || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            boardDirectionFirstSide: value as BoardDirection,
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEFT_TO_RIGHT">Left to Right</SelectItem>
                          <SelectItem value="RIGHT_TO_LEFT">Right to Left</SelectItem>
                          <SelectItem value="FRONT_TO_BACK">Front to Back</SelectItem>
                          <SelectItem value="BACK_TO_FRONT">Back to Front</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boardDirectionSecondSide" className="text-sm font-medium">
                        Board Direction (Second Side)
                      </Label>
                      <Select
                        value={formData.boardDirectionSecondSide || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            boardDirectionSecondSide: value as BoardDirection,
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEFT_TO_RIGHT">Left to Right</SelectItem>
                          <SelectItem value="RIGHT_TO_LEFT">Right to Left</SelectItem>
                          <SelectItem value="FRONT_TO_BACK">Front to Back</SelectItem>
                          <SelectItem value="BACK_TO_FRONT">Back to Front</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Stencil and PWB Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Stencil & PWB Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stencilName" className="text-sm font-medium">
                        Stencil Name
                      </Label>
                      <Input
                        id="stencilName"
                        type="text"
                        value={formData.stencilName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stencilName: e.target.value,
                          })
                        }
                        placeholder="Enter stencil name"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stencilRevision" className="text-sm font-medium">
                        Stencil Revision
                      </Label>
                      <Input
                        id="stencilRevision"
                        type="text"
                        value={formData.stencilRevision}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stencilRevision: e.target.value,
                          })
                        }
                        placeholder="Enter stencil revision"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pwb" className="text-sm font-medium">
                        PWB
                      </Label>
                      <Input
                        id="pwb"
                        type="text"
                        value={formData.pwb}
                        onChange={(e) => setFormData({ ...formData, pwb: e.target.value })}
                        placeholder="Enter PWB"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pwbRevision" className="text-sm font-medium">
                        PWB Revision
                      </Label>
                      <Input
                        id="pwbRevision"
                        type="text"
                        value={formData.pwbRevision}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pwbRevision: e.target.value,
                          })
                        }
                        placeholder="Enter PWB revision"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Materials and Equipment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Materials & Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stencilThickness" className="text-sm font-medium">
                        Stencil Thickness
                      </Label>
                      <Input
                        id="stencilThickness"
                        type="text"
                        value={formData.stencilThickness}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stencilThickness: e.target.value,
                          })
                        }
                        placeholder="Enter thickness"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="printingMaterial" className="text-sm font-medium">
                        Printing Material
                      </Label>
                      <Input
                        id="printingMaterial"
                        type="text"
                        value={formData.printingMaterial}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            printingMaterial: e.target.value,
                          })
                        }
                        placeholder="Enter printing material"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solderPasteType" className="text-sm font-medium">
                        Solder Paste Type
                      </Label>
                      <Input
                        id="solderPasteType"
                        type="text"
                        value={formData.solderPasteType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            solderPasteType: e.target.value,
                          })
                        }
                        placeholder="Enter solder paste type"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="squeegeeType" className="text-sm font-medium">
                        Squeegee Type
                      </Label>
                      <Input
                        id="squeegeeType"
                        type="text"
                        value={formData.squeegeeType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            squeegeeType: e.target.value,
                          })
                        }
                        placeholder="Enter squeegee type"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Station Documentation
                  </h3>

                  {/* Text Documentation */}
                  <div className="space-y-2">
                    <Label htmlFor="documentation" className="text-sm font-medium">
                      Documentation Text
                    </Label>
                    <Textarea
                      id="documentation"
                      value={formData.documentation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documentation: e.target.value,
                        })
                      }
                      placeholder="Enter detailed documentation for this station including:
• Operating procedures
• Maintenance instructions
• Safety guidelines
• Training materials
• Standard operating procedures (SOPs)"
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Upload Documentation Files</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Label htmlFor="documentation-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                              Drop files here or click to upload
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PDF, DOC, DOCX, TXT, XLS, XLSX, JPG, PNG, GIF, SVG up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="documentation-upload"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.svg"
                            onChange={(e) => handleFileUpload(e.target.files, "documentation")}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {documentationFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Uploaded Files</Label>
                        <div className="space-y-2">
                          {documentationFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <File className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, "documentation")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="flowcharts" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Process Flow Charts
                  </h3>

                  {/* Text Flow Charts */}
                  <div className="space-y-2">
                    <Label htmlFor="flowCharts" className="text-sm font-medium">
                      Flow Charts Description
                    </Label>
                    <Textarea
                      id="flowCharts"
                      value={formData.flowCharts}
                      onChange={(e) => setFormData({ ...formData, flowCharts: e.target.value })}
                      placeholder="Describe the process flow charts including:
• Process flow diagrams
• Decision trees
• Workflow sequences
• Quality control checkpoints
• Error handling procedures"
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Upload Flow Chart Files</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Label htmlFor="flowchart-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                              Drop flow chart files here or click to upload
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PDF, DOC, DOCX, JPG, PNG, GIF, SVG up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="flowchart-upload"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.svg"
                            onChange={(e) => handleFileUpload(e.target.files, "flowcharts")}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {flowChartFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Uploaded Files</Label>
                        <div className="space-y-2">
                          {flowChartFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <File className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, "flowcharts")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technical Specifications
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="specifications" className="text-sm font-medium">
                      Specifications
                    </Label>
                    <Textarea
                      id="specifications"
                      value={formData.specifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: e.target.value,
                        })
                      }
                      placeholder="Enter detailed technical specifications including:
• Dimensional tolerances
• Quality requirements
• Performance parameters
• Environmental conditions
• Calibration requirements
• Testing procedures
• Acceptance criteria"
                      rows={12}
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Station"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/stations")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
