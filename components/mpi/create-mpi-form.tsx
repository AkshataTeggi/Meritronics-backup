// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Settings, Save, RotateCcw, ArrowLeft } from "lucide-react"
// import { mpiApi } from "@/lib/mpi"
// import { stationApi } from "@/lib/stations"
// import { CreateMpiDto } from "@/types/mpi"
// import { Station } from "@/types/station"

// export default function CreateMpiForm() {
//   const [formData, setFormData] = useState<CreateMpiDto>({
//     stationName: "",
//     revision: "",
//     effectiveDate: "",
//     purpose: "",
//     scope: "",
//     equipment: "",
//     materials: "",
//     responsibilities: "",
//     procedure: "",
//     safety: "",
//     processControl: "",
//   })
//   const [stations, setStations] = useState<Station[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const stationList = await stationApi.findAll()
//         setStations(stationList)
//       } catch (err) {
//         console.error("Failed to fetch stations:", err)
//       }
//     }
//     fetchStations()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")
//     setSuccess("")

//     try {
//       await mpiApi.create(formData)
//       setSuccess("MPI created successfully!")
//       setTimeout(() => {
//         router.push("/dashboard/mpi")
//       }, 2000)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to create MPI")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleReset = () => {
//     setFormData({
//       stationName: "",
//       revision: "",
//       effectiveDate: "",
//       purpose: "",
//       scope: "",
//       equipment: "",
//       materials: "",
//       responsibilities: "",
//       procedure: "",
//       safety: "",
//       processControl: "",
//     })
//     setError("")
//     setSuccess("")
//   }

//   return (
//     <div className="space-y-6 min-h-full">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to MPIs
//         </Button>
//         <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Create New MPI</h1>
//       </div>

//       <Card className="w-full max-w-6xl mx-auto">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
//             <Settings className="h-5 w-5" />
//             Manufacturing Process Instruction
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4 text-sm">
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="stationName" className="text-sm font-medium">
//                     Station Name *
//                   </Label>
//                   <Select
//                     value={formData.stationName}
//                     onValueChange={(value) => setFormData({ ...formData, stationName: value })}
//                   >
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Select station" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {stations.map((station) => (
//                         <SelectItem key={station.id} value={station.stationName}>
//                           {station.stationName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="revision" className="text-sm font-medium">
//                     Revision
//                   </Label>
//                   <Input
//                     id="revision"
//                     type="text"
//                     value={formData.revision}
//                     onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
//                     placeholder="e.g., Rev. B"
//                     className="h-9"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="effectiveDate" className="text-sm font-medium">
//                     Effective Date
//                   </Label>
//                   <Input
//                     id="effectiveDate"
//                     type="date"
//                     value={formData.effectiveDate}
//                     onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
//                     className="h-9"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Purpose and Scope */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Purpose & Scope</h3>
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="purpose" className="text-sm font-medium">
//                     Purpose
//                   </Label>
//                   <Textarea
//                     id="purpose"
//                     value={formData.purpose}
//                     onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
//                     placeholder="The purpose of this document is to provide..."
//                     rows={3}
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="scope" className="text-sm font-medium">
//                     Scope
//                   </Label>
//                   <Textarea
//                     id="scope"
//                     value={formData.scope}
//                     onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
//                     placeholder="This procedure applies to..."
//                     rows={3}
//                     className="resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Equipment and Materials */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Equipment & Materials</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="equipment" className="text-sm font-medium">
//                     Equipment
//                   </Label>
//                   <Textarea
//                     id="equipment"
//                     value={formData.equipment}
//                     onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
//                     placeholder="1. Equipment item 1&#10;2. Equipment item 2&#10;3. Equipment item 3"
//                     rows={5}
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="materials" className="text-sm font-medium">
//                     Materials
//                   </Label>
//                   <Textarea
//                     id="materials"
//                     value={formData.materials}
//                     onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
//                     placeholder="1. Material item 1&#10;2. Material item 2&#10;3. Material item 3"
//                     rows={5}
//                     className="resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Responsibilities */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Responsibilities</h3>
//               <div className="space-y-2">
//                 <Label htmlFor="responsibilities" className="text-sm font-medium">
//                   Responsibilities
//                 </Label>
//                 <Textarea
//                   id="responsibilities"
//                   value={formData.responsibilities}
//                   onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
//                   placeholder="1. Engineering: Responsibility description&#10;2. Operators: Responsibility description&#10;3. Line Supervisors: Responsibility description"
//                   rows={4}
//                   className="resize-none"
//                 />
//               </div>
//             </div>

