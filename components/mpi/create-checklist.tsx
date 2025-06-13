"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Factory, Save, CheckSquare, ClipboardList, ListChecks } from "lucide-react"
import { mockChecklists } from "@/lib/mock-data/mpi-data"
import { mockStations } from "@/lib/mock-data/station-data"
import { Checklist } from "@/types/mpi"
import { Station } from "@/types/station"

// Define the steps in the MPI creation process
type Step = "checklist" | "stations" | "details" | "summary"

export default function CreateMpiWithChecklist() {
  const [currentStep, setCurrentStep] = useState<Step>("checklist")
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>("")
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null)
  const [selectedStations, setSelectedStations] = useState<Station[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load mock data with a simulated delay
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))
        console.log("Loading mock data:", { mockChecklists, mockStations })
        setChecklists(mockChecklists)
        setStations(mockStations)
      } catch (err) {
        setError("Failed to fetch data")
        console.error("Error loading mock data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChecklistChange = (checklistId: string) => {
    setSelectedChecklistId(checklistId)
    const checklist = checklists.find((c) => c.id === checklistId)
    setSelectedChecklist(checklist || null)
  }

  const handleStationToggle = (station: Station, checked: boolean) => {
    if (checked) {
      setSelectedStations((prev) => [...prev, station])
    } else {
      setSelectedStations((prev) => prev.filter((s) => s.id !== station.id))
    }
  }

  const handleSelectAllStations = (checked: boolean) => {
    if (checked) {
      setSelectedStations(stations)
    } else {
      setSelectedStations([])
    }
  }

  const generateMPIs = async () => {
    if (!selectedChecklist || selectedStations.length === 0) {
      setError("Please select a checklist and at least one station")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call - in real app this would create MPIs via API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Generating MPIs for:", {
        checklist: selectedChecklist.name,
        stations: selectedStations.map((s) => s.stationName),
      })

      setError("")
      router.push("/dashboard/mpi")
    } catch (err) {
      setError("Failed to generate MPIs")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === "checklist") {
      if (!selectedChecklist) {
        setError("Please select a checklist to continue")
        return
      }
      setError("")
      setCurrentStep("stations")
    } else if (currentStep === "stations") {
      if (selectedStations.length === 0) {
        setError("Please select at least one station to continue")
        return
      }
      setError("")
      setCurrentStep("details")
    } else if (currentStep === "details") {
      setCurrentStep("summary")
    }
  }

  const prevStep = () => {
    if (currentStep === "stations") {
      setCurrentStep("checklist")
    } else if (currentStep === "details") {
      setCurrentStep("stations")
    } else if (currentStep === "summary") {
      setCurrentStep("details")
    }
  }

  // Render the checklist selection step
  const renderChecklistStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Step 1: Select Checklist Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading checklists...</div>
        ) : checklists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No checklists available</div>
        ) : (
          <>
            <Select value={selectedChecklistId} onValueChange={handleChecklistChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a checklist template" />
              </SelectTrigger>
              <SelectContent>
                {checklists.map((checklist) => (
                  <SelectItem key={checklist.id} value={checklist.id}>
                    <div className="flex items-center gap-2">
                      <span>{checklist.name}</span>
                      <Badge variant="outline" className="text-xs">
                        v{checklist.version}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedChecklist && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">{selectedChecklist.name}</h3>
                <p className="text-sm text-blue-700 mb-3">{selectedChecklist.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Version {selectedChecklist.version}</Badge>
                  <Badge variant="default">{selectedChecklist.items.length} items</Badge>
                  <Badge variant={selectedChecklist.isActive ? "default" : "secondary"}>
                    {selectedChecklist.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {selectedChecklist.items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Checklist Items:</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {selectedChecklist.items.slice(0, 3).map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" />
                          {item.description}
                        </li>
                      ))}
                      {selectedChecklist.items.length > 3 && (
                        <li className="text-blue-600">+ {selectedChecklist.items.length - 3} more items</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <Button onClick={nextStep} disabled={!selectedChecklist || isLoading}>
          Next: Select Stations
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )

  // Render the station selection step
  const renderStationsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Step 2: Select Stations ({selectedStations.length}/{stations.length})
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={selectedStations.length === stations.length} onCheckedChange={handleSelectAllStations} />
            <span className="text-sm">Select All</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading stations...</div>
          ) : stations.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No stations available</div>
          ) : (
            stations.map((station) => (
              <div key={station.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={selectedStations.some((s) => s.id === station.id)}
                  onCheckedChange={(checked) => handleStationToggle(station, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{station.stationName}</span>
                    <Badge variant="outline" className="text-xs">
                      {station.stationId}
                    </Badge>
                  </div>
                  {station.description && <p className="text-sm text-gray-600 mb-2">{station.description}</p>}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {station.status}
                    </Badge>
                    {station.location && (
                      <Badge variant="outline" className="text-xs">
                        {station.location}
                      </Badge>
                    )}
                    {station.operator && (
                      <Badge variant="outline" className="text-xs">
                        {station.operator}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Checklist
        </Button>
        <Button onClick={nextStep} disabled={selectedStations.length === 0 || isLoading}>
          Next: View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )

  // Render the station details step
  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Step 3: Selected Stations Details ({selectedStations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedStations.map((station) => (
            <div key={station.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Factory className="h-4 w-4" />
                <span className="font-medium">{station.stationName}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>ID:</strong> {station.stationId}
                </div>
                {station.stationCode && (
                  <div>
                    <strong>Code:</strong> {station.stationCode}
                  </div>
                )}
                {station.description && (
                  <div>
                    <strong>Description:</strong> {station.description}
                  </div>
                )}
                {station.location && (
                  <div>
                    <strong>Location:</strong> {station.location}
                  </div>
                )}
                {station.operator && (
                  <div>
                    <strong>Operator:</strong> {station.operator}
                  </div>
                )}
                <div>
                  <strong>Status:</strong>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {station.status}
                  </Badge>
                </div>
                {station.specifications && station.specifications.length > 0 && (
                  <div>
                    <strong>Specifications:</strong> {station.specifications.length} items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
        <Button onClick={nextStep}>
          Next: Summary
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )

  // Render the summary step
  const renderSummaryStep = () => (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">Step 4: MPI Generation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-green-700 mb-4">
          <p className="mb-2">
            <strong>{selectedStations.length} MPIs</strong> will be generated using the{" "}
            <strong>"{selectedChecklist?.name}"</strong> checklist template.
          </p>
          <p className="text-sm mb-4">
            Each MPI will include all {selectedChecklist?.items.length} checklist items customized for the specific
            station requirements.
          </p>

          <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
            <h3 className="font-medium text-green-800 mb-2">Checklist: {selectedChecklist?.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-5 w-5 text-green-700" />
              <span className="text-green-700">{selectedChecklist?.items.length} items to be included</span>
            </div>

            <h3 className="font-medium text-green-800 mb-2">Selected Stations:</h3>
            <ul className="space-y-1">
              {selectedStations.map((station) => (
                <li key={station.id} className="flex items-center gap-2 text-green-700">
                  <Factory className="h-4 w-4" />
                  {station.stationName} ({station.stationId})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button onClick={generateMPIs} disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-full">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : `Generate ${selectedStations.length} MPIs`}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold text-primary">Create MPI with Checklist</h1>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full flex items-center">
          <div className={`h-2 w-1/4 ${currentStep === "checklist" ? "bg-primary" : "bg-primary"}`}></div>
          <div
            className={`h-2 w-1/4 ${currentStep === "stations" || currentStep === "details" || currentStep === "summary" ? "bg-primary" : "bg-gray-200"}`}
          ></div>
          <div
            className={`h-2 w-1/4 ${currentStep === "details" || currentStep === "summary" ? "bg-primary" : "bg-gray-200"}`}
          ></div>
          <div className={`h-2 w-1/4 ${currentStep === "summary" ? "bg-primary" : "bg-gray-200"}`}></div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {/* Current Step */}
      {currentStep === "checklist" && renderChecklistStep()}
      {currentStep === "stations" && renderStationsStep()}
      {currentStep === "details" && renderDetailsStep()}
      {currentStep === "summary" && renderSummaryStep()}
    </div>
  )
}
