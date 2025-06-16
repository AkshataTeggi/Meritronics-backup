

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { ChecklistAPI } from "@/lib/checklist"

// interface ChecklistItem {
//   id: string
//   description: string
//   category: string | null
//   required: boolean
//   remarks: string | null
//   isActive: boolean
//   createdBy: string | null
//   sectionId: string
//   createdAt: string
//   updatedAt: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   mpiId: string | null
//   createdAt: string
//   updatedAt: string
//   checklistItems: ChecklistItem[]
// }

// interface ExtendedChecklistItem extends ChecklistItem {
//   sectionName: string
// }

// interface CreateProductChecklistBinderFormProps {
//   onComplete?: (data: any) => void
//   isWizardMode?: boolean
// }

// export default function CreateProductChecklistBinderForm({
//   onComplete,
//   isWizardMode = false,
// }: CreateProductChecklistBinderFormProps) {
//   const router = useRouter()
//   const [checklistSections, setChecklistSections] = useState<ChecklistSection[]>([])
//   const [filteredItems, setFilteredItems] = useState<ExtendedChecklistItem[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
//   const [tempRemarks, setTempRemarks] = useState<string>("")
//   const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

//   useEffect(() => {
//     const fetchChecklistSections = async () => {
//       try {
//         console.log("Fetching checklist sections from API...")

//         const data: ChecklistSection[] = await ChecklistAPI.getAllChecklistSections()
//         console.log("Fetched checklist sections:", data)

//         setChecklistSections(data)

//         // Flatten all checklist items from all sections
//         const allItems: ExtendedChecklistItem[] = data.flatMap((section) =>
//           section.checklistItems.map((item) => ({
//             ...item,
//             sectionName: section.name,
//           })),
//         )

//         console.log("Flattened items:", allItems)
//         setFilteredItems(allItems)
//         setLoading(false)
//       } catch (err) {
//         console.error("Error fetching checklist sections:", err)
//         setError(`Failed to fetch checklist sections: ${err instanceof Error ? err.message : "Unknown error"}`)
//         setLoading(false)
//       }
//     }

//     fetchChecklistSections()
//   }, [])

//   useEffect(() => {
//     const allItems: ExtendedChecklistItem[] = checklistSections.flatMap((section) =>
//       section.checklistItems.map((item) => ({
//         ...item,
//         sectionName: section.name,
//       })),
//     )

//     const filtered = allItems.filter(
//       (item) =>
//         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.remarks && item.remarks.toLowerCase().includes(searchTerm.toLowerCase())),
//     )
//     setFilteredItems(filtered)
//   }, [searchTerm, checklistSections])

//   const handleRequiredChange = async (itemId: string, required: boolean) => {
//     try {
//       setUpdatingItems((prev) => new Set([...prev, itemId]))

//       console.log(`Updating required status for item ${itemId}: ${required}`)

//       // Find the section that contains this item
//       const sectionWithItem = checklistSections.find((section) =>
//         section.checklistItems.some((item) => item.id === itemId),
//       )

//       if (!sectionWithItem) {
//         throw new Error("Section not found for item")
//       }

//       // Update local state immediately (optimistic update)
//       const updatedSections = checklistSections.map((section) => {
//         if (section.id === sectionWithItem.id) {
//           return {
//             ...section,
//             checklistItems: section.checklistItems.map((item) => (item.id === itemId ? { ...item, required } : item)),
//           }
//         }
//         return section
//       })

//       setChecklistSections(updatedSections)

//       // Update filtered items
//       setFilteredItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, required } : item)))

//       // Prepare the updated section data for the API
//       const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
//       if (updatedSection) {
//         // Update backend - send the entire section with updated items
//         await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
//           checklistItems: updatedSection.checklistItems,
//         })
//       }

//       console.log("Successfully updated required status:", itemId, "required:", required)
//     } catch (error) {
//       console.error("Error updating checklist item:", error)

//       // Revert the change if API call fails
//       setFilteredItems((prevItems) =>
//         prevItems.map((item) => (item.id === itemId ? { ...item, required: !required } : item)),
//       )

//       // Revert sections state
//       const revertedSections = checklistSections.map((section) => ({
//         ...section,
//         checklistItems: section.checklistItems.map((item) =>
//           item.id === itemId ? { ...item, required: !required } : item,
//         ),
//       }))
//       setChecklistSections(revertedSections)
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(itemId)
//         return newSet
//       })
//     }
//   }