//             {/* Procedure */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Procedure</h3>
//               <div className="space-y-2">
//                 <Label htmlFor="procedure" className="text-sm font-medium">
//                   Procedure Steps
//                 </Label>
//                 <Textarea
//                   id="procedure"
//                   value={formData.procedure}
//                   onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
//                   placeholder="1. Step 1 description&#10;2. Step 2 description&#10;3. Step 3 description"
//                   rows={6}
//                   className="resize-none"
//                 />
//               </div>
//             </div>

//             {/* Safety and Process Control */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Safety & Process Control</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="safety" className="text-sm font-medium">
//                     Safety
//                   </Label>
//                   <Textarea
//                     id="safety"
//                     value={formData.safety}
//                     onChange={(e) => setFormData({ ...formData, safety: e.target.value })}
//                     placeholder="1. Safety requirement 1&#10;2. Safety requirement 2&#10;3. Safety requirement 3"
//                     rows={5}
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="processControl" className="text-sm font-medium">
//                     Process Control
//                   </Label>
//                   <Textarea
//                     id="processControl"
//                     value={formData.processControl}
//                     onChange={(e) => setFormData({ ...formData, processControl: e.target.value })}
//                     placeholder="1. Control measure 1&#10;2. Control measure 2&#10;3. Control measure 3"
//                     rows={5}
//                     className="resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 pt-6 border-t">
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {isLoading ? "Creating..." : "Create MPI"}
//               </Button>
//               <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
//                 <RotateCcw className="h-4 w-4 mr-2" />
//                 Reset
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.push("/dashboard/mpi")}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

















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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockChecklists } from "@/lib/mock-data/mpi-data"
import { Settings, Save, ArrowLeft, ClipboardList, Shield, BarChart3 } from "lucide-react"
import { Checklist, CreateMpiDto } from "@/types/mpi"
import { Station } from "@/types/station"

