// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Search, Factory, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
// import { API_BASE_URL } from "@/lib/constants"

// interface Station {
//   id: string
//   stationId: string
//   stationName: string
//   status: string
//   stationCode: string
//   description: string
//   location: string
//   operator: string
//   addStation: string
//   createdAt: string
//   updatedAt: string
//   isDeleted: boolean
// }

// interface StationSelectionStepProps {
//   onComplete: (data: { selectedStations: string[] }) => void
//   selectedStations: string[]
//   isWizardMode?: boolean
// }

// // Station API functions
// const stationApi = {
//   async findAll(): Promise<Station[]> {
//     console.log("Fetching all stations from:", `${API_BASE_URL}/stations`)
//     const response = await fetch(`${API_BASE_URL}/stations`)

//     if (!response.ok) {
//       console.error("Failed to fetch stations:", response.status, response.statusText)
//       throw new Error(`Failed to fetch stations: ${response.statusText}`)
//     }

//     const data = await response.json()
//     console.log("Fetched stations:", data)
//     return data
//   },
// }

// export default function StationSelectionStep({
//   onComplete,
//   selectedStations,
//   isWizardMode = false,
// }: StationSelectionStepProps) {
//   const [stations, setStations] = useState<Station[]>([])
//   const [currentSelectedStations, setCurrentSelectedStations] = useState<string[]>(selectedStations)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchStations()
//   }, [])

//   const fetchStations = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const response = await stationApi.findAll()
//       setStations(response)
//     } catch (err) {
//       console.error("Failed to fetch stations:", err)
//       setError(err instanceof Error ? err.message : "Failed to fetch stations")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleStationToggle = (stationId: string) => {
//     setCurrentSelectedStations((prev) => {
//       if (prev.includes(stationId)) {
//         return prev.filter((id) => id !== stationId)
//       } else {
//         return [...prev, stationId]
//       }
//     })
//   }

//   const handleContinue = () => {
//     onComplete({ selectedStations: currentSelectedStations })
//   }

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "inactive":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "maintenance":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return <CheckCircle className="h-3 w-3" />
//       case "inactive":
//         return <AlertCircle className="h-3 w-3" />
//       default:
//         return <AlertCircle className="h-3 w-3" />
//     }
//   }

//   const filteredStations = stations.filter(
//     (station) =>
//       station.stationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       station.stationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       station.stationId?.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   if (isLoading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="flex items-center justify-center h-32">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span className="ml-2">Loading stations...</span>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="pb-3">
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <Factory className="h-5 w-5" />
//           Station Selection
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Selection Summary */}
//         {/* {currentSelectedStations.length > 0 && (
//           <Alert className="py-2">
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>
//               {currentSelectedStations.length} station{currentSelectedStations.length > 1 ? "s" : ""} selected
//             </AlertDescription>
//           </Alert>
//         )} */}

//         {/* Error Alert */}
//         {error && (
//           <Alert variant="destructive" className="py-2">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               {error}
//               <Button variant="outline" size="sm" className="ml-2" onClick={fetchStations}>
//                 Retry
//               </Button>
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Search Bar */}
//         <div className="flex items-center space-x-2">
//           <Input
//             placeholder="Search stations..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1"
//           />

//         </div>

//         {/* Station List - Simple Grid */}
//         <div className=" gap-3">
//           {filteredStations.map((station) => (
//             <div
//               key={station.id}
//               className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
//                 currentSelectedStations.includes(station.id)
//                   ? "bg-blue-50 border-blue-200 shadow-sm"
//                   : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
//               }`}
//               onClick={() => handleStationToggle(station.id)}
//             >
//               <div className="flex items-start space-x-3">
//                 <Checkbox
//                   id={station.id}
//                   checked={currentSelectedStations.includes(station.id)}
//                   onCheckedChange={() => handleStationToggle(station.id)}
//                   className="mt-1"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <Label htmlFor={station.id} className="font-medium cursor-pointer">
//                       {station.stationName || "Unknown Station"}
//                     </Label>
//                     <Badge
//                       className={`${getStatusColor(station.status || "inactive")} flex items-center gap-1 text-xs`}
//                     >
//                       {getStatusIcon(station.status || "inactive")}
//                       {(station.status || "inactive").charAt(0).toUpperCase() + (station.status || "inactive").slice(1)}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     ID: {station.stationId || "N/A"} • Code: {station.stationCode || "N/A"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredStations.length === 0 && (
//           <div className="text-center py-8 text-muted-foreground">
//             <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
//             <p>No stations found matching your search criteria.</p>
//           </div>
//         )}