//   const handleRemarksEdit = (itemId: string, currentRemarks: string | null) => {
//     setEditingRemarks(itemId)
//     setTempRemarks(currentRemarks || "")
//   }

//   const handleRemarksSave = async (itemId: string) => {
//     try {
//       setUpdatingItems((prev) => new Set([...prev, itemId]))

//       console.log(`Updating remarks for item ${itemId}:`, tempRemarks)

//       // Find the section that contains this item
//       const sectionWithItem = checklistSections.find((section) =>
//         section.checklistItems.some((item) => item.id === itemId),
//       )

//       if (!sectionWithItem) {
//         throw new Error("Section not found for item")
//       }

//       // Update local state immediately
//       const updatedSections = checklistSections.map((section) => {
//         if (section.id === sectionWithItem.id) {
//           return {
//             ...section,
//             checklistItems: section.checklistItems.map((item) =>
//               item.id === itemId ? { ...item, remarks: tempRemarks || null } : item,
//             ),
//           }
//         }
//         return section
//       })

//       setChecklistSections(updatedSections)

//       // Update filtered items
//       setFilteredItems((prevItems) =>
//         prevItems.map((item) => (item.id === itemId ? { ...item, remarks: tempRemarks || null } : item)),
//       )

//       // Prepare the updated section data for the API
//       const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
//       if (updatedSection) {
//         // Update backend - send the entire section with updated items
//         await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
//           checklistItems: updatedSection.checklistItems,
//         })
//       }

//       console.log("Successfully updated remarks:", itemId)
//     } catch (error) {
//       console.error("Error updating checklist item remarks:", error)

//       // Revert the change if API call fails
//       const originalItem = filteredItems.find((item) => item.id === itemId)
//       if (originalItem) {
//         setFilteredItems((prevItems) =>
//           prevItems.map((item) => (item.id === itemId ? { ...item, remarks: originalItem.remarks } : item)),
//         )

//         // Revert sections state
//         const revertedSections = checklistSections.map((section) => ({
//           ...section,
//           checklistItems: section.checklistItems.map((item) =>
//             item.id === itemId ? { ...item, remarks: originalItem.remarks } : item,
//           ),
//         }))
//         setChecklistSections(revertedSections)
//       }
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(itemId)
//         return newSet
//       })
//       setEditingRemarks(null)
//       setTempRemarks("")
//     }
//   }

//   const handleRemarksCancel = () => {
//     setEditingRemarks(null)
//     setTempRemarks("")
//   }

//   // Group items by section for display
//   const groupedItems = filteredItems.reduce(
//     (acc, item) => {
//       if (!acc[item.sectionName]) {
//         acc[item.sectionName] = []
//       }
//       acc[item.sectionName].push(item)
//       return acc
//     },
//     {} as { [key: string]: ExtendedChecklistItem[] },
//   )

//   const handlePrevious = () => {
//     if (isWizardMode && onComplete) {
//       // In wizard mode, let the parent handle navigation
//       return
//     }
//     router.push("/dashboard/mpi/change-order/create")
//   }

