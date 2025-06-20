"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Settings, ArrowRight } from "lucide-react"
import type { Specification } from "@/types/station"
import { specificationsApi } from "@/lib/specifications"

interface StationSpecificationsStepProps {
  selectedStations: string[]
  onComplete: (data: Record<string, any>) => void
  initialData?: Record<string, any>
}

interface StationWithSpecs {
  stationId: string
  stationName: string
  specifications: Specification[]
}

export function StationSpecificationsStep({
  selectedStations,
  onComplete,
  initialData,
}: StationSpecificationsStepProps) {
  const [stationSpecs, setStationSpecs] = useState<StationWithSpecs[]>([])
  const [specValues, setSpecValues] = useState<Record<string, Record<string, string>>>(initialData || {})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStation, setActiveStation] = useState<string>("")

  useEffect(() => {
    fetchStationSpecifications()
  }, [selectedStations])

  useEffect(() => {
    if (stationSpecs.length > 0 && !activeStation) {
      setActiveStation(stationSpecs[0]?.stationId || "")
    }
  }, [stationSpecs, activeStation])

  const fetchStationSpecifications = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch specifications for each selected station
      const stationPromises = selectedStations.map(async (stationId) => {
        try {
          const specifications = await specificationsApi.findByStation(stationId)
          return {
            stationId,
            stationName: `Station ${stationId.slice(-3)}`, // You might want to fetch actual station names
            specifications,
          }
        } catch (err) {
          console.error(`Error fetching specs for station ${stationId}:`, err)
          return {
            stationId,
            stationName: `Station ${stationId.slice(-3)}`,
            specifications: [],
          }
        }
      })

      const stations = await Promise.all(stationPromises)
      setStationSpecs(stations)

      // Initialize spec values if not already present
      const initialValues: Record<string, Record<string, string>> = {}
      stations.forEach((station) => {
        if (!specValues[station.stationId]) {
          initialValues[station.stationId] = {}

          // Initialize with empty values for each specification
          station.specifications.forEach((spec) => {
            initialValues[station.stationId][spec.id] = ""
          })
        }
      })

      if (Object.keys(initialValues).length > 0) {
        setSpecValues((prev) => ({ ...prev, ...initialValues }))
      }
    } catch (err) {
      console.error("Error fetching station specifications:", err)
      setError("Failed to load station specifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateSpecValue = (stationId: string, specId: string, value: string) => {
    setSpecValues((prev) => ({
      ...prev,
      [stationId]: {
        ...prev[stationId],
        [specId]: value,
      },
    }))
  }

  const renderSpecificationInput = (station: StationWithSpecs, spec: Specification) => {
    const currentValue = specValues[station.stationId]?.[spec.id] || ""

    // Handle different specification types
    switch (spec.type) {
      case "DROPDOWN":
        return (
          <Select value={currentValue} onValueChange={(value) => updateSpecValue(station.stationId, spec.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {spec.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "NUMBER":
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => updateSpecValue(station.stationId, spec.id, e.target.value)}
            placeholder={`Enter ${spec.name.toLowerCase()}`}
            min={spec.minValue}
            max={spec.maxValue}
          />
        )
      case "TEXT":
      default:
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => updateSpecValue(station.stationId, spec.id, e.target.value)}
            placeholder={`Enter ${spec.name.toLowerCase()}`}
          />
        )
    }
  }

  const handleContinue = () => {
    // Validate required specifications
    const missingSpecs: string[] = []

    stationSpecs.forEach((station) => {
      station.specifications.forEach((spec) => {
        if (spec.required && !specValues[station.stationId]?.[spec.id]?.trim()) {
          missingSpecs.push(`${station.stationName}: ${spec.name}`)
        }
      })
    })

    if (missingSpecs.length > 0) {
      setError(`Please fill in the following required specifications: ${missingSpecs.join(", ")}`)
      return
    }

    onComplete(specValues)
  }

  const getCompletedSpecsCount = (stationId: string) => {
    const stationValues = specValues[stationId] || {}
    return Object.values(stationValues).filter((value) => value.trim() !== "").length
  }

  const getTotalSpecsCount = (station: StationWithSpecs) => {
    return station.specifications.length
  }

  const getRequiredSpecsCount = (station: StationWithSpecs) => {
    return station.specifications.filter((spec) => spec.required).length
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Loading station specifications...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stationSpecs.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-medium">No Specifications Found</h3>
              <p className="text-gray-600">No specifications are configured for the selected stations.</p>
            </div>
            <Button onClick={handleContinue} className="flex items-center gap-2">
              Continue to Review
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Station Specifications & Technical Details
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure specifications and technical parameters for each selected station
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeStation} onValueChange={setActiveStation}>
          <TabsList className="grid w-full grid-cols-auto">
            {stationSpecs.map((station) => (
              <TabsTrigger key={station.stationId} value={station.stationId} className="flex items-center gap-2">
                {station.stationName}
                <Badge variant="secondary" className="ml-1">
                  {getCompletedSpecsCount(station.stationId)}/{getTotalSpecsCount(station)}
                </Badge>
                {getRequiredSpecsCount(station) > 0 && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    {getRequiredSpecsCount(station)} req
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {stationSpecs.map((station) => (
            <TabsContent key={station.stationId} value={station.stationId} className="space-y-6">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium">{station.stationName}</h4>
                <p className="text-sm text-gray-600">Station ID: {station.stationId}</p>
                <p className="text-sm text-gray-600">
                  {station.specifications.length} specifications
                  {getRequiredSpecsCount(station) > 0 && ` (${getRequiredSpecsCount(station)} required)`}
                </p>
              </div>

              {/* Specifications Section */}
              {station.specifications.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-lg font-medium">Specifications</h5>
                  <div className="space-y-4">
                    {station.specifications.map((spec) => (
                      <div key={spec.id} className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                          <Label htmlFor={`spec-${spec.id}`} className="flex items-center gap-1">
                            {spec.name}
                            {spec.required && <span className="text-red-500">*</span>}
                          </Label>
                          {spec.description && <p className="text-xs text-gray-500 mt-1">{spec.description}</p>}
                          {spec.type && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {spec.type.toLowerCase()}
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-6">{renderSpecificationInput(station, spec)}</div>
                        <div className="col-span-2">
                          {spec.unit && <div className="text-sm text-gray-600 font-medium">{spec.unit}</div>}
                          {spec.minValue !== undefined && spec.maxValue !== undefined && (
                            <div className="text-xs text-gray-500">
                              Range: {spec.minValue} - {spec.maxValue}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={handleContinue} className="flex items-center gap-2">
            Continue to Review
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