//         {/* Action Buttons */}
//         {!isWizardMode && (
//           <div className="flex justify-between items-center pt-4 border-t">
//             <div className="text-sm text-muted-foreground">
//               {currentSelectedStations.length > 0 ? (
//                 <>
//                   {currentSelectedStations.length} station{currentSelectedStations.length > 1 ? "s" : ""} selected
//                 </>
//               ) : (
//                 "No stations selected"
//               )}
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline" onClick={() => setCurrentSelectedStations([])}>
//                 Clear Selection
//               </Button>
//               <Button
//                 onClick={handleContinue}
//                 disabled={currentSelectedStations.length === 0}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Continue with Selected Stations
//                 <ArrowRight className="h-4 w-4 ml-2" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
























"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Factory, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { API_BASE_URL } from "@/lib/constants"

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
}

interface StationSelectionStepProps {
  onComplete: (data: { selectedStations: string[] }) => void
  selectedStations: string[]
  isWizardMode?: boolean
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
}

export default function StationSelectionStep({
  onComplete,
  selectedStations,
  isWizardMode = false,
}: StationSelectionStepProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [currentSelectedStations, setCurrentSelectedStations] = useState<string[]>(selectedStations)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStations()
  }, [])

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

  useEffect(() => {
    if (stations.length > 0 && selectedStations.length === 0) {
      const allStationIds = stations.map((station) => station.id)
      setCurrentSelectedStations(allStationIds)
    }
  }, [stations, selectedStations])

  const handleStationToggle = (stationId: string) => {
    setCurrentSelectedStations((prev) => {
      if (prev.includes(stationId)) {
        return prev.filter((id) => id !== stationId)
      } else {
        return [...prev, stationId]
      }
    })
  }

  const handleContinue = () => {
    onComplete({ selectedStations: currentSelectedStations })
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
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const filteredStations = stations.filter(
    (station) =>
      station.stationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.stationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.stationId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading stations...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Factory className="h-5 w-5" />
          Station Selection
        </CardTitle>
        <p className="text-sm text-muted-foreground">Select the manufacturing stations for this MPI process.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Summary */}
        {currentSelectedStations.length > 0 && (
          <Alert className="py-2">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {currentSelectedStations.length} station{currentSelectedStations.length > 1 ? "s" : ""} selected
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-2" onClick={fetchStations}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Station List - Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                currentSelectedStations.includes(station.id)
                  ? "bg-blue-50 border-blue-200 shadow-sm"
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => handleStationToggle(station.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={station.id}
                  checked={currentSelectedStations.includes(station.id)}
                  onCheckedChange={() => handleStationToggle(station.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor={station.id} className="font-medium cursor-pointer">
                      {station.stationName || "Unknown Station"}
                    </Label>
                    <Badge
                      className={`${getStatusColor(station.status || "inactive")} flex items-center gap-1 text-xs`}
                    >
                      {getStatusIcon(station.status || "inactive")}
                      {(station.status || "inactive").charAt(0).toUpperCase() + (station.status || "inactive").slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {station.stationId || "N/A"} • Code: {station.stationCode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No stations found matching your search criteria.</p>
          </div>
        )}

        {/* Action Buttons */}
        {!isWizardMode && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {currentSelectedStations.length > 0 ? (
                <>
                  {currentSelectedStations.length} station{currentSelectedStations.length > 1 ? "s" : ""} selected
                </>
              ) : (
                "No stations selected"
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentSelectedStations([])}>
                Clear Selection
              </Button>
              <Button
                onClick={handleContinue}
                disabled={currentSelectedStations.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue with Selected Stations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