//   const handleNext = () => {
//     if (isWizardMode && onComplete) {
//       // In wizard mode, call onComplete to proceed to next step
//       onComplete({ checklistSections, filteredItems })
//       return
//     }
//     router.push("/dashboard/mpi/create?step=station-selection")
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         {!isWizardMode && (
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           </div>
//         )}
//         <Card>
//           <CardContent className="flex justify-center items-center py-8">
//             <div className="text-lg">Loading checklist data...</div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         {!isWizardMode && (
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           </div>
//         )}
//         <Card>
//           <CardContent className="flex justify-center items-center py-8">
//             <div className="text-red-500 text-center">
//               <div className="text-lg font-semibold">Error Loading Checklist</div>
//               <div className="text-sm mt-2">{error}</div>
//               <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Navigation - Only show if not in wizard mode */}
//       {!isWizardMode && (
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           <div className="flex items-center space-x-4">
//             <Button variant="outline" size="sm" onClick={handlePrevious}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Previous
//             </Button>
//             <Button onClick={handleNext}>
//               Next
//               <ArrowRight className="h-4 w-4 ml-2" />
//             </Button>
//           </div>
//         </div>
//       )}

//       <Card>
//         <CardContent className="mt-6">
//           {filteredItems.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="text-lg text-gray-500">No checklist items found</div>
//               <div className="text-sm text-gray-400 mt-2">
//                 {searchTerm ? "Try adjusting your search terms" : "No data available from the API"}
//               </div>
//             </div>
//           ) : (
//             <div className="rounded-md border border-gray-300 overflow-x-auto">
//               <Table className="w-full border-collapse">
//                 <TableHeader>
//                   <TableRow className="bg-gray-100 text-center">
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Section
//                     </TableHead>
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Description
//                     </TableHead>
//                     <TableHead colSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Required
//                     </TableHead>
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Remarks
//                     </TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-100 text-center">
//                     <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
//                       Yes
//                     </TableHead>
//                     <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
//                       No
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {Object.entries(groupedItems).map(([sectionName, items]) =>
//                     items.map((item, index) => (
//                       <TableRow key={item.id} className="text-center">
//                         {index === 0 && (
//                           <TableCell
//                             rowSpan={items.length}
//                             className="border border-gray-300 px-4 py-2 align-middle font-medium"
//                           >
//                             {sectionName}
//                           </TableCell>
//                         )}
//                         <TableCell className="border border-gray-300 px-4 py-2">{item.description}</TableCell>
//                         <TableCell
//                           className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
//                             updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                           onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, true)}
//                         >
//                           {item.required ? (
//                             <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
//                               <Check className="h-4 w-4 text-white" />
//                             </div>
//                           ) : (
//                             <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-green-500 transition-colors"></div>
//                           )}
//                         </TableCell>
//                         <TableCell
//                           className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-red-50 transition-colors ${
//                             updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                           onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, false)}
//                         >
//                           {!item.required ? (
//                             <div className="w-6 h-6 bg-red-500 rounded-full mx-auto flex items-center justify-center">
//                               <X className="h-4 w-4 text-white" />
//                             </div>
//                           ) : (
//                             <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-red-500 transition-colors"></div>
//                           )}
//                         </TableCell>
//                         <TableCell className="border border-gray-300 px-2 py-2">
//                           {editingRemarks === item.id ? (
//                             <div className="flex items-center space-x-2">
//                               <Input
//                                 value={tempRemarks}
//                                 onChange={(e) => setTempRemarks(e.target.value)}
//                                 className="min-w-[200px]"
//                                 placeholder="Enter remarks..."
//                                 onKeyDown={(e) => {
//                                   if (e.key === "Enter") {
//                                     handleRemarksSave(item.id)
//                                   } else if (e.key === "Escape") {
//                                     handleRemarksCancel()
//                                   }
//                                 }}
//                                 autoFocus
//                                 disabled={updatingItems.has(item.id)}
//                               />
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleRemarksSave(item.id)}
//                                 disabled={updatingItems.has(item.id)}
//                               >
//                                 <Check className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={handleRemarksCancel}
//                                 disabled={updatingItems.has(item.id)}
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <div
//                               className="cursor-pointer hover:bg-gray-50 p-2 rounded min-h-[40px] flex items-center justify-center"
//                               onClick={() => handleRemarksEdit(item.id, item.remarks)}
//                             >
//                               {item.remarks ? (
//                                 <span className="text-sm">{item.remarks}</span>
//                               ) : (
//                                 <span className="italic text-gray-400 text-sm">Click to add remarks</span>
//                               )}
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     )),
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Bottom Actions - Only show if not in wizard mode */}
//       {!isWizardMode && (
//         <div className="flex justify-between">
//           <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
//             Cancel
//           </Button>
//           <Button onClick={handleNext}>Continue to Station Selection</Button>
//         </div>
//       )}
//     </div>
//   )
// }























// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { ChecklistAPI } from "@/lib/checklist"

// interface ChecklistItem {
//   id: string
//   description: string
//   category: string | null
//   required: boolean
//   remarks: string | null
//   isActive: boolean
//   createdBy: string | null
//   sectionId: string
//   createdAt: string
//   updatedAt: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   mpiId: string | null
//   createdAt: string
//   updatedAt: string
//   checklistItems: ChecklistItem[]
// }

// interface ExtendedChecklistItem extends ChecklistItem {
//   sectionName: string
// }

// interface CreateProductChecklistBinderFormProps {
//   onComplete?: (data: any) => void
//   isWizardMode?: boolean
// }

// export default function CreateProductChecklistBinderForm({
//   onComplete,
//   isWizardMode = false,
// }: CreateProductChecklistBinderFormProps) {
//   const router = useRouter()
//   const [checklistSections, setChecklistSections] = useState<ChecklistSection[]>([])
//   const [filteredItems, setFilteredItems] = useState<ExtendedChecklistItem[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
//   const [tempRemarks, setTempRemarks] = useState<string>("")
//   const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     const fetchChecklistSections = async () => {
//       try {
//         console.log("Fetching checklist sections from API...")

