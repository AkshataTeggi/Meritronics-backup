"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, FileText, CheckCircle2, Settings, MapPin } from "lucide-react"
import { useChangeOrderEnums } from "@/hooks/use-change-order-enums"
import { Loader2 } from "lucide-react"

interface MPIReviewStepProps {
  onSubmit: () => void
  onBack: () => void
  onEdit: (step: number) => void
  formData: {
    jobDetails: any
    changeOrderDetails: any
    documentControl: any
    checklist: any
    selectedStations: any[]
    stationSpecifications: any
  }
}

export function MPIReviewStep({ onSubmit, onBack, onEdit, formData }: MPIReviewStepProps) {
  const { formatEnumLabel, loading: enumsLoading } = useChangeOrderEnums()

  if (enumsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Loading review...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review MPI Details</h2>
        <p className="text-muted-foreground">Please review all information before submitting</p>
      </div>

      {/* Job & Change Order Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job & Change Order Details
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(0)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Details */}
          <div>
            <h4 className="font-semibold mb-3">Job Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="font-medium">{formData.jobDetails?.customer || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assembly Number</p>
                <p className="font-medium">{formData.jobDetails?.assemblyNumber || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revision</p>
                <p className="font-medium">{formData.jobDetails?.revision || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applicable Job ID</p>
                <p className="font-medium">{formData.jobDetails?.applicableJobId || "Not specified"}</p>
              </div>
            </div>
            {formData.jobDetails?.description && (
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="font-medium">{formData.jobDetails.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Change Order Details */}
          <div>
            <h4 className="font-semibold mb-3">Change Order Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Type</p>
                <p className="font-medium">
                  {formData.changeOrderDetails?.orderType
                    ? formatEnumLabel(formData.changeOrderDetails.orderType)
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="font-medium">
                  {formData.changeOrderDetails?.location
                    ? formatEnumLabel(formData.changeOrderDetails.location)
                    : "Not specified"}
                </p>
              </div>
              {formData.changeOrderDetails?.distributionDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distribution Date</p>
                  <p className="font-medium">{formData.changeOrderDetails.distributionDate}</p>
                </div>
              )}
              {formData.changeOrderDetails?.requiredBy && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Required By</p>
                  <p className="font-medium">{formData.changeOrderDetails.requiredBy}</p>
                </div>
              )}
            </div>

            {/* File Actions */}
            {formData.changeOrderDetails?.fileActions?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">File Actions</p>
                <div className="flex flex-wrap gap-2">
                  {formData.changeOrderDetails.fileActions.map((action: string) => (
                    <Badge key={action} variant="secondary">
                      {formatEnumLabel(action)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Document Attachments */}
            {formData.changeOrderDetails?.documentAttachments?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Document Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {formData.changeOrderDetails.documentAttachments.map((attachment: string) => (
                    <Badge key={attachment} variant="secondary">
                      {formatEnumLabel(attachment)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Control */}
          {formData.documentControl && Object.values(formData.documentControl).some((val) => val) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Document Control</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.documentControl.dateProcessed && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Processed</p>
                      <p className="font-medium">{formData.documentControl.dateProcessed}</p>
                    </div>
                  )}
                  {formData.documentControl.clerkName && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Clerk Name</p>
                      <p className="font-medium">{formData.documentControl.clerkName}</p>
                    </div>
                  )}
                  {formData.documentControl.totalPageCount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Page Count</p>
                      <p className="font-medium">{formData.documentControl.totalPageCount}</p>
                    </div>
                  )}
                  {formData.documentControl.enteredBy && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Entered By</p>
                      <p className="font-medium">{formData.documentControl.enteredBy}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Checklist Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Checklist Results
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Completed {formData.checklist?.completedItems?.length || 0} of {formData.checklist?.totalItems || 0} items
            </p>
            <Badge
              variant={
                formData.checklist?.completedItems?.length === formData.checklist?.totalItems ? "default" : "secondary"
              }
            >
              {formData.checklist?.completedItems?.length === formData.checklist?.totalItems ? "Complete" : "Partial"}
            </Badge>
          </div>
          {formData.checklist?.completedItems?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.checklist.completedItems.map((item: string) => (
                <Badge key={item} variant="outline" className="text-xs">
                  ✓ {item}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Stations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Selected Stations
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {formData.selectedStations?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.selectedStations.map((station: any) => (
                <div key={station.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{station.name}</h4>
                  <p className="text-sm text-muted-foreground">ID: {station.stationId}</p>
                  <p className="text-sm text-muted-foreground">Code: {station.code}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No stations selected</p>
          )}
        </CardContent>
      </Card>

      {/* Station Specifications */}
      {formData.selectedStations?.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Station Specifications
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.selectedStations.map((station: any) => {
              const stationSpecs = formData.stationSpecifications?.[station.id] || {}
              const specCount = Object.keys(stationSpecs).length

              return (
                <div key={station.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{station.name}</h4>
                    <Badge variant="outline">{specCount} specifications filled</Badge>
                  </div>

                  {specCount > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(stationSpecs).map(([specId, value]: [string, any]) => (
                        <div key={specId} className="text-sm">
                          <p className="font-medium text-muted-foreground">{value.name || specId}</p>
                          <p className="font-medium">
                            {value.value} {value.unit && <span className="text-muted-foreground">({value.unit})</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specifications filled</p>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Specifications
        </Button>
        <Button onClick={onSubmit} className="flex items-center gap-2">
          Submit MPI
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
