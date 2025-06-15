// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { Loader2, Save, ArrowLeft, Upload, FileText } from "lucide-react"
// import { useChangeOrderEnums } from "@/hooks/use-change-order-enums"
// import { changeOrderApi } from "@/lib/change-order"
// import { CreateChangeOrderDto } from "@/types/mpi"

// export function CreateChangeOrderForm() {
//   const router = useRouter()
//   const {
//     loading: enumsLoading,
//     error: enumsError,
//     getOrderTypeOptions,
//     getLocationTypeOptions,
//     getAttachmentTypeOptions,
//     getFileActionOptions,
//     getDocumentAttachmentOptions,
//   } = useChangeOrderEnums()

//   const [formData, setFormData] = useState<CreateChangeOrderDto>({
//     orderType: "",
//     location: "",
//     distributionDate: "",
//     requiredBy: "",
//     internalOrderNumber: "",
//     customer: "",
//     assemblyNumber: "",
//     revision: "",
//     description: "",
//     enumAttachmentType: "",
//     fileActions: [],
//     documentAttachments: [],
//     markComplete: false,
//   })

//   const [currentStep, setCurrentStep] = useState(1)
//   const totalSteps = 5 // Assuming this is part of a 5-step wizard

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       // Navigate to previous step in the MPI creation wizard
//       router.push(`/dashboard/mpi/create?step=${currentStep - 1}`)
//     }
//   }

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       // Navigate to next step in the MPI creation wizard
//       router.push(`/dashboard/mpi/create?step=${currentStep + 1}`)
//     }
//   }

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const step = searchParams.get("step")
//     if (step) {
//       setCurrentStep(Number.parseInt(step))
//     }
//   }, [searchParams])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (
//       !formData.orderType ||
//       !formData.location ||
//       !formData.internalOrderNumber ||
//       !formData.customer ||
//       !formData.assemblyNumber ||
//       !formData.revision ||
//       !formData.enumAttachmentType
//     ) {
//       setError("Please fill in all required fields")
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)

//       // Format dates properly for API
//       const submitData = {
//         ...formData,
//         distributionDate: formData.distributionDate ? new Date(formData.distributionDate).toISOString() : undefined,
//         requiredBy: formData.requiredBy ? new Date(formData.requiredBy).toISOString() : undefined,
//       }

//       await changeOrderApi.create(submitData)
//       router.push("/dashboard/mpi/change-order")
//     } catch (err) {
//       console.error("Error creating change order:", err)
//       setError("Failed to create change order. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDocumentAttachmentChange = (attachment: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       documentAttachments: checked
//         ? [...prev.documentAttachments, attachment]
//         : prev.documentAttachments.filter((doc) => doc !== attachment),
//     }))
//   }

//   const handleFileActionChange = (action: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       fileActions: checked ? [...prev.fileActions, action] : prev.fileActions.filter((fa) => fa !== action),
//     }))
//   }

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setUploadedFiles(Array.from(e.target.files))
//     }
//   }

//   if (enumsLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading form options...</span>
//       </div>
//     )
//   }

//   if (enumsError) {
//     return (
//       <Alert variant="destructive">
//         <AlertDescription>{enumsError}</AlertDescription>
//       </Alert>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between mb-6">
//         <Button variant="outline" onClick={() => router.back()}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </Button>

//         <h1 className="text-3xl font-bold">Customer New / Change Order</h1>

//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handlePrevious} disabled={currentStep <= 1}>
//             Previous
//           </Button>
//           <Button onClick={handleNext} disabled={currentStep >= totalSteps}>
//             Next
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="form" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="form" className="flex items-center gap-2">
//             <FileText className="h-4 w-4" />
//             Fill Form
//           </TabsTrigger>
//           <TabsTrigger value="upload" className="flex items-center gap-2">
//             <Upload className="h-4 w-4" />
//             Upload Documents
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="form">
//           <Card>
//             <CardContent className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}