//         const data: ChecklistSection[] = await ChecklistAPI.getAllChecklistSections()
//         console.log("Fetched checklist sections:", data)

//         setChecklistSections(data)

//         // Flatten all checklist items from all sections
//         const allItems: ExtendedChecklistItem[] = data.flatMap((section) =>
//           section.checklistItems.map((item) => ({
//             ...item,
//             sectionName: section.name,
//           })),
//         )

//         console.log("Flattened items:", allItems)
//         setFilteredItems(allItems)
//         setLoading(false)
//       } catch (err) {
//         console.error("Error fetching checklist sections:", err)
//         setError(`Failed to fetch checklist sections: ${err instanceof Error ? err.message : "Unknown error"}`)
//         setLoading(false)
//       }
//     }

//     fetchChecklistSections()
//   }, [])

//   useEffect(() => {
//     const allItems: ExtendedChecklistItem[] = checklistSections.flatMap((section) =>
//       section.checklistItems.map((item) => ({
//         ...item,
//         sectionName: section.name,
//       })),
//     )

//     const filtered = allItems.filter(
//       (item) =>
//         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.remarks && item.remarks.toLowerCase().includes(searchTerm.toLowerCase())),
//     )
//     setFilteredItems(filtered)
//   }, [searchTerm, checklistSections])

//   const handleRequiredChange = async (itemId: string, required: boolean) => {
//     try {
//       setUpdatingItems((prev) => new Set([...prev, itemId]))

//       console.log(`Updating required status for item ${itemId}: ${required}`)

//       // Find the section that contains this item
//       const sectionWithItem = checklistSections.find((section) =>
//         section.checklistItems.some((item) => item.id === itemId),
//       )

//       if (!sectionWithItem) {
//         throw new Error("Section not found for item")
//       }

//       // Update local state immediately (optimistic update)
//       const updatedSections = checklistSections.map((section) => {
//         if (section.id === sectionWithItem.id) {
//           return {
//             ...section,
//             checklistItems: section.checklistItems.map((item) => (item.id === itemId ? { ...item, required } : item)),
//           }
//         }
//         return section
//       })

//       setChecklistSections(updatedSections)

//       // Update filtered items
//       setFilteredItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, required } : item)))

//       // Prepare the updated section data for the API
//       const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
//       if (updatedSection) {
//         // Update backend - send the entire section with updated items
//         await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
//           checklistItems: updatedSection.checklistItems,
//         })
//       }

//       console.log("Successfully updated required status:", itemId, "required:", required)
//     } catch (error) {
//       console.error("Error updating checklist item:", error)

//       // Revert the change if API call fails
//       setFilteredItems((prevItems) =>
//         prevItems.map((item) => (item.id === itemId ? { ...item, required: !required } : item)),
//       )

//       // Revert sections state
//       const revertedSections = checklistSections.map((section) => ({
//         ...section,
//         checklistItems: section.checklistItems.map((item) =>
//           item.id === itemId ? { ...item, required: !required } : item,
//         ),
//       }))
//       setChecklistSections(revertedSections)
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(itemId)
//         return newSet
//       })
//     }
//   }

//   const handleRemarksEdit = (itemId: string, currentRemarks: string | null) => {
//     setEditingRemarks(itemId)
//     setTempRemarks(currentRemarks || "")
//   }

//   const handleRemarksSave = async (itemId: string) => {
//     try {
//       setUpdatingItems((prev) => new Set([...prev, itemId]))

//       console.log(`Updating remarks for item ${itemId}:`, tempRemarks)

//       // Find the section that contains this item
//       const sectionWithItem = checklistSections.find((section) =>
//         section.checklistItems.some((item) => item.id === itemId),
//       )

//       if (!sectionWithItem) {
//         throw new Error("Section not found for item")
//       }

//       // Update local state immediately
//       const updatedSections = checklistSections.map((section) => {
//         if (section.id === sectionWithItem.id) {
//           return {
//             ...section,
//             checklistItems: section.checklistItems.map((item) =>
//               item.id === itemId ? { ...item, remarks: tempRemarks || null } : item,
//             ),
//           }
//         }
//         return section
//       })

//       setChecklistSections(updatedSections)

//       // Update filtered items
//       setFilteredItems((prevItems) =>
//         prevItems.map((item) => (item.id === itemId ? { ...item, remarks: tempRemarks || null } : item)),
//       )

