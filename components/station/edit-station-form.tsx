
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// import { Save, ArrowLeft, Plus, Trash2, Edit, Settings, FileText, GitBranch } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/components/ui/use-toast"
// import { FileUploadField } from "./file-upload-field"
// import { documentationApi } from "@/lib/documentation"
// import { flowChartsApi } from "@/lib/flow-chart"
// import { specificationsApi } from "@/lib/specifications"
// import { stationApi } from "@/lib/stations"
// import { technicalSpecificationsApi } from "@/lib/technical-specifications"
// import type { SpecificationType, Station, UpdateStationDto } from "@/types/station"

// interface EditStationFormProps {
//   stationId: string
// }

// export default function EditStationForm({ stationId }: EditStationFormProps) {
//   const [station, setStation] = useState<Station | null>(null)
//   const [formData, setFormData] = useState<UpdateStationDto>({
//     stationId: "",
//     stationName: "",
//     status: undefined,
//     stationCode: "", // Changed from staticCode
//     description: "",
//     location: "",
//     operator: "",
//     addStation: "",
//   })

//   // State for specifications
//   const [specifications, setSpecifications] = useState<any[]>([])
//   const [newSpecification, setNewSpecification] = useState<any>({
//     name: "",
//     type: "TEXT",
//     isRequired: false,
//     isActive: true,
//     suggestions: [],
//     stationId: "",
//   })

//   // State for technical specifications
//   const [technicalSpecs, setTechnicalSpecs] = useState<any[]>([])
//   const [newTechnicalSpec, setNewTechnicalSpec] = useState<any>({
//     name: "",
//     value: "",
//     stationId: "",
//   })

//   // State for documentation
//   const [documentation, setDocumentation] = useState<any[]>([])
//   const [newDocumentation, setNewDocumentation] = useState<any>({
//     content: "",
//     stationId: "",
//     files: [],
//   })
//   const [documentationFiles, setDocumentationFiles] = useState<File[]>([])

//   // State for flow charts
//   const [flowCharts, setFlowCharts] = useState<any[]>([])
//   const [newFlowChart, setNewFlowChart] = useState<any>({
//     content: "",
//     stationId: "",
//     files: [],
//   })
//   const [flowChartFiles, setFlowChartFiles] = useState<File[]>([])

//   // Edit states
//   const [editingSpec, setEditingSpec] = useState<string | null>(null)
//   const [editingTech, setEditingTech] = useState<number | null>(null)
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingChart, setEditingChart] = useState<string | null>(null)

//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const router = useRouter()
//   const [shouldRedirectAfterUpdate, setShouldRedirectAfterUpdate] = useState(false)

//   // Add this after other state declarations
//   const [availableTypes, setAvailableTypes] = useState<SpecificationType[]>([])

//   useEffect(() => {
//     const fetchStationData = async () => {
//       try {
//         console.log("Fetching station with ID:", stationId)
//         const stationData = await stationApi.findOne(stationId)
//         console.log("Fetched station data:", stationData)
//         setStation(stationData)
//         setFormData({
//           stationId: stationData.stationId || "",
//           stationName: stationData.stationName || "",
//           status: stationData.status || "active",
//           stationCode: stationData.stationCode || "", // Changed from staticCode
//           description: stationData.description || "",
//           location: stationData.location || "",
//           operator: stationData.operator || "",
//           addStation: stationData.addStation || "yes",
//         })

//         // Set specifications
//         if (stationData.specifications) {
//           setSpecifications(stationData.specifications)
//         }

//         // Set technical specifications
//         if (stationData.technicalSpecifications) {
//           setTechnicalSpecs(stationData.technicalSpecifications)
//         }

//         // Set documentation
//         if (stationData.documentation) {
//           setDocumentation(stationData.documentation)
//         }

//         // Set flow charts
//         if (stationData.flowCharts) {
//           setFlowCharts(stationData.flowCharts)
//         }

//         // Set stationId for new entities
//         setNewSpecification((prev: any) => ({ ...prev, stationId }))
//         setNewTechnicalSpec((prev: any) => ({ ...prev, stationId }))
//         setNewDocumentation((prev: any) => ({ ...prev, stationId }))
//         setNewFlowChart((prev: any) => ({ ...prev, stationId }))
//       } catch (err) {
//         console.error("Failed to fetch station:", err)
//         setError(err instanceof Error ? err.message : "Failed to fetch station")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     const fetchSpecificationTypes = async () => {
//       try {
//         const types = await specificationsApi.getTypes()
//         setAvailableTypes(types)
//       } catch (err) {
//         console.error("Failed to fetch specification types:", err)
//       }
//     }

//     fetchStationData()
//     fetchSpecificationTypes()
//   }, [stationId])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError("")
//     setSuccess("")

//     try {
//       // Filter out empty strings and undefined values
//       const cleanedData = Object.fromEntries(
//         Object.entries(formData).filter(([_, value]) => value !== "" && value !== undefined),
//       ) as UpdateStationDto

//       console.log("Updating station data:", cleanedData)

//       // Update the main station data only
//       await stationApi.update(stationId, cleanedData)

//       // Show success toast
//       toast({
//         title: "Station updated",
//         description: "Station has been updated successfully.",
//       })

//       setSuccess("Station updated successfully!")

//       // Only redirect if the main update button was clicked
//       if (shouldRedirectAfterUpdate) {
//         setTimeout(() => {
//           router.push("/dashboard/stations")
//         }, 2000)
//       }
//     } catch (err) {
//       console.error("Station update error:", err)
//       setError(err instanceof Error ? err.message : "Failed to update station")

//       // Show error toast
//       toast({
//         title: "Update failed",
//         description: `Could not update station: ${err instanceof Error ? err.message : "Unknown error"}`,
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//       setShouldRedirectAfterUpdate(false) // Reset the flag
//     }
//   }

//   // Handle adding a new specification
//   const handleAddSpecification = async () => {
//     try {
//       if (!newSpecification.name) {
//         toast({
//           title: "Validation Error",
//           description: "Name is required for specifications",
//           variant: "destructive",
//         })
//         return
//       }

//       // Generate slug from name
//       const slug = newSpecification.name
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "")

//       const specificationData = {
//         ...newSpecification,
//         slug: slug,
//       }

//       console.log("Creating specification with data:", specificationData)

//       const createdSpec = await specificationsApi.create(specificationData)

//       console.log("Created specification:", createdSpec)

//       setSpecifications([...specifications, createdSpec])
//       setNewSpecification({
//         name: "",
//         type: "TEXT",
//         isRequired: false,
//         isActive: true,
//         suggestions: [],
//         stationId,
//       })

//       toast({
//         title: "Specification added",
//         description: "New specification has been added successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to add specification:", err)
//       toast({
//         title: "Failed to add specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle updating a specification
//   const handleUpdateSpecification = async (spec: any) => {
//     try {
//       // Generate slug from name
//       const slug = spec.name
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "")

//       const updateData = {
//         name: spec.name,
//         slug: slug,
//         type: spec.type,
//         isRequired: spec.isRequired,
//         isActive: spec.isActive,
//         suggestions: spec.suggestions,
//       }

//       console.log("Updating specification:", spec.id, updateData)

//       const updatedSpec = await specificationsApi.update(spec.id, updateData)

//       setSpecifications(specifications.map((s) => (s.id === spec.id ? updatedSpec : s)))
//       setEditingSpec(null)