//                 {/* Order Type and Location Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   {/* Order Type */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Order Type</h3>
//                     <div className="grid grid-cols-1 gap-3">
//                       {getOrderTypeOptions().map((option) => (
//                         <div key={option.value} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={`order-${option.value}`}
//                             checked={formData.orderType === option.value}
//                             onCheckedChange={(checked) => {
//                               if (checked) {
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   orderType: option.value as any,
//                                 }))
//                               }
//                             }}
//                           />
//                           <Label htmlFor={`order-${option.value}`} className="text-sm">
//                             {option.label}
//                           </Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Location */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Location</h3>
//                     <RadioGroup
//                       value={formData.location}
//                       onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
//                       className="space-y-3"
//                     >
//                       {getLocationTypeOptions().map((option) => (
//                         <div key={option.value} className="flex items-center space-x-2">
//                           <RadioGroupItem value={option.value} id={`location-${option.value}`} />
//                           <Label htmlFor={`location-${option.value}`}>{option.label}</Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Date and Order Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Order Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="distributionDate">Distribution Date</Label>
//                       <Input
//                         id="distributionDate"
//                         type="date"
//                         value={formData.distributionDate ? formData.distributionDate.split("T")[0] : ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             distributionDate: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="requiredBy">Required By</Label>
//                       <Input
//                         id="requiredBy"
//                         type="date"
//                         value={formData.requiredBy ? formData.requiredBy.split("T")[0] : ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             requiredBy: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="internalOrderNumber">Internal Order Number *</Label>
//                       <Input
//                         id="internalOrderNumber"
//                         value={formData.internalOrderNumber}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             internalOrderNumber: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter internal order number"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Customer and Assembly Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Customer & Assembly Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="customer">Customer *</Label>
//                       <Input
//                         id="customer"
//                         value={formData.customer}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             customer: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter customer name"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="assemblyNumber">Assembly Number *</Label>
//                       <Input
//                         id="assemblyNumber"
//                         value={formData.assemblyNumber}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             assemblyNumber: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter assembly number"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="revision">Revision *</Label>
//                       <Input
//                         id="revision"
//                         value={formData.revision}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             revision: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter revision"
//                       />
//                     </div>