export default function CreateMpiForm() {
  const [stations, setStations] = useState<Station[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [formData, setFormData] = useState<CreateMpiDto>({
    stationName: "",
    stationId: "",
    processName: "",
    revision: "1.0",
    effectiveDate: new Date().toISOString().split("T")[0],
    purpose: "",
    scope: "",
    equipment: "",
    materials: "",
    responsibilities: "",
    procedure: "",
    safety: "",
    processControl: "",
    setupInstructions: "",
    operatingInstructions: "",
    qualityInstructions: "",
    troubleshootingInstructions: "",
    maintenanceInstructions: "",
    shutdownInstructions: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load mock data
    setStations(stations)
    setChecklists(mockChecklists)
  }, [])

  const handleStationChange = (stationId: string) => {
    const station = stations.find((s) => s.stationId === stationId)
    if (station) {
      setFormData({
        ...formData,
        stationId: station.stationId,
        stationName: station.stationName,
        processName: `${station.stationName} Process`,
        purpose: `Manufacturing Process Instruction for ${station.stationName}`,
        scope: `This MPI applies to all operations at station ${station.stationName}`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      console.log("Creating MPI:", formData)
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

  return (
    <div className="space-y-6 min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Create New MPI</h1>
      </div>

      <Card className="w-full max-w-6xl mx-auto">
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
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationId" className="text-sm font-medium">
                      Station *
                    </Label>
                    <Select value={formData.stationId} onValueChange={handleStationChange}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.stationId}>
                            {station.stationName} ({station.stationId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checklistId" className="text-sm font-medium">
                      Checklist Template (Optional)
                    </Label>
                    <Select
                      value={formData.checklistId || ""}
                      onValueChange={(value) => setFormData({ ...formData, checklistId: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select checklist template" />
                      </SelectTrigger>
                      <SelectContent>
                        {checklists.map((checklist) => (
                          <SelectItem key={checklist.id} value={checklist.id}>
                            {checklist.name} (v{checklist.version})
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
                      placeholder="e.g., SMT Assembly Process"
                      className="h-9"
                      required
                    />
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
                      placeholder="e.g., Rev. A"
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
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment" className="text-sm font-medium">
                      Equipment
                    </Label>
                    <Textarea
                      id="equipment"
                      value={formData.equipment}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                      placeholder="1. Equipment item 1&#10;2. Equipment item 2"
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
                      placeholder="1. Material item 1&#10;2. Material item 2"
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities" className="text-sm font-medium">
                    Responsibilities
                  </Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="1. Engineering: Responsibility description&#10;2. Operators: Responsibility description"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="procedures" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="procedure" className="text-sm font-medium">
                    Procedure Steps
                  </Label>
                  <Textarea
                    id="procedure"
                    value={formData.procedure}
                    onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                    placeholder="1. Step 1 description&#10;2. Step 2 description"
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="safety" className="text-sm font-medium">
                      Safety
                    </Label>
                    <Textarea
                      id="safety"
                      value={formData.safety}
                      onChange={(e) => setFormData({ ...formData, safety: e.target.value })}
                      placeholder="1. Safety requirement 1&#10;2. Safety requirement 2"
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
                      placeholder="1. Control measure 1&#10;2. Control measure 2"
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Detailed Work Instructions
                  </h3>

                  {/* Setup Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="setupInstructions" className="text-sm font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Setup Instructions
                    </Label>
                    <Textarea
                      id="setupInstructions"
                      value={formData.setupInstructions}
                      onChange={(e) => setFormData({ ...formData, setupInstructions: e.target.value })}
                      placeholder="Detailed setup instructions..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Operating Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="operatingInstructions" className="text-sm font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Operating Instructions
                    </Label>
                    <Textarea
                      id="operatingInstructions"
                      value={formData.operatingInstructions}
                      onChange={(e) => setFormData({ ...formData, operatingInstructions: e.target.value })}
                      placeholder="Step-by-step operating instructions..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Quality Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="qualityInstructions" className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Quality Control Instructions
                    </Label>
                    <Textarea
                      id="qualityInstructions"
                      value={formData.qualityInstructions}
                      onChange={(e) => setFormData({ ...formData, qualityInstructions: e.target.value })}
                      placeholder="Quality control procedures..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Troubleshooting Instructions */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="troubleshootingInstructions"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Troubleshooting Instructions
                    </Label>
                    <Textarea
                      id="troubleshootingInstructions"
                      value={formData.troubleshootingInstructions}
                      onChange={(e) => setFormData({ ...formData, troubleshootingInstructions: e.target.value })}
                      placeholder="Common issues and solutions..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Maintenance Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceInstructions" className="text-sm font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Maintenance Instructions
                    </Label>
                    <Textarea
                      id="maintenanceInstructions"
                      value={formData.maintenanceInstructions}
                      onChange={(e) => setFormData({ ...formData, maintenanceInstructions: e.target.value })}
                      placeholder="Routine maintenance procedures..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Shutdown Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="shutdownInstructions" className="text-sm font-medium flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Shutdown Instructions
                    </Label>
                    <Textarea
                      id="shutdownInstructions"
                      value={formData.shutdownInstructions}
                      onChange={(e) => setFormData({ ...formData, shutdownInstructions: e.target.value })}
                      placeholder="End-of-shift shutdown procedures..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !formData.stationName || !formData.processName}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create MPI"}
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