//       // Prepare the updated section data for the API
//       const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
//       if (updatedSection) {
//         // Update backend - send the entire section with updated items
//         await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
//           checklistItems: updatedSection.checklistItems,
//         })
//       }

//       console.log("Successfully updated remarks:", itemId)
//     } catch (error) {
//       console.error("Error updating checklist item remarks:", error)

//       // Revert the change if API call fails
//       const originalItem = filteredItems.find((item) => item.id === itemId)
//       if (originalItem) {
//         setFilteredItems((prevItems) =>
//           prevItems.map((item) => (item.id === itemId ? { ...item, remarks: originalItem.remarks } : item)),
//         )

//         // Revert sections state
//         const revertedSections = checklistSections.map((section) => ({
//           ...section,
//           checklistItems: section.checklistItems.map((item) =>
//             item.id === itemId ? { ...item, remarks: originalItem.remarks } : item,
//           ),
//         }))
//         setChecklistSections(revertedSections)
//       }
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(itemId)
//         return newSet
//       })
//       setEditingRemarks(null)
//       setTempRemarks("")
//     }
//   }

//   const handleRemarksCancel = () => {
//     setEditingRemarks(null)
//     setTempRemarks("")
//   }

//   // Group items by section for display
//   const groupedItems = filteredItems.reduce(
//     (acc, item) => {
//       if (!acc[item.sectionName]) {
//         acc[item.sectionName] = []
//       }
//       acc[item.sectionName].push(item)
//       return acc
//     },
//     {} as { [key: string]: ExtendedChecklistItem[] },
//   )

//   const handlePrevious = () => {
//     if (isWizardMode && onComplete) {
//       // In wizard mode, let the parent handle navigation
//       return
//     }
//     router.push("/dashboard/mpi/change-order/create")
//   }

//   const handleSaveAndContinue = async () => {
//     try {
//       setIsSaving(true)

//       // Save all modified checklist data
//       console.log("Saving checklist data before proceeding...")

//       // You can add additional validation here if needed
//       const hasModifications = checklistSections.some((section) =>
//         section.checklistItems.some((item) => item.required || item.remarks),
//       )

//       if (hasModifications) {
//         // Save each modified section
//         for (const section of checklistSections) {
//           const modifiedItems = section.checklistItems.filter((item) => item.required || item.remarks)

//           if (modifiedItems.length > 0) {
//             await ChecklistAPI.updateChecklistSection(section.id, {
//               checklistItems: section.checklistItems,
//             })
//           }
//         }

//         console.log("Successfully saved all checklist modifications")
//       }

