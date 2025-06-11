"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Save, RotateCcw, ArrowLeft } from "lucide-react"
import { stationApi } from "@/lib/stations"

export default function CreateMpiForm() {
  const [formData, setFormData] = useState<CreateMpiDto>({
    stationName: "",
    revision: "",
    effectiveDate: "",
    purpose: "",
    scope: "",
    equipment: "",
    materials: "",
    responsibilities: "",
    procedure: "",
    safety: "",
    processControl: "",
  })
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationList = await stationApi.findAll()
        setStations(stationList)
      } catch (err) {
        console.error("Failed to fetch stations:", err)
      }
    }
    fetchStations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await mpiApi.create(formData)
      setSuccess("MPI created successfully!")
      setTimeout(() => {
        router.push("/dashboard/mpi")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create MPI")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      stationName: "",
      revision: "",
      effectiveDate: "",
      purpose: "",
      scope: "",
      equipment: "",
      materials: "",
      responsibilities: "",
      procedure: "",
      safety: "",
      processControl: "",
    })
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Create New MPI</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
            <Settings className="h-5 w-5" />
            Manufacturing Process Instruction
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stationName" className="text-sm font-medium">
                    Station Name *
                  </Label>
                  <Select
                    value={formData.stationName}
                    onValueChange={(value) => setFormData({ ...formData, stationName: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.stationName}>
                          {station.stationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revision" className="text-sm font-medium">
                    Revision
                  </Label>
                  <Input
                    id="revision"
                    type="text"
                    value={formData.revision}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    placeholder="e.g., Rev. B"
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate" className="text-sm font-medium">
                    Effective Date
                  </Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Purpose and Scope */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Purpose & Scope</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm font-medium">
                    Purpose
                  </Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="The purpose of this document is to provide..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scope" className="text-sm font-medium">
                    Scope
                  </Label>
                  <Textarea
                    id="scope"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    placeholder="This procedure applies to..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Equipment and Materials */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Equipment & Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment" className="text-sm font-medium">
                    Equipment
                  </Label>
                  <Textarea
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    placeholder="1. Equipment item 1&#10;2. Equipment item 2&#10;3. Equipment item 3"
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials" className="text-sm font-medium">
                    Materials
                  </Label>
                  <Textarea
                    id="materials"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="1. Material item 1&#10;2. Material item 2&#10;3. Material item 3"
                    rows={5}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Responsibilities</h3>
              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="text-sm font-medium">
                  Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="1. Engineering: Responsibility description&#10;2. Operators: Responsibility description&#10;3. Line Supervisors: Responsibility description"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Procedure */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Procedure</h3>
              <div className="space-y-2">
                <Label htmlFor="procedure" className="text-sm font-medium">
                  Procedure Steps
                </Label>
                <Textarea
                  id="procedure"
                  value={formData.procedure}
                  onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                  placeholder="1. Step 1 description&#10;2. Step 2 description&#10;3. Step 3 description"
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Safety and Process Control */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Safety & Process Control</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="safety" className="text-sm font-medium">
                    Safety
                  </Label>
                  <Textarea
                    id="safety"
                    value={formData.safety}
                    onChange={(e) => setFormData({ ...formData, safety: e.target.value })}
                    placeholder="1. Safety requirement 1&#10;2. Safety requirement 2&#10;3. Safety requirement 3"
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processControl" className="text-sm font-medium">
                    Process Control
                  </Label>
                  <Textarea
                    id="processControl"
                    value={formData.processControl}
                    onChange={(e) => setFormData({ ...formData, processControl: e.target.value })}
                    placeholder="1. Control measure 1&#10;2. Control measure 2&#10;3. Control measure 3"
                    rows={5}
                    className="resize-none"
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
                {isLoading ? "Creating..." : "Create MPI"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/mpi")}
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
