"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Save, RotateCcw, ArrowLeft } from "lucide-react"
import { stationApi } from "@/lib/stations"
import { CreateStationDto } from "@/types/station"

export default function CreateStationForm() {
  const [formData, setFormData] = useState<CreateStationDto>({
    stationId: "",
    stationName: "",
    labelLocation: "",
    programName: "",
    labelFormat: "",
    labelRange: "",
    boardDirectionFirstSide: "",
    boardDirectionSecondSide: "",
    pcbBoardSide: "",
    stencilName: "",
    stencilRevision: "",
    pwb: "",
    pwbRevision: "",
    stencilThickness: "",
    printingMaterial: "",
    solderPasteType: "",
    squeegeeType: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await stationApi.create(formData)
      setSuccess("Station created successfully!")
      setTimeout(() => {
        router.push("/dashboard/stations")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create station")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      stationId: "",
      stationName: "",
      labelLocation: "",
      programName: "",
      labelFormat: "",
      labelRange: "",
      boardDirectionFirstSide: "",
      boardDirectionSecondSide: "",
      pcbBoardSide: "",
      stencilName: "",
      stencilRevision: "",
      pwb: "",
      pwbRevision: "",
      stencilThickness: "",
      printingMaterial: "",
      solderPasteType: "",
      squeegeeType: "",
    })
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Create New Station</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Factory className="h-5 w-5" />
            Station Information
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
                    value={formData.labelLocation}
                    onValueChange={(value) => setFormData({ ...formData, labelLocation: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Top">Top</SelectItem>
                      <SelectItem value="Bottom">Bottom</SelectItem>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Right">Right</SelectItem>
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
            </div>

            {/* Program and Board Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Program & Board Configuration</h3>
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
                    value={formData.pcbBoardSide}
                    onValueChange={(value) => setFormData({ ...formData, pcbBoardSide: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Top">Top</SelectItem>
                      <SelectItem value="Bottom">Bottom</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boardDirectionFirstSide" className="text-sm font-medium">
                    Board Direction (First Side)
                  </Label>
                  <Select
                    value={formData.boardDirectionFirstSide}
                    onValueChange={(value) => setFormData({ ...formData, boardDirectionFirstSide: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Left to Right">Left to Right</SelectItem>
                      <SelectItem value="Right to Left">Right to Left</SelectItem>
                      <SelectItem value="Front to Back">Front to Back</SelectItem>
                      <SelectItem value="Back to Front">Back to Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boardDirectionSecondSide" className="text-sm font-medium">
                    Board Direction (Second Side)
                  </Label>
                  <Select
                    value={formData.boardDirectionSecondSide}
                    onValueChange={(value) => setFormData({ ...formData, boardDirectionSecondSide: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Left to Right">Left to Right</SelectItem>
                      <SelectItem value="Right to Left">Right to Left</SelectItem>
                      <SelectItem value="Front to Back">Front to Back</SelectItem>
                      <SelectItem value="Back to Front">Back to Front</SelectItem>
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
            </div>

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