//       toast({
//         title: "Specification updated",
//         description: "Specification has been updated successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to update specification:", err)
//       toast({
//         title: "Failed to update specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle adding a new technical specification
//   const handleAddTechnicalSpec = async () => {
//     try {
//       if (!newTechnicalSpec.name || !newTechnicalSpec.value) {
//         toast({
//           title: "Validation Error",
//           description: "Name and value are required for technical specifications",
//           variant: "destructive",
//         })
//         return
//       }

//       console.log("Creating technical specification with data:", newTechnicalSpec)

//       const createdTechSpec = await technicalSpecificationsApi.create(newTechnicalSpec)

//       console.log("Created technical specification:", createdTechSpec)

//       setTechnicalSpecs([...technicalSpecs, createdTechSpec])
//       setNewTechnicalSpec({
//         name: "",
//         value: "",
//         stationId,
//       })

//       toast({
//         title: "Technical specification added",
//         description: "New technical specification has been added successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to add technical specification:", err)
//       toast({
//         title: "Failed to add technical specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle updating a technical specification
//   const handleUpdateTechnicalSpec = async (tech: any) => {
//     try {
//       const updateData = {
//         name: tech.name,
//         value: tech.value,
//       }

//       console.log("Updating technical specification:", tech.id, updateData)

//       const updatedTech = await technicalSpecificationsApi.update(tech.id, updateData)

//       setTechnicalSpecs(technicalSpecs.map((t) => (t.id === tech.id ? updatedTech : t)))
//       setEditingTech(null)

//       toast({
//         title: "Technical specification updated",
//         description: "Technical specification has been updated successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to update technical specification:", err)
//       toast({
//         title: "Failed to update technical specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle adding new documentation
//   const handleAddDocumentation = async () => {
//     try {
//       if (!newDocumentation.content) {
//         toast({
//           title: "Validation Error",
//           description: "Content is required for documentation",
//           variant: "destructive",
//         })
//         return
//       }

//       const createdDoc = await documentationApi.create(newDocumentation, documentationFiles)
//       setDocumentation([...documentation, createdDoc])
//       setNewDocumentation({
//         content: "",
//         stationId,
//         files: [],
//       })
//       setDocumentationFiles([])

//       toast({
//         title: "Documentation added",
//         description: "New documentation has been added successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to add documentation:", err)
//       toast({
//         title: "Failed to add documentation",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle updating documentation
//   const handleUpdateDocumentation = async (doc: any) => {
//     try {
//       const updateData = {
//         content: doc.content,
//       }

//       console.log("Updating documentation:", doc.id, updateData)

//       const updatedDoc = await documentationApi.update(doc.id, updateData)

//       console.log("Documentation update response:", updatedDoc)

//       // Update local state with the response from API
//       setDocumentation(documentation.map((d) => (d.id === doc.id ? updatedDoc : d)))
//       setEditingDoc(null)

//       toast({
//         title: "Documentation updated",
//         description: "Documentation has been updated successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to update documentation:", err)
//       toast({
//         title: "Failed to update documentation",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle adding new flow chart
//   const handleAddFlowChart = async () => {
//     try {
//       if (!newFlowChart.content) {
//         toast({
//           title: "Validation Error",
//           description: "Content is required for flow charts",
//           variant: "destructive",
//         })
//         return
//       }

//       const createdChart = await flowChartsApi.create(newFlowChart, flowChartFiles)
//       setFlowCharts([...flowCharts, createdChart])
//       setNewFlowChart({
//         content: "",
//         stationId: "",
//         files: [],
//       })
//       setFlowChartFiles([])

//       toast({
//         title: "Flow chart added",
//         description: "New flow chart has been added successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to add flow chart:", err)
//       toast({
//         title: "Failed to add flow chart",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle updating flow chart
//   const handleUpdateFlowChart = async (chart: any) => {
//     try {
//       const updateData = {
//         content: chart.content,
//       }

//       console.log("Updating flow chart:", chart.id, updateData)

//       const updatedChart = await flowChartsApi.update(chart.id, updateData)

//       console.log("Flow chart update response:", updatedChart)

//       // Update local state with the response from API
//       setFlowCharts(flowCharts.map((c) => (c.id === chart.id ? updatedChart : c)))
//       setEditingChart(null)

//       toast({
//         title: "Flow chart updated",
//         description: "Flow chart has been updated successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to update flow chart:", err)
//       toast({
//         title: "Failed to update flow chart",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle removing a specification - NO REDIRECT
//   const handleRemoveSpecification = async (id: string) => {
//     try {
//       await specificationsApi.remove(id)
//       setSpecifications(specifications.filter((spec) => spec.id !== id))
//       toast({
//         title: "Specification removed",
//         description: "Specification has been removed successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to remove specification:", err)
//       toast({
//         title: "Failed to remove specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle removing a technical specification - NO REDIRECT
//   const handleRemoveTechnicalSpec = async (id: number) => {
//     try {
//       await technicalSpecificationsApi.remove(id)
//       setTechnicalSpecs(technicalSpecs.filter((tech) => tech.id !== id))
//       toast({
//         title: "Technical specification removed",
//         description: "Technical specification has been removed successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to remove technical specification:", err)
//       toast({
//         title: "Failed to remove technical specification",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle removing documentation - NO REDIRECT
//   const handleRemoveDocumentation = async (id: string) => {
//     try {
//       await documentationApi.remove(id)
//       setDocumentation(documentation.filter((doc) => doc.id !== id))
//       toast({
//         title: "Documentation removed",
//         description: "Documentation has been removed successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to remove documentation:", err)
//       toast({
//         title: "Failed to remove documentation",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle removing a flow chart - NO REDIRECT
//   const handleRemoveFlowChart = async (id: string) => {
//     try {
//       await flowChartsApi.remove(id)
//       setFlowCharts(flowCharts.filter((chart) => chart.id !== id))
//       toast({
//         title: "Flow chart removed",
//         description: "Flow chart has been removed successfully.",
//       })
//     } catch (err) {
//       console.error("Failed to remove flow chart:", err)
//       toast({
//         title: "Failed to remove flow chart",
//         description: err instanceof Error ? err.message : "Unknown error",
//         variant: "destructive",
//       })
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading station...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!station) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-600">Station not found</p>
//         <Button onClick={() => router.push("/dashboard/stations")} className="mt-4">
//           Back to Stations
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 min-h-full">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit Station</h1>
//         <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Stations
//         </Button>
//       </div>

//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4 text-sm">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information Card - placed above tabs */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="stationId" className="text-sm font-medium">
//                   Station ID *
//                 </Label>
//                 <Input
//                   id="stationId"
//                   type="text"
//                   value={formData.stationId}
//                   onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
//                   placeholder="Enter station ID"
//                   required
//                   className="h-9"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="stationName" className="text-sm font-medium">
//                   Station Name *
//                 </Label>
//                 <Input
//                   id="stationName"
//                   type="text"
//                   value={formData.stationName}
//                   onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
//                   placeholder="Enter station name"
//                   required
//                   className="h-9"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="stationCode" className="text-sm font-medium">
//                   Station Code
//                 </Label>
//                 <Input
//                   id="stationCode"
//                   type="text"
//                   value={formData.stationCode}
//                   onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
//                   placeholder="Enter station code"
//                   className="h-9"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="status" className="text-sm font-medium">
//                   Status
//                 </Label>
//                 <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
//                   <SelectTrigger className="h-9">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                     <SelectItem value="maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location" className="text-sm font-medium">
//                   Location
//                 </Label>
//                 <Input
//                   id="location"
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                   placeholder="Enter location"
//                   className="h-9"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="operator" className="text-sm font-medium">
//                   Operator
//                 </Label>
//                 <Input
//                   id="operator"
//                   type="text"
//                   value={formData.operator}
//                   onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
//                   placeholder="Enter operator name"
//                   className="h-9"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-sm font-medium">
//                 Description
//               </Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Enter station description"
//                 rows={4}
//                 className="resize-none"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Tabs defaultValue="specifications" className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="specifications">Specifications ({specifications.length})</TabsTrigger>
//             <TabsTrigger value="technical">Technical ({technicalSpecs.length})</TabsTrigger>
//             <TabsTrigger value="documentation">Documentation ({documentation.length})</TabsTrigger>
//             <TabsTrigger value="flowcharts">Flow Charts ({flowCharts.length})</TabsTrigger>
//           </TabsList>

