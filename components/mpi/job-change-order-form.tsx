"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, FileText } from "lucide-react"
import { useChangeOrderEnums } from "@/hooks/use-change-order-enums"
import { Loader2 } from "lucide-react" // Import Loader2

interface JobChangeOrderFormProps {
  onComplete: (data: any) => void
  initialData?: any
}

export function JobChangeOrderForm({ onComplete, initialData }: JobChangeOrderFormProps) {
  // Job Details Section
  const [jobDetails, setJobDetails] = useState({
    customer: "",
    assemblyNumber: "",
    revision: "",
    description: "",
    applicableJobId: "",
    ...initialData?.jobDetails,
  })

  // Change Order Details Section
  const [changeOrderDetails, setChangeOrderDetails] = useState({
    orderType: "",
    location: "",
    distributionDate: "",
    requiredBy: "",
    internalOrderNumber: "",
    enumAttachmentType: "",
    customerEcoNumber: "",
    customerDeviation: "",
    fileActions: [] as string[],
    documentAttachments: [] as string[],
    otherAttachments: "",
    briefDescription: "",
    notes: "",
    markComplete: false,
    ...initialData?.changeOrderDetails,
  })

  const [documentControl, setDocumentControl] = useState({
    dateProcessed: "",
    clerkName: "",
    totalPageCount: "",
    mamsDataEntry: false,
    enteredBy: "",
    ...initialData?.documentControl,
  })

  const [error, setError] = useState<string | null>(null)

  const {
    enums,
    loading: enumsLoading,
    getOrderTypeOptions,
    getLocationOptions,
    getAttachmentTypeOptions,
    getFileActionOptions,
    getDocumentAttachmentOptions,
  } = useChangeOrderEnums()

  const handleJobDetailsChange = (field: string, value: string) => {
    setJobDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleChangeOrderDetailsChange = (field: string, value: any) => {
    setChangeOrderDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileActionChange = (action: string, checked: boolean) => {
    setChangeOrderDetails((prev) => ({
      ...prev,
      fileActions: checked ? [...prev.fileActions, action] : prev.fileActions.filter((a) => a !== action),
    }))
  }

  const handleDocumentAttachmentChange = (attachment: string, checked: boolean) => {
    setChangeOrderDetails((prev) => ({
      ...prev,
      documentAttachments: checked
        ? [...prev.documentAttachments, attachment]
        : prev.documentAttachments.filter((a) => a !== attachment),
    }))
  }

  const handleDocumentControlChange = (field: string, value: any) => {
    setDocumentControl((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    const combinedData = {
      jobDetails,
      changeOrderDetails,
      documentControl,
    }
    onComplete(combinedData)
  }

  const isFormValid = () => {
    return (
      jobDetails.customer &&
      jobDetails.assemblyNumber &&
      jobDetails.applicableJobId &&
      changeOrderDetails.orderType &&
      changeOrderDetails.location
    )
  }

  if (enumsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Loading form data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Job Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input
                id="customer"
                value={jobDetails.customer}
                onChange={(e) => handleJobDetailsChange("customer", e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assemblyNumber">Assembly Number *</Label>
              <Input
                id="assemblyNumber"
                value={jobDetails.assemblyNumber}
                onChange={(e) => handleJobDetailsChange("assemblyNumber", e.target.value)}
                placeholder="Enter assembly number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revision">Revision</Label>
              <Input
                id="revision"
                value={jobDetails.revision}
                onChange={(e) => handleJobDetailsChange("revision", e.target.value)}
                placeholder="Enter revision"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicableJobId">Applicable Job ID *</Label>
              <Input
                id="applicableJobId"
                value={jobDetails.applicableJobId}
                onChange={(e) => handleJobDetailsChange("applicableJobId", e.target.value)}
                placeholder="Enter applicable job ID"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={jobDetails.description}
                onChange={(e) => handleJobDetailsChange("description", e.target.value)}
                placeholder="Enter job description"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Change Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Change Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type *</Label>
              <Select
                value={changeOrderDetails.orderType}
                onValueChange={(value) => handleChangeOrderDetailsChange("orderType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  {getOrderTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                value={changeOrderDetails.location}
                onValueChange={(value) => handleChangeOrderDetailsChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distributionDate">Distribution Date</Label>
              <Input
                id="distributionDate"
                type="date"
                value={changeOrderDetails.distributionDate}
                onChange={(e) => handleChangeOrderDetailsChange("distributionDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredBy">Required By</Label>
              <Input
                id="requiredBy"
                type="date"
                value={changeOrderDetails.requiredBy}
                onChange={(e) => handleChangeOrderDetailsChange("requiredBy", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
              <Input
                id="internalOrderNumber"
                value={changeOrderDetails.internalOrderNumber}
                onChange={(e) => handleChangeOrderDetailsChange("internalOrderNumber", e.target.value)}
                placeholder="Enter internal order number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enumAttachmentType">Attachment Type</Label>
              <Select
                value={changeOrderDetails.enumAttachmentType}
                onValueChange={(value) => handleChangeOrderDetailsChange("enumAttachmentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attachment type" />
                </SelectTrigger>
                <SelectContent>
                  {getAttachmentTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
                value={changeOrderDetails.customerEcoNumber}
                onChange={(e) => handleChangeOrderDetailsChange("customerEcoNumber", e.target.value)}
                placeholder="Enter customer ECO number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerDeviation">Customer Deviation</Label>
              <Input
                id="customerDeviation"
                value={changeOrderDetails.customerDeviation}
                onChange={(e) => handleChangeOrderDetailsChange("customerDeviation", e.target.value)}
                placeholder="Enter customer deviation"
              />
            </div>
          </div>

          {/* File Actions Checkbox Group */}
          <div className="space-y-3">
            <Label>File Actions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getFileActionOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fileAction-${option.value}`}
                    checked={changeOrderDetails.fileActions.includes(option.value)}
                    onCheckedChange={(checked) => handleFileActionChange(option.value, !!checked)}
                  />
                  <Label htmlFor={`fileAction-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Document Attachments Checkbox Group */}
          <div className="space-y-3">
            <Label>Document Attachments</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getDocumentAttachmentOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`docAttachment-${option.value}`}
                    checked={changeOrderDetails.documentAttachments.includes(option.value)}
                    onCheckedChange={(checked) => handleDocumentAttachmentChange(option.value, !!checked)}
                  />
                  <Label htmlFor={`docAttachment-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherAttachments">Other Attachments</Label>
            <Textarea
              id="otherAttachments"
              value={changeOrderDetails.otherAttachments}
              onChange={(e) => handleChangeOrderDetailsChange("otherAttachments", e.target.value)}
              placeholder="Describe other attachments"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="briefDescription">Brief Description</Label>
            <Textarea
              id="briefDescription"
              value={changeOrderDetails.briefDescription}
              onChange={(e) => handleChangeOrderDetailsChange("briefDescription", e.target.value)}
              placeholder="Enter brief description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={changeOrderDetails.notes}
              onChange={(e) => handleChangeOrderDetailsChange("notes", e.target.value)}
              placeholder="Enter additional notes"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="markComplete"
              checked={changeOrderDetails.markComplete}
              onCheckedChange={(checked) => handleChangeOrderDetailsChange("markComplete", checked)}
            />
            <Label htmlFor="markComplete">Mark Complete</Label>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Document Control */}
      <Card>
        <CardHeader>
          <CardTitle>Document Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateProcessed">Date Processed</Label>
              <Input
                id="dateProcessed"
                type="date"
                value={documentControl?.dateProcessed || ""}
                onChange={(e) => handleDocumentControlChange("dateProcessed", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clerkName">Clerk Name</Label>
              <Input
                id="clerkName"
                value={documentControl?.clerkName || ""}
                onChange={(e) => handleDocumentControlChange("clerkName", e.target.value)}
                placeholder="Enter clerk name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPageCount">Total Page Count</Label>
              <Input
                id="totalPageCount"
                type="number"
                value={documentControl?.totalPageCount || ""}
                onChange={(e) => handleDocumentControlChange("totalPageCount", e.target.value)}
                placeholder="Enter total page count"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enteredBy">Entered By</Label>
              <Input
                id="enteredBy"
                value={documentControl?.enteredBy || ""}
                onChange={(e) => handleDocumentControlChange("enteredBy", e.target.value)}
                placeholder="Enter name"
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch
                id="mamsDataEntry"
                checked={documentControl?.mamsDataEntry || false}
                onCheckedChange={(checked) => handleDocumentControlChange("mamsDataEntry", checked)}
              />
              <Label htmlFor="mamsDataEntry">MAMS Data Entry</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!isFormValid()} className="flex items-center gap-2">
          Continue to Checklist
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