//       // Proceed to next step
//       if (isWizardMode && onComplete) {
//         // In wizard mode, call onComplete to proceed to next step
//         onComplete({
//           checklistSections,
//           filteredItems,
//           savedAt: new Date().toISOString(),
//         })
//       } else {
//         router.push("/dashboard/mpi/create?step=station-selection")
//       }
//     } catch (error) {
//       console.error("Error saving checklist data:", error)
//       setError("Failed to save checklist data. Please try again.")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleNext = () => {
//     handleSaveAndContinue()
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         {!isWizardMode && (
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           </div>
//         )}
//         <Card>
//           <CardContent className="flex justify-center items-center py-8">
//             <div className="text-lg">Loading checklist data...</div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         {!isWizardMode && (
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           </div>
//         )}
//         <Card>
//           <CardContent className="flex justify-center items-center py-8">
//             <div className="text-red-500 text-center">
//               <div className="text-lg font-semibold">Error Loading Checklist</div>
//               <div className="text-sm mt-2">{error}</div>
//               <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Navigation - Only show if not in wizard mode */}
//       {!isWizardMode && (
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
//           <div className="flex items-center space-x-4">
//             <Button variant="outline" size="sm" onClick={handlePrevious}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Previous
//             </Button>
//             <Button onClick={handleSaveAndContinue} disabled={isSaving}>
//               {isSaving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   Save & Continue
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       <Card>
//         <CardContent className="mt-6">
//           {filteredItems.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="text-lg text-gray-500">No checklist items found</div>
//               <div className="text-sm text-gray-400 mt-2">
//                 {searchTerm ? "Try adjusting your search terms" : "No data available from the API"}
//               </div>
//             </div>
//           ) : (
//             <div className="rounded-md border border-gray-300 overflow-x-auto">
//               <Table className="w-full border-collapse">
//                 <TableHeader>
//                   <TableRow className="bg-gray-100 text-center">
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Section
//                     </TableHead>
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Description
//                     </TableHead>
//                     <TableHead colSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Required
//                     </TableHead>
//                     <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
//                       Remarks
//                     </TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-100 text-center">
//                     <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
//                       Yes
//                     </TableHead>
//                     <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
//                       No
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {Object.entries(groupedItems).map(([sectionName, items]) =>
//                     items.map((item, index) => (
//                       <TableRow key={item.id} className="text-center">
//                         {index === 0 && (
//                           <TableCell
//                             rowSpan={items.length}
//                             className="border border-gray-300 px-4 py-2 align-middle font-medium"
//                           >
//                             {sectionName}
//                           </TableCell>
//                         )}
//                         <TableCell className="border border-gray-300 px-4 py-2">{item.description}</TableCell>
//                         <TableCell
//                           className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
//                             updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                           onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, true)}
//                         >
//                           {item.required ? (
//                             <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
//                               <Check className="h-4 w-4 text-white" />
//                             </div>
//                           ) : (
//                             <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-green-500 transition-colors"></div>
//                           )}
//                         </TableCell>
//                         <TableCell
//                           className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-red-50 transition-colors ${
//                             updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                           onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, false)}
//                         >
//                           {!item.required ? (
//                             <div className="w-6 h-6 bg-red-500 rounded-full mx-auto flex items-center justify-center">
//                               <X className="h-4 w-4 text-white" />
//                             </div>
//                           ) : (
//                             <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-red-500 transition-colors"></div>
//                           )}
//                         </TableCell>
//                         <TableCell className="border border-gray-300 px-2 py-2">
//                           {editingRemarks === item.id ? (
//                             <div className="flex items-center space-x-2">
//                               <Input
//                                 value={tempRemarks}
//                                 onChange={(e) => setTempRemarks(e.target.value)}
//                                 className="min-w-[200px]"
//                                 placeholder="Enter remarks..."
//                                 onKeyDown={(e) => {
//                                   if (e.key === "Enter") {
//                                     handleRemarksSave(item.id)
//                                   } else if (e.key === "Escape") {
//                                     handleRemarksCancel()
//                                   }
//                                 }}
//                                 autoFocus
//                                 disabled={updatingItems.has(item.id)}
//                               />
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleRemarksSave(item.id)}
//                                 disabled={updatingItems.has(item.id)}
//                               >
//                                 <Check className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={handleRemarksCancel}
//                                 disabled={updatingItems.has(item.id)}
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <div
//                               className="cursor-pointer hover:bg-gray-50 p-2 rounded min-h-[40px] flex items-center justify-center"
//                               onClick={() => handleRemarksEdit(item.id, item.remarks)}
//                             >
//                               {item.remarks ? (
//                                 <span className="text-sm">{item.remarks}</span>
//                               ) : (
//                                 <span className="italic text-gray-400 text-sm">Click to add remarks</span>
//                               )}
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     )),
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Bottom Actions - Only show if not in wizard mode */}
//       {!isWizardMode && (
//         <div className="flex justify-between">
//           <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
//             Cancel
//           </Button>
//           <Button onClick={handleSaveAndContinue} disabled={isSaving}>
//             {isSaving ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                 Saving & Continuing...
//               </>
//             ) : (
//               "Save & Continue to Station Selection"
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }























"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Check, X, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChecklistAPI } from "@/lib/checklist"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChecklistItem {
  id: string
  description: string
  category: string | null
  required: boolean
  remarks: string | null
  isActive: boolean
  createdBy: string | null
  sectionId: string
  createdAt: string
  updatedAt: string
}

interface ChecklistSection {
  id: string
  name: string
  mpiId: string | null
  createdAt: string
  updatedAt: string
  checklistItems: ChecklistItem[]
}

interface ExtendedChecklistItem extends ChecklistItem {
  sectionName: string
}

interface CreateProductChecklistBinderFormProps {
  onComplete?: (data: any) => void
  isWizardMode?: boolean
}

