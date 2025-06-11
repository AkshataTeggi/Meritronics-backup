"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Save, RotateCcw } from "lucide-react"
import { CreateMpiDto } from "@/types/mpi"
import { mpiApi } from "@/lib/mpi"
import { stationApi } from "@/lib/stations"
import { Station } from "@/types/station"

interface CreateMpiFormProps {
  onSuccess?: () => void
}

export default function CreateMpiForm({ onSuccess }: CreateMpiFormProps) {
  const [formData, setFormData] = useState<CreateMpiDto>({
    stationName: "",
    processName: "",
    parameters: {},
    specifications: {},
  })
  const [stations, setStations] = useState<Station[]>([])
  const [parametersText, setParametersText] = useState("")
  const [specificationsText, setSpecificationsText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      // Parse JSON strings for parameters and specifications
      const parameters = parametersText ? JSON.parse(parametersText) : {}
      const specifications = specificationsText ? JSON.parse(specificationsText) : {}

      await mpiApi.create({
        ...formData,
        parameters,
        specifications,
      })

      setSuccess("MPI created successfully!")
      setFormData({
        stationName: "",
        processName: "",
        parameters: {},
        specifications: {},
      })
      setParametersText("")
      setSpecificationsText("")
      onSuccess?.()
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format in parameters or specifications")
      } else {
        setError(err instanceof Error ? err.message : "Failed to create MPI")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      stationName: "",
      processName: "",
      parameters: {},
      specifications: {},
    })
    setParametersText("")
    setSpecificationsText("")
    setError("")
    setSuccess("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
          <Settings className="h-5 w-5" />
          Create New MPI
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem key={station.id} value={station.name}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="processName" className="text-sm font-medium">
                Process Name *
              </Label>
              <Input
                id="processName"
                type="text"
                value={formData.processName}
                onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                placeholder="Enter process name"
                required
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parameters" className="text-sm font-medium">
              Parameters (JSON format)
            </Label>
            <Textarea
              id="parameters"
              value={parametersText}
              onChange={(e) => setParametersText(e.target.value)}
              placeholder='{"temperature": 25, "pressure": 1.2}'
              rows={3}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications" className="text-sm font-medium">
              Specifications (JSON format)
            </Label>
            <Textarea
              id="specifications"
              value={specificationsText}
              onChange={(e) => setSpecificationsText(e.target.value)}
              placeholder='{"tolerance": 0.1, "quality": "high"}'
              rows={3}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create MPI"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