//                     <div className="space-y-2 md:col-span-2">
//                       <Label htmlFor="description">Description *</Label>
//                       <Textarea
//                         id="description"
//                         value={formData.description || ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             description: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter description"
//                         rows={3}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="applicableJobId">Applicable Job ID</Label>
//                       <Input
//                         id="applicableJobId"
//                         value={formData.applicableJobId || ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             applicableJobId: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter job ID"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Additional Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Additional Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="enumAttachmentType">Attachment Type *</Label>
//                       <Select
//                         value={formData.enumAttachmentType}
//                         onValueChange={(value) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             enumAttachmentType: value as any,
//                           }))
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select attachment type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {getAttachmentTypeOptions().map((option) => (
//                             <SelectItem key={option.value} value={option.value}>
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="customerEcoNumber">Customer ECO Number</Label>
//                       <Input
//                         id="customerEcoNumber"
//                         value={formData.customerEcoNumber || ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             customerEcoNumber: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter ECO number"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="briefDescription">Brief Description</Label>
//                       <Textarea
//                         id="briefDescription"
//                         value={formData.briefDescription || ""}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             briefDescription: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter brief description"
//                         rows={2}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="notes">Notes</Label>
//                       <Textarea
//                         id="notes"
//                         value={formData.notes || ""}
//                         onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
//                         placeholder="Enter notes"
//                         rows={2}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Document Attachments and File Actions */}
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Document Attachments</h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                       {getDocumentAttachmentOptions().map((option) => (
//                         <div key={option.value} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={`doc-${option.value}`}
//                             checked={formData.documentAttachments.includes(option.value as any)}
//                             onCheckedChange={(checked) =>
//                               handleDocumentAttachmentChange(option.value, checked as boolean)
//                             }
//                           />
//                           <Label htmlFor={`doc-${option.value}`} className="text-sm">
//                             {option.label}
//                           </Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">File Actions</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {getFileActionOptions().map((option) => (
//                         <div key={option.value} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={`file-${option.value}`}
//                             checked={formData.fileActions.includes(option.value as any)}
//                             onCheckedChange={(checked) => handleFileActionChange(option.value, checked as boolean)}
//                           />
//                           <Label htmlFor={`file-${option.value}`} className="text-sm">
//                             {option.label}
//                           </Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Submit Buttons */}
//                 <div className="flex justify-end gap-4 pt-6">
//                   <Button type="button" variant="outline" onClick={() => router.back()}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4 mr-2" />
//                         Create Change Order
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="upload">
//           <Card>
//             <CardContent className="space-y-6 mt-6">
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                 <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                 <div className="space-y-2">
//                   <Label htmlFor="file-upload" className="text-lg font-medium cursor-pointer">
//                     Click to upload files or drag and drop
//                   </Label>
//                   <p className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX up to 10MB each</p>
//                 </div>
//                 <Input
//                   id="file-upload"
//                   type="file"
//                   multiple
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx,.xls,.xlsx"
//                 />
//               </div>

//               {uploadedFiles.length > 0 && (
//                 <div className="space-y-2">
//                   <h4 className="font-medium">Uploaded Files:</h4>
//                   <div className="space-y-2">
//                     {uploadedFiles.map((file, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">{file.name}</span>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


















"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, ArrowLeft, Upload, FileText, ArrowRight } from "lucide-react"
import { useChangeOrderEnums } from "@/hooks/use-change-order-enums"
import { changeOrderApi } from "@/lib/change-order"
import { CreateChangeOrderDto } from "@/types/mpi"

interface CreateChangeOrderFormProps {
  onComplete?: (data: any) => void
  isWizardMode?: boolean
}

export function CreateChangeOrderForm({ onComplete, isWizardMode = false }: CreateChangeOrderFormProps) {
  const router = useRouter()
  const {
    loading: enumsLoading,
    error: enumsError,
    getOrderTypeOptions,
    getLocationTypeOptions,
    getAttachmentTypeOptions,
    getFileActionOptions,
    getDocumentAttachmentOptions,
  } = useChangeOrderEnums()

  const [formData, setFormData] = useState<CreateChangeOrderDto>({
    orderType: "",
    location: "",
    distributionDate: "",
    requiredBy: "",
    internalOrderNumber: "",
    customer: "",
    assemblyNumber: "",
    revision: "",
    description: "",
    enumAttachmentType: "",
    fileActions: [],
    documentAttachments: [],
    markComplete: false,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5 // Assuming this is part of a 5-step wizard

  const handlePrevious = () => {
    if (isWizardMode && onComplete) {
      // In wizard mode, let the parent handle navigation
      return
    }
    // Navigate back to the main MPI page or previous step
    router.push("/dashboard/mpi")
  }

  const handleNext = () => {
    if (isWizardMode && onComplete) {
      // In wizard mode, call onComplete to proceed to next step
      onComplete(formData)
      return
    }
    // Navigate to the product checklist binder step
    router.push("/dashboard/mpi/product-checklist-binder")
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const searchParams = useSearchParams()

  useEffect(() => {
    const step = searchParams.get("step")
    if (step) {
      setCurrentStep(Number.parseInt(step))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.orderType ||
      !formData.location ||
      !formData.internalOrderNumber ||
      !formData.customer ||
      !formData.assemblyNumber ||
      !formData.revision ||
      !formData.enumAttachmentType
    ) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Format dates properly for API
      const submitData = {
        ...formData,
        distributionDate: formData.distributionDate ? new Date(formData.distributionDate).toISOString() : undefined,
        requiredBy: formData.requiredBy ? new Date(formData.requiredBy).toISOString() : undefined,
      }

      await changeOrderApi.create(submitData)

      if (isWizardMode && onComplete) {
        onComplete(submitData)
      } else {
        router.push("/dashboard/mpi/change-order")
      }
    } catch (err) {
      console.error("Error creating change order:", err)
      setError("Failed to create change order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentAttachmentChange = (attachment: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      documentAttachments: checked
        ? [...prev.documentAttachments, attachment]
        : prev.documentAttachments.filter((doc) => doc !== attachment),
    }))
  }

  const handleFileActionChange = (action: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      fileActions: checked ? [...prev.fileActions, action] : prev.fileActions.filter((fa) => fa !== action),
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  if (enumsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading form options...</span>
      </div>
    )
  }

  if (enumsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{enumsError}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {!isWizardMode && (
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold">Customer New / Change Order</h1>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep <= 1}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentStep >= totalSteps}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Fill Form
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardContent className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Order Type and Location Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Type */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Type</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {getOrderTypeOptions().map((option) => (
                        <div key={String(option.value)} className="flex items-center space-x-2">
                          <Checkbox
                            id={`order-${option.value}`}
                            checked={formData.orderType === String(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  orderType: option.value as any,
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`order-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <RadioGroup
                      value={formData.location}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                      className="space-y-3"
                    >
                      {getLocationTypeOptions().map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`location-${option.value}`} />
                          <Label htmlFor={`location-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                {/* Date and Order Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="distributionDate">Distribution Date</Label>
                      <Input
                        id="distributionDate"
                        type="date"
                        value={formData.distributionDate ? formData.distributionDate.split("T")[0] : ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            distributionDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredBy">Required By</Label>
                      <Input
                        id="requiredBy"
                        type="date"
                        value={formData.requiredBy ? formData.requiredBy.split("T")[0] : ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            requiredBy: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="internalOrderNumber">Internal Order Number *</Label>
                      <Input
                        id="internalOrderNumber"
                        value={formData.internalOrderNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            internalOrderNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter internal order number"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customer and Assembly Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer & Assembly Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer *</Label>
                      <Input
                        id="customer"
                        value={formData.customer}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customer: e.target.value,
                          }))
                        }
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assemblyNumber">Assembly Number *</Label>
                      <Input
                        id="assemblyNumber"
                        value={formData.assemblyNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            assemblyNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter assembly number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="revision">Revision *</Label>
                      <Input
                        id="revision"
                        value={formData.revision}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            revision: e.target.value,
                          }))
                        }
                        placeholder="Enter revision"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applicableJobId">Applicable Job ID</Label>
                      <Input
                        id="applicableJobId"
                        value={formData.applicableJobId || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            applicableJobId: e.target.value,
                          }))
                        }
                        placeholder="Enter job ID"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="enumAttachmentType">Attachment Type *</Label>
                      <Select
                        value={formData.enumAttachmentType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            enumAttachmentType: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select attachment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAttachmentTypeOptions().map((option) => (
                            <SelectItem key={String(option.value)} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEcoNumber">Customer ECO Number</Label>
                      <Input
                        id="customerEcoNumber"
                        value={formData.customerEcoNumber || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customerEcoNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter ECO number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="briefDescription">Brief Description</Label>
                      <Textarea
                        id="briefDescription"
                        value={formData.briefDescription || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            briefDescription: e.target.value,
                          }))
                        }
                        placeholder="Enter brief description"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Enter notes"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Document Attachments and File Actions */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Document Attachments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getDocumentAttachmentOptions().map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`doc-${option.value}`}
                            checked={formData.documentAttachments.includes(option.value as any)}
                            onCheckedChange={(checked) =>
                              handleDocumentAttachmentChange(option.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={`doc-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">File Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFileActionOptions().map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`file-${option.value}`}
                            checked={formData.fileActions.includes(option.value as any)}
                            onCheckedChange={(checked) => handleFileActionChange(option.value, checked as boolean)}
                          />
                          <Label htmlFor={`file-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isWizardMode ? "Save & Continue" : "Create Change Order"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardContent className="space-y-6 mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-lg font-medium cursor-pointer">
                    Click to upload files or drag and drop
                  </Label>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX up to 10MB each</p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