export default function CreateProductChecklistBinderForm({
  onComplete,
  isWizardMode = false,
}: CreateProductChecklistBinderFormProps) {
  const router = useRouter()
  const [checklistSections, setChecklistSections] = useState<ChecklistSection[]>([])
  const [filteredItems, setFilteredItems] = useState<ExtendedChecklistItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
  const [tempRemarks, setTempRemarks] = useState<string>("")
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChecklistSections = async () => {
      try {
        console.log("Fetching checklist sections from API...")

        const data: ChecklistSection[] = await ChecklistAPI.getAllChecklistSections()
        console.log("Fetched checklist sections:", data)

        setChecklistSections(data)

        // Flatten all checklist items from all sections
        const allItems: ExtendedChecklistItem[] = data.flatMap((section) =>
          section.checklistItems.map((item) => ({
            ...item,
            sectionName: section.name,
          })),
        )

        console.log("Flattened items:", allItems)
        setFilteredItems(allItems)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching checklist sections:", err)
        setError(`Failed to fetch checklist sections: ${err instanceof Error ? err.message : "Unknown error"}`)
        setLoading(false)
      }
    }

    fetchChecklistSections()
  }, [])

  useEffect(() => {
    const allItems: ExtendedChecklistItem[] = checklistSections.flatMap((section) =>
      section.checklistItems.map((item) => ({
        ...item,
        sectionName: section.name,
      })),
    )

    const filtered = allItems.filter(
      (item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredItems(filtered)
  }, [searchTerm, checklistSections])

  const handleRequiredChange = async (itemId: string, required: boolean) => {
    try {
      setUpdatingItems((prev) => new Set([...prev, itemId]))

      console.log(`Updating required status for item ${itemId}: ${required}`)

      // Find the section that contains this item
      const sectionWithItem = checklistSections.find((section) =>
        section.checklistItems.some((item) => item.id === itemId),
      )

      if (!sectionWithItem) {
        throw new Error("Section not found for item")
      }

      // Update local state immediately (optimistic update)
      const updatedSections = checklistSections.map((section) => {
        if (section.id === sectionWithItem.id) {
          return {
            ...section,
            checklistItems: section.checklistItems.map((item) => (item.id === itemId ? { ...item, required } : item)),
          }
        }
        return section
      })

      setChecklistSections(updatedSections)

      // Update filtered items
      setFilteredItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, required } : item)))

      // Prepare the updated section data for the API
      const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
      if (updatedSection) {
        // Update backend - send the entire section with updated items
        await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
          checklistItems: updatedSection.checklistItems,
        })
      }

      console.log("Successfully updated required status:", itemId, "required:", required)
    } catch (error) {
      console.error("Error updating checklist item:", error)

      // Revert the change if API call fails
      setFilteredItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, required: !required } : item)),
      )

      // Revert sections state
      const revertedSections = checklistSections.map((section) => ({
        ...section,
        checklistItems: section.checklistItems.map((item) =>
          item.id === itemId ? { ...item, required: !required } : item,
        ),
      }))
      setChecklistSections(revertedSections)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemarksEdit = (itemId: string, currentRemarks: string | null) => {
    setEditingRemarks(itemId)
    setTempRemarks(currentRemarks || "")
  }

  const handleRemarksSave = async (itemId: string) => {
    try {
      setUpdatingItems((prev) => new Set([...prev, itemId]))

      console.log(`Updating remarks for item ${itemId}:`, tempRemarks)

      // Find the section that contains this item
      const sectionWithItem = checklistSections.find((section) =>
        section.checklistItems.some((item) => item.id === itemId),
      )

      if (!sectionWithItem) {
        throw new Error("Section not found for item")
      }

      // Update local state immediately
      const updatedSections = checklistSections.map((section) => {
        if (section.id === sectionWithItem.id) {
          return {
            ...section,
            checklistItems: section.checklistItems.map((item) =>
              item.id === itemId ? { ...item, remarks: tempRemarks || null } : item,
            ),
          }
        }
        return section
      })

      setChecklistSections(updatedSections)

      // Update filtered items
      setFilteredItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, remarks: tempRemarks || null } : item)),
      )

      // Prepare the updated section data for the API
      const updatedSection = updatedSections.find((section) => section.id === sectionWithItem.id)
      if (updatedSection) {
        // Update backend - send the entire section with updated items
        await ChecklistAPI.updateChecklistSection(sectionWithItem.id, {
          checklistItems: updatedSection.checklistItems,
        })
      }

      console.log("Successfully updated remarks:", itemId)
    } catch (error) {
      console.error("Error updating checklist item remarks:", error)

      // Revert the change if API call fails
      const originalItem = filteredItems.find((item) => item.id === itemId)
      if (originalItem) {
        setFilteredItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, remarks: originalItem.remarks } : item)),
        )

        // Revert sections state
        const revertedSections = checklistSections.map((section) => ({
          ...section,
          checklistItems: section.checklistItems.map((item) =>
            item.id === itemId ? { ...item, remarks: originalItem.remarks } : item,
          ),
        }))
        setChecklistSections(revertedSections)
      }
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
      setEditingRemarks(null)
      setTempRemarks("")
    }
  }

  const handleRemarksCancel = () => {
    setEditingRemarks(null)
    setTempRemarks("")
  }

  // Group items by section for display
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.sectionName]) {
        acc[item.sectionName] = []
      }
      acc[item.sectionName].push(item)
      return acc
    },
    {} as { [key: string]: ExtendedChecklistItem[] },
  )

  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      console.log("Saving checklist data...")

      // Prepare the data to save
      const checklistData = {
        sections: checklistSections,
        items: filteredItems,
        lastModified: new Date().toISOString(),
      }

      if (isWizardMode && onComplete) {
        // In wizard mode, pass data to parent for creation
        onComplete(checklistData)
      } else {
        // Save to localStorage as fallback for non-wizard mode
        localStorage.setItem("product-checklist-binder-draft", JSON.stringify(checklistData))
        handleNext()
      }
    } catch (error) {
      console.error("Error saving checklist data:", error)
      setSaveError("Failed to save checklist data. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrevious = () => {
    if (isWizardMode && onComplete) {
      // In wizard mode, let the parent handle navigation
      return
    }
    router.push("/dashboard/mpi/change-order/create")
  }

  const handleNext = () => {
    if (isWizardMode && onComplete) {
      // In wizard mode, call onComplete to proceed to next step
      onComplete({ checklistSections, filteredItems })
      return
    }
    router.push("/dashboard/mpi/create?step=station-selection")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {!isWizardMode && (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
          </div>
        )}
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <div className="text-lg">Loading checklist data...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {!isWizardMode && (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
          </div>
        )}
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <div className="text-red-500 text-center">
              <div className="text-lg font-semibold">Error Loading Checklist</div>
              <div className="text-sm mt-2">{error}</div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation - Only show if not in wizard mode */}
      {!isWizardMode && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Checklist Binder</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-500">No checklist items found</div>
              <div className="text-sm text-gray-400 mt-2">
                {searchTerm ? "Try adjusting your search terms" : "No data available from the API"}
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-gray-300 overflow-x-auto">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100 text-center">
                    <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
                      Section
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
                      Description
                    </TableHead>
                    <TableHead colSpan={2} className="border border-gray-300 px-4 py-2 text-center">
                      Required
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-gray-300 px-4 py-2 text-center">
                      Remarks
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-100 text-center">
                    <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
                      Yes
                    </TableHead>
                    <TableHead className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200">
                      No
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Object.entries(groupedItems).map(([sectionName, items]) =>
                    items.map((item, index) => (
                      <TableRow key={item.id} className="text-center">
                        {index === 0 && (
                          <TableCell
                            rowSpan={items.length}
                            className="border border-gray-300 px-4 py-2 align-middle font-medium"
                          >
                            {sectionName}
                          </TableCell>
                        )}
                        <TableCell className="border border-gray-300 px-4 py-2">{item.description}</TableCell>
                        <TableCell
                          className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                            updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, true)}
                        >
                          {item.required ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-green-500 transition-colors"></div>
                          )}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-red-50 transition-colors ${
                            updatingItems.has(item.id) ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => !updatingItems.has(item.id) && handleRequiredChange(item.id, false)}
                        >
                          {!item.required ? (
                            <div className="w-6 h-6 bg-red-500 rounded-full mx-auto flex items-center justify-center">
                              <X className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto hover:border-red-500 transition-colors"></div>
                          )}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-2 py-2">
                          {editingRemarks === item.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={tempRemarks}
                                onChange={(e) => setTempRemarks(e.target.value)}
                                className="min-w-[200px]"
                                placeholder="Enter remarks..."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRemarksSave(item.id)
                                  } else if (e.key === "Escape") {
                                    handleRemarksCancel()
                                  }
                                }}
                                autoFocus
                                disabled={updatingItems.has(item.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleRemarksSave(item.id)}
                                disabled={updatingItems.has(item.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleRemarksCancel}
                                disabled={updatingItems.has(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-gray-50 p-2 rounded min-h-[40px] flex items-center justify-center"
                              onClick={() => handleRemarksEdit(item.id, item.remarks)}
                            >
                              {item.remarks ? (
                                <span className="text-sm">{item.remarks}</span>
                              ) : (
                                <span className="italic text-gray-400 text-sm">Click to add remarks</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveAndContinue} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save & Continue"}
          </Button>
          <Button onClick={handleNext}>
            Continue to Station Selection
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Save Error Alert */}
      {saveError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