//           <TabsContent value="specifications" className="space-y-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Settings className="h-5 w-5 text-blue-500" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Specifications</h3>
//             </div>

//             {/* Current Specifications */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Current Specifications ({specifications.length})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {specifications.length === 0 ? (
//                   <div className="text-center py-8 text-muted-foreground">No specifications available</div>
//                 ) : (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Type</TableHead>
//                         <TableHead>Required</TableHead>
//                         <TableHead>Active</TableHead>
//                         <TableHead>Suggestions</TableHead>
//                         <TableHead>Created At</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {specifications.map((spec) => (
//                         <>
//                           <TableRow key={spec.id}>
//                             <TableCell className="font-medium">
//                               {editingSpec === spec.id ? (
//                                 <Input
//                                   value={spec.name}
//                                   onChange={(e) => {
//                                     const updated = specifications.map((s) =>
//                                       s.id === spec.id ? { ...s, name: e.target.value } : s,
//                                     )
//                                     setSpecifications(updated)
//                                   }}
//                                   className="h-8"
//                                 />
//                               ) : (
//                                 spec.name
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               {editingSpec === spec.id ? (
//                                 <Select
//                                   value={spec.type}
//                                   onValueChange={(value) => {
//                                     const updated = specifications.map((s) =>
//                                       s.id === spec.id ? { ...s, type: value } : s,
//                                     )
//                                     setSpecifications(updated)
//                                   }}
//                                 >
//                                   <SelectTrigger className="h-8">
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {availableTypes.length > 0 ? (
//                                       availableTypes.map((type) => (
//                                         <SelectItem key={type} value={type}>
//                                           {type
//                                             .replace(/_/g, " ")
//                                             .toLowerCase()
//                                             .replace(/\b\w/g, (l) => l.toUpperCase())}
//                                         </SelectItem>
//                                       ))
//                                     ) : (
//                                       <>
//                                         <SelectItem value="TEXT">Text</SelectItem>
//                                         <SelectItem value="NUMBER">Number</SelectItem>
//                                         <SelectItem value="BOOLEAN_TYPE">Boolean</SelectItem>
//                                         <SelectItem value="DATE">Date</SelectItem>
//                                       </>
//                                     )}
//                                   </SelectContent>
//                                 </Select>
//                               ) : (
//                                 <span className="capitalize text-sm">{spec.type}</span>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               {editingSpec === spec.id ? (
//                                 <Checkbox
//                                   checked={spec.isRequired}
//                                   onCheckedChange={(checked) => {
//                                     const updated = specifications.map((s) =>
//                                       s.id === spec.id ? { ...s, isRequired: checked } : s,
//                                     )
//                                     setSpecifications(updated)
//                                   }}
//                                 />
//                               ) : (
//                                 <span className="text-sm">{spec.isRequired ? "Required" : "Optional"}</span>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               {editingSpec === spec.id ? (
//                                 <Checkbox
//                                   checked={spec.isActive}
//                                   onCheckedChange={(checked) => {
//                                     const updated = specifications.map((s) =>
//                                       s.id === spec.id ? { ...s, isActive: checked } : s,
//                                     )
//                                     setSpecifications(updated)
//                                   }}
//                                 />
//                               ) : (
//                                 <span className="text-sm">{spec.isActive ? "Active" : "Inactive"}</span>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               {spec.suggestions && spec.suggestions.length > 0 ? (
//                                 <div className="text-sm">{spec.suggestions.join(", ")}</div>
//                               ) : (
//                                 <span className="text-muted-foreground">None</span>
//                               )}
//                             </TableCell>
//                             <TableCell className="text-sm text-muted-foreground">
//                               {spec.createdAt ? new Date(spec.createdAt).toLocaleString() : "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex gap-2">
//                                 {editingSpec === spec.id ? (
//                                   <>
//                                     <Button size="sm" onClick={() => handleUpdateSpecification(spec)} className="h-8">
//                                       Save
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => setEditingSpec(null)}
//                                       className="h-8"
//                                     >
//                                       Cancel
//                                     </Button>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Button
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => setEditingSpec(spec.id)}
//                                       className="h-8"
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => handleRemoveSpecification(spec.id)}
//                                       className="h-8 text-red-500 hover:text-red-700"
//                                     >
//                                       <Trash2 className="h-3 w-3" />
//                                     </Button>
//                                   </>
//                                 )}
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                           {editingSpec === spec.id && spec.type === "DROPDOWN" && (
//                             <TableRow>
//                               <TableCell colSpan={7}>
//                                 <div className="space-y-2 mt-2 p-4 bg-gray-50 rounded-md">
//                                   <Label className="text-sm font-medium">Options</Label>
//                                   <div className="space-y-2">
//                                     {spec.suggestions?.map((option: string, index: number) => (
//                                       <div key={index} className="flex items-center gap-2">
//                                         <Input
//                                           value={option}
//                                           onChange={(e) => {
//                                             const newOptions = [...(spec.suggestions || [])]
//                                             newOptions[index] = e.target.value
//                                             const updated = specifications.map((s) =>
//                                               s.id === spec.id ? { ...s, suggestions: newOptions } : s,
//                                             )
//                                             setSpecifications(updated)
//                                           }}
//                                           placeholder="Enter option"
//                                           className="h-8"
//                                         />
//                                         <Button
//                                           type="button"
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() => {
//                                             const newOptions =
//                                               spec.suggestions?.filter((_: any, i: number) => i !== index) || []
//                                             const updated = specifications.map((s) =>
//                                               s.id === spec.id ? { ...s, suggestions: newOptions } : s,
//                                             )
//                                             setSpecifications(updated)
//                                           }}
//                                           className="h-8 w-8 p-0"
//                                         >
//                                           <Trash2 className="h-3 w-3" />
//                                         </Button>
//                                       </div>
//                                     ))}
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => {
//                                         const newOptions = [...(spec.suggestions || []), ""]
//                                         const updated = specifications.map((s) =>
//                                           s.id === spec.id ? { ...s, suggestions: newOptions } : s,
//                                         )
//                                         setSpecifications(updated)
//                                       }}
//                                       className="h-8"
//                                     >
//                                       <Plus className="h-3 w-3 mr-1" />
//                                       Add Option
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </TableCell>
//                             </TableRow>
//                           )}
//                         </>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Add New Specification</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="specName" className="text-sm font-medium">
//                       Name *
//                     </Label>
//                     <Input
//                       id="specName"
//                       value={newSpecification.name}
//                       onChange={(e) => setNewSpecification({ ...newSpecification, name: e.target.value })}
//                       placeholder="Enter specification name"
//                       className="h-9"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="specType" className="text-sm font-medium">
//                       Type
//                     </Label>
//                     <Select
//                       value={newSpecification.type}
//                       onValueChange={(value) => setNewSpecification({ ...newSpecification, type: value as any })}
//                     >
//                       <SelectTrigger className="h-9">
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableTypes.length > 0 ? (
//                           availableTypes.map((type) => (
//                             <SelectItem key={type} value={type}>
//                               {type
//                                 .replace(/_/g, " ")
//                                 .toLowerCase()
//                                 .replace(/\b\w/g, (l) => l.toUpperCase())}
//                             </SelectItem>
//                           ))
//                         ) : (
//                           <>
//                             <SelectItem value="TEXT">Text</SelectItem>
//                             <SelectItem value="NUMBER">Number</SelectItem>
//                             <SelectItem value="BOOLEAN_TYPE">Boolean</SelectItem>
//                             <SelectItem value="DATE">Date</SelectItem>
//                             <SelectItem value="DROPDOWN">Dropdown</SelectItem>
//                           </>
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {newSpecification.type === "DROPDOWN" && (
//                   <div className="space-y-2 col-span-2">
//                     <Label htmlFor="specOptions" className="text-sm font-medium">
//                       Options
//                     </Label>
//                     <div className="space-y-2">
//                       {newSpecification.suggestions?.map((option: string, index: number) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <Input
//                             value={option}
//                             onChange={(e) => {
//                               const newOptions = [...(newSpecification.suggestions || [])]
//                               newOptions[index] = e.target.value
//                               setNewSpecification({ ...newSpecification, suggestions: newOptions })
//                             }}
//                             placeholder="Enter option"
//                             className="h-9"
//                           />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               const newOptions =
//                                 newSpecification.suggestions?.filter((_: any, i: number) => i !== index) || []
//                               setNewSpecification({ ...newSpecification, suggestions: newOptions })
//                             }}
//                             className="h-9 w-9 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           const newOptions = [...(newSpecification.suggestions || []), ""]
//                           setNewSpecification({ ...newSpecification, suggestions: newOptions })
//                         }}
//                         className="h-9"
//                       >
//                         <Plus className="h-3 w-3 mr-1" />
//                         Add Option
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-6">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="specRequired"
//                       checked={newSpecification.isRequired}
//                       onCheckedChange={(checked) =>
//                         setNewSpecification({ ...newSpecification, isRequired: checked as boolean })
//                       }
//                     />
//                     <Label htmlFor="specRequired" className="text-sm font-medium">
//                       Required
//                     </Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="specActive"
//                       checked={newSpecification.isActive}
//                       onCheckedChange={(checked) =>
//                         setNewSpecification({ ...newSpecification, isActive: checked as boolean })
//                       }
//                     />
//                     <Label htmlFor="specActive" className="text-sm font-medium">
//                       Active
//                     </Label>
//                   </div>
//                 </div>

//                 <Button type="button" onClick={handleAddSpecification} className="mt-4">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Specification
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="technical" className="space-y-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Settings className="h-5 w-5 text-green-500" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Technical Specifications</h3>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Current Technical Specifications ({technicalSpecs.length})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {technicalSpecs.length === 0 ? (
//                   <div className="text-center py-8 text-muted-foreground">No technical specifications available</div>
//                 ) : (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Value</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {technicalSpecs.map((tech) => (
//                         <TableRow key={tech.id}>
//                           <TableCell className="font-medium">
//                             {editingTech === tech.id ? (
//                               <Input
//                                 value={tech.name}
//                                 onChange={(e) => {
//                                   const updated = technicalSpecs.map((t) =>
//                                     t.id === tech.id ? { ...t, name: e.target.value } : t,
//                                   )
//                                   setTechnicalSpecs(updated)
//                                 }}
//                                 className="h-8"
//                               />
//                             ) : (
//                               tech.name
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {editingTech === tech.id ? (
//                               <Input
//                                 value={tech.value}
//                                 onChange={(e) => {
//                                   const updated = technicalSpecs.map((t) =>
//                                     t.id === tech.id ? { ...t, value: e.target.value } : t,
//                                   )
//                                   setTechnicalSpecs(updated)
//                                 }}
//                                 className="h-8"
//                               />
//                             ) : (
//                               tech.value
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               {editingTech === tech.id ? (
//                                 <>
//                                   <Button size="sm" onClick={() => handleUpdateTechnicalSpec(tech)} className="h-8">
//                                     Save
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => setEditingTech(null)}
//                                     className="h-8"
//                                   >
//                                     Cancel
//                                   </Button>
//                                 </>
//                               ) : (
//                                 <>
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => setEditingTech(tech.id)}
//                                     className="h-8"
//                                   >
//                                     <Edit className="h-3 w-3" />
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => handleRemoveTechnicalSpec(tech.id)}
//                                     className="h-8 text-red-500 hover:text-red-700"
//                                   >
//                                     <Trash2 className="h-3 w-3" />
//                                   </Button>
//                                 </>
//                               )}
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Add New Technical Specification</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="techName" className="text-sm font-medium">
//                       Name *
//                     </Label>
//                     <Input
//                       id="techName"
//                       value={newTechnicalSpec.name}
//                       onChange={(e) => setNewTechnicalSpec({ ...newTechnicalSpec, name: e.target.value })}
//                       placeholder="Enter specification name"
//                       className="h-9"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="techValue" className="text-sm font-medium">
//                       Value *
//                     </Label>
//                     <Input
//                       id="techValue"
//                       value={newTechnicalSpec.value}
//                       onChange={(e) => setNewTechnicalSpec({ ...newTechnicalSpec, value: e.target.value })}
//                       placeholder="Enter specification value"
//                       className="h-9"
//                     />
//                   </div>
//                 </div>

//                 <Button type="button" onClick={handleAddTechnicalSpec} className="mt-4">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Technical Specification
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="documentation" className="space-y-4">
//             <div className="flex items-center gap-2 mb-4">
//               <FileText className="h-5 w-5 text-blue-500" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Documentation</h3>
//             </div>

//             <div className="space-y-4">
//               <h4 className="text-md font-medium">Current Documentation</h4>
//               {documentation.length === 0 ? (
//                 <p className="text-sm text-gray-500">No documentation added yet.</p>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Content</TableHead>
//                       <TableHead>Files</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {documentation.map((doc) => (
//                       <TableRow key={doc.id}>
//                         <TableCell>
//                           {editingDoc === doc.id ? (
//                             <Textarea
//                               value={doc.content}
//                               onChange={(e) => {
//                                 const updated = documentation.map((d) =>
//                                   d.id === doc.id ? { ...d, content: e.target.value } : d,
//                                 )
//                                 setDocumentation(updated)
//                               }}
//                               rows={2}
//                               className="resize-none"
//                             />
//                           ) : (
//                             <div className="max-w-xs truncate">{doc.content}</div>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {doc.files && doc.files.length > 0 ? (
//                             <div className="space-y-1">
//                               {doc.files.map((file: any) => (
//                                 <div key={file.id}>
//                                   <a
//                                     href={file.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-500 hover:underline text-sm"
//                                   >
//                                     {file.name}
//                                   </a>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             "No files"
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex gap-2">
//                             {editingDoc === doc.id ? (
//                               <>
//                                 <Button size="sm" onClick={() => handleUpdateDocumentation(doc)} className="h-8">
//                                   Save
//                                 </Button>
//                                 <Button size="sm" variant="outline" onClick={() => setEditingDoc(null)} className="h-8">
//                                   Cancel
//                                 </Button>
//                               </>
//                             ) : (
//                               <>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => setEditingDoc(doc.id)}
//                                   className="h-8"
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => handleRemoveDocumentation(doc.id)}
//                                   className="h-8 text-red-500 hover:text-red-700"
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </div>

//             <div className="border rounded-md p-4 space-y-4 mt-6">
//               <h4 className="text-md font-medium">Add New Documentation</h4>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="docContent" className="text-sm font-medium">
//                     Content *
//                   </Label>
//                   <Textarea
//                     id="docContent"
//                     value={newDocumentation.content}
//                     onChange={(e) => setNewDocumentation({ ...newDocumentation, content: e.target.value })}
//                     placeholder="Enter documentation content"
//                     rows={3}
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="docFiles" className="text-sm font-medium">
//                     Files
//                   </Label>
//                   <FileUploadField
//                     id="docFiles"
//                     onChange={(files) => setDocumentationFiles(Array.from(files))}
//                     multiple
//                     accept=".pdf,.doc,.docx,.txt"
//                     label={""}
//                   />
//                 </div>
//               </div>

//               <Button type="button" onClick={handleAddDocumentation} className="mt-4">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </TabsContent>

//           <TabsContent value="flowcharts" className="space-y-4">
//             <div className="flex items-center gap-2 mb-4">
//               <GitBranch className="h-5 w-5 text-green-500" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Flow Charts</h3>
//             </div>

//             <div className="space-y-4">
//               <h4 className="text-md font-medium">Current Flow Charts</h4>
//               {flowCharts.length === 0 ? (
//                 <p className="text-sm text-gray-500">No flow charts added yet.</p>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Content</TableHead>
//                       <TableHead>Files</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {flowCharts.map((chart) => (
//                       <TableRow key={chart.id}>
//                         <TableCell>
//                           {editingChart === chart.id ? (
//                             <Textarea
//                               value={chart.content}
//                               onChange={(e) => {
//                                 const updated = flowCharts.map((c) =>
//                                   c.id === chart.id ? { ...c, content: e.target.value } : c,
//                                 )
//                                 setFlowCharts(updated)
//                               }}
//                               rows={2}
//                               className="resize-none"
//                             />
//                           ) : (
//                             <div className="max-w-xs truncate">{chart.content}</div>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {chart.files && chart.files.length > 0 ? (
//                             <div className="space-y-1">
//                               {chart.files.map((file: any) => (
//                                 <div key={file.id}>
//                                   <a
//                                     href={file.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-500 hover:underline text-sm"
//                                   >
//                                     {file.name}
//                                   </a>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             "No files"
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex gap-2">
//                             {editingChart === chart.id ? (
//                               <>
//                                 <Button size="sm" onClick={() => handleUpdateFlowChart(chart)} className="h-8">
//                                   Save
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => setEditingChart(null)}
//                                   className="h-8"
//                                 >
//                                   Cancel
//                                 </Button>
//                               </>
//                             ) : (
//                               <>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => setEditingChart(chart.id)}
//                                   className="h-8"
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => handleRemoveFlowChart(chart.id)}
//                                   className="h-8 text-red-500 hover:text-red-700"
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </div>

//             <div className="border rounded-md p-4 space-y-4 mt-6">
//               <h4 className="text-md font-medium">Add New Flow Chart</h4>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="chartContent" className="text-sm font-medium">
//                     Content *
//                   </Label>
//                   <Textarea
//                     id="chartContent"
//                     value={newFlowChart.content}
//                     onChange={(e) => setNewFlowChart({ ...newFlowChart, content: e.target.value })}
//                     placeholder="Enter flow chart content"
//                     rows={3}
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="chartFiles" className="text-sm font-medium">
//                     Files
//                   </Label>
//                   <FileUploadField
//                     id="chartFiles"
//                     onChange={(files) => setFlowChartFiles(Array.from(files))}
//                     multiple
//                     accept=".pdf,.png,.jpg,.jpeg,.svg"
//                     label={""}
//                   />
//                 </div>
//               </div>

//               <Button type="button" onClick={handleAddFlowChart} className="mt-4">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Flow Chart
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-between items-center gap-3 pt-4 border-t">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.push("/dashboard/stations")}
//             disabled={isSubmitting}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
//             onClick={() => setShouldRedirectAfterUpdate(true)}
//           >
//             <Save className="h-4 w-4 mr-2" />
//             {isSubmitting ? "Updating..." : "Update Station"}
//           </Button>
//         </div>
//       </form>
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Save, ArrowLeft, Plus, Trash2, Edit, Settings, FileText, GitBranch } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { FileUploadField } from "./file-upload-field"
import { documentationApi } from "@/lib/documentation"
import { flowChartsApi } from "@/lib/flow-chart"
import { specificationsApi } from "@/lib/specifications"
import { stationApi } from "@/lib/stations"
import { technicalSpecificationsApi } from "@/lib/technical-specifications"
import type { SpecificationType, Station, UpdateStationDto } from "@/types/station"

interface EditStationFormProps {
  stationId: string
}

export default function EditStationForm({ stationId }: EditStationFormProps) {
  const [station, setStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState<UpdateStationDto>({
    stationId: "",
    stationName: "",
    status: undefined,
    stationCode: "", // Changed from staticCode
    description: "",
    location: "",
    operator: "",
    addStation: "",
  })

  // State for specifications
  const [specifications, setSpecifications] = useState<any[]>([])
  const [newSpecification, setNewSpecification] = useState<any>({
    name: "",
    type: "TEXT",
    isRequired: false,
    isActive: true,
    suggestions: [],
    stationId: "",
  })

  // State for technical specifications
  const [technicalSpecs, setTechnicalSpecs] = useState<any[]>([])
  const [newTechnicalSpec, setNewTechnicalSpec] = useState<any>({
    name: "",
    value: "",
    stationId: "",
  })

  // State for documentation
  const [documentation, setDocumentation] = useState<any[]>([])
  const [newDocumentation, setNewDocumentation] = useState<any>({
    content: "",
    stationId: "",
    files: [],
  })
  const [documentationFiles, setDocumentationFiles] = useState<File[]>([])

  // State for flow charts
  const [flowCharts, setFlowCharts] = useState<any[]>([])
  const [newFlowChart, setNewFlowChart] = useState<any>({
    content: "",
    stationId: "",
    files: [],
  })
  const [flowChartFiles, setFlowChartFiles] = useState<File[]>([])

  // Edit states
  const [editingSpec, setEditingSpec] = useState<string | null>(null)
  const [editingTech, setEditingTech] = useState<number | null>(null)
  const [editingDoc, setEditingDoc] = useState<string | null>(null)
  const [editingChart, setEditingChart] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [shouldRedirectAfterUpdate, setShouldRedirectAfterUpdate] = useState(false)

  // Add this after other state declarations
  const [availableTypes, setAvailableTypes] = useState<SpecificationType[]>([])

  // Add validation error states
  const [docValidationErrors, setDocValidationErrors] = useState<{ [key: string]: string }>({})
  const [chartValidationErrors, setChartValidationErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        console.log("Fetching station with ID:", stationId)
        const stationData = await stationApi.findOne(stationId)
        console.log("Fetched station data:", stationData)
        setStation(stationData)
        setFormData({
          stationId: stationData.stationId || "",
          stationName: stationData.stationName || "",
          status: stationData.status || "active",
          stationCode: stationData.stationCode || "", // Changed from staticCode
          description: stationData.description || "",
          location: stationData.location || "",
          operator: stationData.operator || "",
          addStation: stationData.addStation || "yes",
        })

        // Set specifications
        if (stationData.specifications) {
          setSpecifications(stationData.specifications)
        }

        // Set technical specifications
        if (stationData.technicalSpecifications) {
          setTechnicalSpecs(stationData.technicalSpecifications)
        }

        // Set documentation
        if (stationData.documentation) {
          setDocumentation(stationData.documentation)
        }

        // Set flow charts
        if (stationData.flowCharts) {
          setFlowCharts(stationData.flowCharts)
        }

        // Set stationId for new entities
        setNewSpecification((prev: any) => ({ ...prev, stationId }))
        setNewTechnicalSpec((prev: any) => ({ ...prev, stationId }))
        setNewDocumentation((prev: any) => ({ ...prev, stationId }))
        setNewFlowChart((prev: any) => ({ ...prev, stationId }))
      } catch (err) {
        console.error("Failed to fetch station:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch station")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSpecificationTypes = async () => {
      try {
        const types = await specificationsApi.getTypes()
        setAvailableTypes(types)
      } catch (err) {
        console.error("Failed to fetch specification types:", err)
      }
    }

    fetchStationData()
    fetchSpecificationTypes()
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

      // Update the main station data only
      await stationApi.update(stationId, cleanedData)

      // Show success toast
      toast({
        title: "Station updated",
        description: "Station has been updated successfully.",
      })

      setSuccess("Station updated successfully!")

      // Only redirect if the main update button was clicked
      if (shouldRedirectAfterUpdate) {
        setTimeout(() => {
          router.push("/dashboard/stations")
        }, 2000)
      }
    } catch (err) {
      console.error("Station update error:", err)
      setError(err instanceof Error ? err.message : "Failed to update station")

      // Show error toast
      toast({
        title: "Update failed",
        description: `Could not update station: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShouldRedirectAfterUpdate(false) // Reset the flag
    }
  }

  // Handle adding a new specification
  const handleAddSpecification = async () => {
    try {
      if (!newSpecification.name) {
        toast({
          title: "Validation Error",
          description: "Name is required for specifications",
          variant: "destructive",
        })
        return
      }

      // Generate slug from name
      const slug = newSpecification.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

      const specificationData = {
        ...newSpecification,
        slug: slug,
      }

      console.log("Creating specification with data:", specificationData)

      const createdSpec = await specificationsApi.create(specificationData)

      console.log("Created specification:", createdSpec)

      setSpecifications([...specifications, createdSpec])
      setNewSpecification({
        name: "",
        type: "TEXT",
        isRequired: false,
        isActive: true,
        suggestions: [],
        stationId,
      })

      toast({
        title: "Specification added",
        description: "New specification has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to add specification:", err)
      toast({
        title: "Failed to add specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle updating a specification
  const handleUpdateSpecification = async (spec: any) => {
    try {
      // Generate slug from name
      const slug = spec.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

      const updateData = {
        name: spec.name,
        slug: slug,
        type: spec.type,
        isRequired: spec.isRequired,
        isActive: spec.isActive,
        suggestions: spec.suggestions,
      }

      console.log("Updating specification:", spec.id, updateData)

      const updatedSpec = await specificationsApi.update(spec.id, updateData)

      setSpecifications(specifications.map((s) => (s.id === spec.id ? updatedSpec : s)))
      setEditingSpec(null)

      toast({
        title: "Specification updated",
        description: "Specification has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to update specification:", err)
      toast({
        title: "Failed to update specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle adding a new technical specification
  const handleAddTechnicalSpec = async () => {
    try {
      if (!newTechnicalSpec.name || !newTechnicalSpec.value) {
        toast({
          title: "Validation Error",
          description: "Name and value are required for technical specifications",
          variant: "destructive",
        })
        return
      }

      console.log("Creating technical specification with data:", newTechnicalSpec)

      const createdTechSpec = await technicalSpecificationsApi.create(newTechnicalSpec)

      console.log("Created technical specification:", createdTechSpec)

      setTechnicalSpecs([...technicalSpecs, createdTechSpec])
      setNewTechnicalSpec({
        name: "",
        value: "",
        stationId,
      })

      toast({
        title: "Technical specification added",
        description: "New technical specification has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to add technical specification:", err)
      toast({
        title: "Failed to add technical specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle updating a technical specification
  const handleUpdateTechnicalSpec = async (tech: any) => {
    try {
      const updateData = {
        name: tech.name,
        value: tech.value,
      }

      console.log("Updating technical specification:", tech.id, updateData)

      const updatedTech = await technicalSpecificationsApi.update(tech.id, updateData)

      setTechnicalSpecs(technicalSpecs.map((t) => (t.id === tech.id ? updatedTech : t)))
      setEditingTech(null)

      toast({
        title: "Technical specification updated",
        description: "Technical specification has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to update technical specification:", err)
      toast({
        title: "Failed to update technical specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle adding new documentation
  const handleAddDocumentation = async () => {
    try {
      if (!newDocumentation.content) {
        toast({
          title: "Validation Error",
          description: "Content is required for documentation",
          variant: "destructive",
        })
        return
      }

      const createdDoc = await documentationApi.create(newDocumentation, documentationFiles)
      setDocumentation([...documentation, createdDoc])
      setNewDocumentation({
        content: "",
        stationId,
        files: [],
      })
      setDocumentationFiles([])

      toast({
        title: "Documentation added",
        description: "New documentation has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to add documentation:", err)
      toast({
        title: "Failed to add documentation",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle updating documentation
  const handleUpdateDocumentation = async (doc: any) => {
    // Clear previous errors
    setDocValidationErrors({})

    // Add validation
    if (!doc.content || doc.content.trim() === "") {
      setDocValidationErrors({ [doc.id]: "Content is required for documentation" })
      toast({
        title: "Validation Error",
        description: "Content is required for documentation",
        variant: "destructive",
      })
      return
    }

    try {
      const updateData = {
        content: doc.content,
      }

      console.log("Updating documentation:", doc.id, updateData)

      const updatedDoc = await documentationApi.update(doc.id, updateData)

      console.log("Documentation update response:", updatedDoc)

      // Update local state with the response from API
      setDocumentation(documentation.map((d) => (d.id === doc.id ? updatedDoc : d)))
      setEditingDoc(null)
      setDocValidationErrors({}) // Clear errors on success

      toast({
        title: "Documentation updated",
        description: "Documentation has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to update documentation:", err)
      setDocValidationErrors({ [doc.id]: err instanceof Error ? err.message : "Failed to update documentation" })
      toast({
        title: "Failed to update documentation",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle adding new flow chart
  const handleAddFlowChart = async () => {
    try {
      if (!newFlowChart.content) {
        toast({
          title: "Validation Error",
          description: "Content is required for flow charts",
          variant: "destructive",
        })
        return
      }

      const createdChart = await flowChartsApi.create(newFlowChart, flowChartFiles)
      setFlowCharts([...flowCharts, createdChart])
      setNewFlowChart({
        content: "",
        stationId: "",
        files: [],
      })
      setFlowChartFiles([])

      toast({
        title: "Flow chart added",
        description: "New flow chart has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to add flow chart:", err)
      toast({
        title: "Failed to add flow chart",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle updating flow chart
  const handleUpdateFlowChart = async (chart: any) => {
    // Clear previous errors
    setChartValidationErrors({})

    // Add validation
    if (!chart.content || chart.content.trim() === "") {
      setChartValidationErrors({ [chart.id]: "Content is required for flow charts" })
      toast({
        title: "Validation Error",
        description: "Content is required for flow charts",
        variant: "destructive",
      })
      return
    }

    try {
      const updateData = {
        content: chart.content,
      }

      console.log("Updating flow chart:", chart.id, updateData)

      const updatedChart = await flowChartsApi.update(chart.id, updateData)

      console.log("Flow chart update response:", updatedChart)

      // Update local state with the response from API
      setFlowCharts(flowCharts.map((c) => (c.id === chart.id ? updatedChart : c)))
      setEditingChart(null)
      setChartValidationErrors({}) // Clear errors on success

      toast({
        title: "Flow chart updated",
        description: "Flow chart has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to update flow chart:", err)
      setChartValidationErrors({ [chart.id]: err instanceof Error ? err.message : "Failed to update flow chart" })
      toast({
        title: "Failed to update flow chart",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle removing a specification - NO REDIRECT
  const handleRemoveSpecification = async (id: string) => {
    try {
      await specificationsApi.remove(id)
      setSpecifications(specifications.filter((spec) => spec.id !== id))
      toast({
        title: "Specification removed",
        description: "Specification has been removed successfully.",
      })
    } catch (err) {
      console.error("Failed to remove specification:", err)
      toast({
        title: "Failed to remove specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle removing a technical specification - NO REDIRECT
  const handleRemoveTechnicalSpec = async (id: number) => {
    try {
      await technicalSpecificationsApi.remove(id)
      setTechnicalSpecs(technicalSpecs.filter((tech) => tech.id !== id))
      toast({
        title: "Technical specification removed",
        description: "Technical specification has been removed successfully.",
      })
    } catch (err) {
      console.error("Failed to remove technical specification:", err)
      toast({
        title: "Failed to remove technical specification",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle removing documentation - NO REDIRECT
  const handleRemoveDocumentation = async (id: string) => {
    try {
      await documentationApi.remove(id)
      setDocumentation(documentation.filter((doc) => doc.id !== id))
      toast({
        title: "Documentation removed",
        description: "Documentation has been removed successfully.",
      })
    } catch (err) {
      console.error("Failed to remove documentation:", err)
      toast({
        title: "Failed to remove documentation",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // Handle removing a flow chart - NO REDIRECT
  const handleRemoveFlowChart = async (id: string) => {
    try {
      await flowChartsApi.remove(id)
      setFlowCharts(flowCharts.filter((chart) => chart.id !== id))
      toast({
        title: "Flow chart removed",
        description: "Flow chart has been removed successfully.",
      })
    } catch (err) {
      console.error("Failed to remove flow chart:", err)
      toast({
        title: "Failed to remove flow chart",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Edit Station</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/stations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
      </div>

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
        {/* Basic Information Card - placed above tabs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">Specifications ({specifications.length})</TabsTrigger>
            <TabsTrigger value="technical">Technical ({technicalSpecs.length})</TabsTrigger>
            <TabsTrigger value="documentation">Documentation ({documentation.length})</TabsTrigger>
            <TabsTrigger value="flowcharts">Flow Charts ({flowCharts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Specifications</h3>
            </div>

            {/* Current Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Specifications ({specifications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {specifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No specifications available</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Suggestions</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specifications.map((spec) => (
                        <>
                          <TableRow key={spec.id}>
                            <TableCell className="font-medium">
                              {editingSpec === spec.id ? (
                                <Input
                                  value={spec.name}
                                  onChange={(e) => {
                                    const updated = specifications.map((s) =>
                                      s.id === spec.id ? { ...s, name: e.target.value } : s,
                                    )
                                    setSpecifications(updated)
                                  }}
                                  className="h-8"
                                />
                              ) : (
                                spec.name
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSpec === spec.id ? (
                                <Select
                                  value={spec.type}
                                  onValueChange={(value) => {
                                    const updated = specifications.map((s) =>
                                      s.id === spec.id ? { ...s, type: value } : s,
                                    )
                                    setSpecifications(updated)
                                  }}
                                >
                                  <SelectTrigger className="h-8">
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
                              ) : (
                                <span className="capitalize text-sm">{spec.type}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSpec === spec.id ? (
                                <Checkbox
                                  checked={spec.isRequired}
                                  onCheckedChange={(checked) => {
                                    const updated = specifications.map((s) =>
                                      s.id === spec.id ? { ...s, isRequired: checked } : s,
                                    )
                                    setSpecifications(updated)
                                  }}
                                />
                              ) : (
                                <span className="text-sm">{spec.isRequired ? "Required" : "Optional"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSpec === spec.id ? (
                                <Checkbox
                                  checked={spec.isActive}
                                  onCheckedChange={(checked) => {
                                    const updated = specifications.map((s) =>
                                      s.id === spec.id ? { ...s, isActive: checked } : s,
                                    )
                                    setSpecifications(updated)
                                  }}
                                />
                              ) : (
                                <span className="text-sm">{spec.isActive ? "Active" : "Inactive"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {spec.suggestions && spec.suggestions.length > 0 ? (
                                <div className="text-sm">{spec.suggestions.join(", ")}</div>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {spec.createdAt ? new Date(spec.createdAt).toLocaleString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {editingSpec === spec.id ? (
                                  <>
                                    <Button size="sm" onClick={() => handleUpdateSpecification(spec)} className="h-8">
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingSpec(null)}
                                      className="h-8"
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingSpec(spec.id)}
                                      className="h-8"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRemoveSpecification(spec.id)}
                                      className="h-8 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          {editingSpec === spec.id && spec.type === "DROPDOWN" && (
                            <TableRow>
                              <TableCell colSpan={7}>
                                <div className="space-y-2 mt-2 p-4 bg-gray-50 rounded-md">
                                  <Label className="text-sm font-medium">Options</Label>
                                  <div className="space-y-2">
                                    {spec.suggestions?.map((option: string, index: number) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...(spec.suggestions || [])]
                                            newOptions[index] = e.target.value
                                            const updated = specifications.map((s) =>
                                              s.id === spec.id ? { ...s, suggestions: newOptions } : s,
                                            )
                                            setSpecifications(updated)
                                          }}
                                          placeholder="Enter option"
                                          className="h-8"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newOptions =
                                              spec.suggestions?.filter((_: any, i: number) => i !== index) || []
                                            const updated = specifications.map((s) =>
                                              s.id === spec.id ? { ...s, suggestions: newOptions } : s,
                                            )
                                            setSpecifications(updated)
                                          }}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = [...(spec.suggestions || []), ""]
                                        const updated = specifications.map((s) =>
                                          s.id === spec.id ? { ...s, suggestions: newOptions } : s,
                                        )
                                        setSpecifications(updated)
                                      }}
                                      className="h-8"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Specification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specName" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="specName"
                      value={newSpecification.name}
                      onChange={(e) => setNewSpecification({ ...newSpecification, name: e.target.value })}
                      placeholder="Enter specification name"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specType" className="text-sm font-medium">
                      Type
                    </Label>
                    <Select
                      value={newSpecification.type}
                      onValueChange={(value) => setNewSpecification({ ...newSpecification, type: value as any })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select type" />
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
                            <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newSpecification.type === "DROPDOWN" && (
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="specOptions" className="text-sm font-medium">
                      Options
                    </Label>
                    <div className="space-y-2">
                      {newSpecification.suggestions?.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(newSpecification.suggestions || [])]
                              newOptions[index] = e.target.value
                              setNewSpecification({ ...newSpecification, suggestions: newOptions })
                            }}
                            placeholder="Enter option"
                            className="h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions =
                                newSpecification.suggestions?.filter((_: any, i: number) => i !== index) || []
                              setNewSpecification({ ...newSpecification, suggestions: newOptions })
                            }}
                            className="h-9 w-9 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...(newSpecification.suggestions || []), ""]
                          setNewSpecification({ ...newSpecification, suggestions: newOptions })
                        }}
                        className="h-9"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="specRequired"
                      checked={newSpecification.isRequired}
                      onCheckedChange={(checked) =>
                        setNewSpecification({ ...newSpecification, isRequired: checked as boolean })
                      }
                    />
                    <Label htmlFor="specRequired" className="text-sm font-medium">
                      Required
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="specActive"
                      checked={newSpecification.isActive}
                      onCheckedChange={(checked) =>
                        setNewSpecification({ ...newSpecification, isActive: checked as boolean })
                      }
                    />
                    <Label htmlFor="specActive" className="text-sm font-medium">
                      Active
                    </Label>
                  </div>
                </div>

                <Button type="button" onClick={handleAddSpecification} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Technical Specifications</h3>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Technical Specifications ({technicalSpecs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {technicalSpecs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No technical specifications available</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {technicalSpecs.map((tech) => (
                        <TableRow key={tech.id}>
                          <TableCell className="font-medium">
                            {editingTech === tech.id ? (
                              <Input
                                value={tech.name}
                                onChange={(e) => {
                                  const updated = technicalSpecs.map((t) =>
                                    t.id === tech.id ? { ...t, name: e.target.value } : t,
                                  )
                                  setTechnicalSpecs(updated)
                                }}
                                className="h-8"
                              />
                            ) : (
                              tech.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTech === tech.id ? (
                              <Input
                                value={tech.value}
                                onChange={(e) => {
                                  const updated = technicalSpecs.map((t) =>
                                    t.id === tech.id ? { ...t, value: e.target.value } : t,
                                  )
                                  setTechnicalSpecs(updated)
                                }}
                                className="h-8"
                              />
                            ) : (
                              tech.value
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {editingTech === tech.id ? (
                                <>
                                  <Button size="sm" onClick={() => handleUpdateTechnicalSpec(tech)} className="h-8">
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingTech(null)}
                                    className="h-8"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingTech(tech.id)}
                                    className="h-8"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemoveTechnicalSpec(tech.id)}
                                    className="h-8 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Technical Specification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="techName" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="techName"
                      value={newTechnicalSpec.name}
                      onChange={(e) => setNewTechnicalSpec({ ...newTechnicalSpec, name: e.target.value })}
                      placeholder="Enter specification name"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="techValue" className="text-sm font-medium">
                      Value *
                    </Label>
                    <Input
                      id="techValue"
                      value={newTechnicalSpec.value}
                      onChange={(e) => setNewTechnicalSpec({ ...newTechnicalSpec, value: e.target.value })}
                      placeholder="Enter specification value"
                      className="h-9"
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleAddTechnicalSpec} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technical Specification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Documentation</h3>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Current Documentation</h4>
              {documentation.length === 0 ? (
                <p className="text-sm text-gray-500">No documentation added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentation.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          {editingDoc === doc.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={doc.content}
                                onChange={(e) => {
                                  const updated = documentation.map((d) =>
                                    d.id === doc.id ? { ...d, content: e.target.value } : d,
                                  )
                                  setDocumentation(updated)
                                  // Clear error when user starts typing
                                  if (docValidationErrors[doc.id]) {
                                    setDocValidationErrors({ ...docValidationErrors, [doc.id]: "" })
                                  }
                                }}
                                rows={2}
                                className={`resize-none ${docValidationErrors[doc.id] ? "border-red-500" : ""}`}
                              />
                              {docValidationErrors[doc.id] && (
                                <p className="text-sm text-red-500">{docValidationErrors[doc.id]}</p>
                              )}
                            </div>
                          ) : (
                            <div className="max-w-xs truncate">{doc.content}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.files && doc.files.length > 0 ? (
                            <div className="space-y-1">
                              {doc.files.map((file: any) => (
                                <div key={file.id}>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    {file.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            "No files"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {editingDoc === doc.id ? (
                              <>
                                <Button size="sm" onClick={() => handleUpdateDocumentation(doc)} className="h-8">
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingDoc(null)} className="h-8">
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingDoc(doc.id)}
                                  className="h-8"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveDocumentation(doc.id)}
                                  className="h-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="border rounded-md p-4 space-y-4 mt-6">
              <h4 className="text-md font-medium">Add New Documentation</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docContent" className="text-sm font-medium">
                    Content *
                  </Label>
                  <Textarea
                    id="docContent"
                    value={newDocumentation.content}
                    onChange={(e) => setNewDocumentation({ ...newDocumentation, content: e.target.value })}
                    placeholder="Enter documentation content"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docFiles" className="text-sm font-medium">
                    Files
                  </Label>
                  <FileUploadField
                    id="docFiles"
                    onChange={(files) => setDocumentationFiles(Array.from(files))}
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    label={""}
                  />
                </div>
              </div>

              <Button type="button" onClick={handleAddDocumentation} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Documentation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="flowcharts" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Flow Charts</h3>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Current Flow Charts</h4>
              {flowCharts.length === 0 ? (
                <p className="text-sm text-gray-500">No flow charts added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flowCharts.map((chart) => (
                      <TableRow key={chart.id}>
                        <TableCell>
                          {editingChart === chart.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={chart.content}
                                onChange={(e) => {
                                  const updated = flowCharts.map((c) =>
                                    c.id === chart.id ? { ...c, content: e.target.value } : c,
                                  )
                                  setFlowCharts(updated)
                                  // Clear error when user starts typing
                                  if (chartValidationErrors[chart.id]) {
                                    setChartValidationErrors({ ...chartValidationErrors, [chart.id]: "" })
                                  }
                                }}
                                rows={2}
                                className={`resize-none ${chartValidationErrors[chart.id] ? "border-red-500" : ""}`}
                              />
                              {chartValidationErrors[chart.id] && (
                                <p className="text-sm text-red-500">{chartValidationErrors[chart.id]}</p>
                              )}
                            </div>
                          ) : (
                            <div className="max-w-xs truncate">{chart.content}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {chart.files && chart.files.length > 0 ? (
                            <div className="space-y-1">
                              {chart.files.map((file: any) => (
                                <div key={file.id}>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    {file.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            "No files"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {editingChart === chart.id ? (
                              <>
                                <Button size="sm" onClick={() => handleUpdateFlowChart(chart)} className="h-8">
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingChart(null)}
                                  className="h-8"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingChart(chart.id)}
                                  className="h-8"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveFlowChart(chart.id)}
                                  className="h-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="border rounded-md p-4 space-y-4 mt-6">
              <h4 className="text-md font-medium">Add New Flow Chart</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chartContent" className="text-sm font-medium">
                    Content *
                  </Label>
                  <Textarea
                    id="chartContent"
                    value={newFlowChart.content}
                    onChange={(e) => setNewFlowChart({ ...newFlowChart, content: e.target.value })}
                    placeholder="Enter flow chart content"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chartFiles" className="text-sm font-medium">
                    Files
                  </Label>
                  <FileUploadField
                    id="chartFiles"
                    onChange={(files) => setFlowChartFiles(Array.from(files))}
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.svg"
                    label={""}
                  />
                </div>
              </div>

              <Button type="button" onClick={handleAddFlowChart} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Flow Chart
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/stations")}
            disabled={isSubmitting}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
            onClick={() => setShouldRedirectAfterUpdate(true)}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Updating..." : "Update Station"}
          </Button>
        </div>
      </form>
    </div>
  )
}
