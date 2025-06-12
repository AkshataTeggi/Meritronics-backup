"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Save, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { stationApi } from "@/lib/stations"
import { Station, UpdateStationDto, LabelLocation, PcbBoardSide, BoardDirection } from "@/types/station"

interface EditStationFormProps {
  stationId: string
}

export default function EditStationForm({ stationId }: EditStationFormProps) {
  const [station, setStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState<UpdateStationDto>({
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const stationData = await stationApi.findOne(stationId)
        setStation(stationData)
        setFormData({
          stationId: stationData.stationId,
          stationName: stationData.stationName,
          labelLocation: stationData.labelLocation || undefined,
          programName: stationData.programName || "",
          labelFormat: stationData.labelFormat || "",
          labelRange: stationData.labelRange || "",
          boardDirectionFirstSide: stationData.boardDirectionFirstSide || undefined,
          boardDirectionSecondSide: stationData.boardDirectionSecondSide || undefined,
          pcbBoardSide: stationData.pcbBoardSide || undefined,
          stencilName: stationData.stencilName || "",
          stencilRevision: stationData.stencilRevision || "",
          pwb: stationData.pwb || "",
          pwbRevision: stationData.pwbRevision || "",
          stencilThickness: stationData.stencilThickness || "",
          printingMaterial: stationData.printingMaterial || "",
          solderPasteType: stationData.solderPasteType || "",
          squeegeeType: stationData.squeegeeType || "",
          documentation: stationData.documentation || "",
          flowCharts: stationData.flowCharts || "",
          specifications: stationData.specifications || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch station")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStation()
  }, [stationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "" && value !== undefined),
      ) as UpdateStationDto

      console.log("Updating station data:", cleanedData)
      await stationApi.update(stationId, cleanedData)
      setSuccess("Station updated successfully!")
      setTimeout(() => {
        router.push("/dashboard/stations")
      }, 2000)
    } catch (err) {
      console.error("Station update error:", err)
      setError(err instanceof Error ? err.message : "Failed to update station")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading station...</p>
        </div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Station not found</p>
        <Button onClick={() => router.push("/dashboard/stations")} className="mt-4">
          Back to Stations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit Station</h1>
      </div>

      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Factory className="h-5 w-5" />
            Edit Station: {station.stationName}
          </CardTitle>
        </CardHeader>
        <CardContent>
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

              <TabsContent value="basic" className="space-y-4">
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
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Technical Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="labelLocation" className="text-sm font-medium">
                      Label Location
                    </Label>
                    <Select
                      value={formData.labelLocation || ""}
                      onValueChange={(value) => setFormData({ ...formData, labelLocation: value as LabelLocation })}
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
                      onChange={(e) => setFormData({ ...formData, labelFormat: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, labelRange: e.target.value })}
                      placeholder="e.g., 001-200"
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="programName" className="text-sm font-medium">
                      Program Name
                    </Label>
                    <Input
                      id="programName"
                      type="text"
                      value={formData.programName}
                      onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
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
                      onValueChange={(value) => setFormData({ ...formData, pcbBoardSide: value as PcbBoardSide })}
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
                        setFormData({ ...formData, boardDirectionFirstSide: value as BoardDirection })
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
                        setFormData({ ...formData, boardDirectionSecondSide: value as BoardDirection })
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
                      onChange={(e) => setFormData({ ...formData, stencilName: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, stencilRevision: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, pwbRevision: e.target.value })}
                      placeholder="Enter PWB revision"
                      className="h-9"
                    />
                  </div>
                </div>

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
                      onChange={(e) => setFormData({ ...formData, stencilThickness: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, printingMaterial: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, solderPasteType: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, squeegeeType: e.target.value })}
                      placeholder="Enter squeegee type"
                      className="h-9"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Documentation</h3>
                <div className="space-y-2">
                  <Label htmlFor="documentation" className="text-sm font-medium">
                    Documentation Link
                  </Label>
                  <Input
                    id="documentation"
                    type="text"
                    value={formData.documentation}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                    placeholder="Enter documentation link"
                    className="h-9"
                  />
                </div>
              </TabsContent>

              <TabsContent value="flowcharts" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Flow Charts</h3>
                <div className="space-y-2">
                  <Label htmlFor="flowCharts" className="text-sm font-medium">
                    Flow Charts Link
                  </Label>
                  <Input
                    id="flowCharts"
                    type="text"
                    value={formData.flowCharts}
                    onChange={(e) => setFormData({ ...formData, flowCharts: e.target.value })}
                    placeholder="Enter flow charts link"
                    className="h-9"
                  />
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Specifications</h3>
                <div className="space-y-2">
                  <Label htmlFor="specifications" className="text-sm font-medium">
                    Specifications Link
                  </Label>
                  <Input
                    id="specifications"
                    type="text"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    placeholder="Enter specifications link"
                    className="h-9"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Updating..." : "Update Station"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/stations")}
                disabled={isSubmitting}
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
