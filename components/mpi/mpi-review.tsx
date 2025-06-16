"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, FileText, AlertCircle, Settings, ClipboardList, Wrench, FileEdit, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface MpiCreationReviewProps {
  createdIds: {
    changeOrderId?: string
    checklistIds?: string[]
    stationIds?: string[]
  }
  onCreateMpi: () => void
  onSaveAsDraft: () => void
}

export default function MpiCreationReview({ createdIds, onCreateMpi, onSaveAsDraft }: MpiCreationReviewProps) {
  const router = useRouter()
  const [reviewData, setReviewData] = useState<any>({
    changeOrders: [],
    checklists: [],
    stations: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCreatedData()
  }, [createdIds])

  const fetchCreatedData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data: any = {
        changeOrders: [],
        checklists: [],
        stations: [],
      }

      // Fetch change order data
      if (createdIds.changeOrderId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change-orders/${createdIds.changeOrderId}`)
          if (response.ok) {
            const changeOrder = await response.json()
            data.changeOrders = [changeOrder]
          }
        } catch (err) {
          console.error("Error fetching change order:", err)
        }
      }

      // Fetch checklist data
      if (createdIds.checklistIds && createdIds.checklistIds.length > 0) {
        try {
          const checklistPromises = createdIds.checklistIds.map((id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/checklist-sections/${id}`).then((res) => res.json()),
          )
          const checklists = await Promise.all(checklistPromises)
          data.checklists = checklists
        } catch (err) {
          console.error("Error fetching checklists:", err)
        }
      }

      // Fetch station data
      if (createdIds.stationIds && createdIds.stationIds.length > 0) {
        try {
          const stationPromises = createdIds.stationIds.map((id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/stations/${id}`).then((res) => res.json()),
          )
          const stations = await Promise.all(stationPromises)
          data.stations = stations
        } catch (err) {
          console.error("Error fetching stations:", err)
        }
      }

      setReviewData(data)
    } catch (err) {
      console.error("Error fetching review data:", err)
      setError("Failed to load review data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMpi = async () => {
    try {
      setCreating(true)
      await onCreateMpi()
    } catch (error) {
      console.error("Error creating MPI:", error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading review data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={fetchCreatedData}>Retry</Button>
        </div>
      </div>
    )
  }

  const { changeOrders, checklists, stations } = reviewData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Review MPI</h1>
            <p className="text-gray-600">Review all created components before finalizing MPI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveAsDraft} disabled={creating}>
            Save as Draft
          </Button>
          <Button onClick={handleCreateMpi} disabled={creating} className="bg-green-600 hover:bg-green-700">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating MPI...
              </>
            ) : (
              "Create MPI"
            )}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>MPI Creation Summary</CardTitle>
              <p className="text-sm text-gray-600">
                {changeOrders.length} Change Order • {checklists.length} Checklist Sections • {stations.length} Stations
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Ready to Create
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Review Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="change-orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="change-orders" className="flex items-center gap-2">
                <FileEdit className="h-4 w-4" />
                Change Orders ({changeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="checklists" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Checklists ({checklists.length})
              </TabsTrigger>
              <TabsTrigger value="stations" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Stations ({stations.length})
              </TabsTrigger>
            </TabsList>

            {/* Change Orders Tab */}
            <TabsContent value="change-orders" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Change Orders</h3>
                {changeOrders.length > 0 ? (
                  <div className="space-y-4">
                    {changeOrders.map((order: any, index: number) => (
                      <Card key={order.id || index}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Internal Order Number</label>
                              <p className="text-sm font-medium">{order.internalOrderNumber || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Customer</label>
                              <p className="text-sm">{order.customer || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Assembly Number</label>
                              <p className="text-sm">{order.assemblyNumber || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Revision</label>
                              <p className="text-sm">{order.revision || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Order Type</label>
                              <p className="text-sm">{order.orderType ? order.orderType.replace(/_/g, " ") : "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Location</label>
                              <p className="text-sm">{order.location ? order.location.replace(/_/g, " ") : "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Applicable Job ID</label>
                              <p className="text-sm">{order.applicableJobId || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Created ID</label>
                              <p className="text-sm font-mono text-blue-600">{order.id}</p>
                            </div>
                          </div>

                          {order.description && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-gray-600">Description</label>
                              <p className="text-sm">{order.description}</p>
                            </div>
                          )}

                          {/* Document Attachments */}
                          {order.documentAttachments && order.documentAttachments.length > 0 && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-gray-600">Document Attachments</label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {order.documentAttachments.map((attachment: string, idx: number) => (
                                  <Badge key={idx} variant="outline">
                                    {attachment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileEdit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No change orders created</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Checklists Tab */}
            <TabsContent value="checklists" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Checklist Sections</h3>
                {checklists.length > 0 ? (
                  <div className="space-y-4">
                    {checklists.map((checklist: any, index: number) => (
                      <Card key={checklist.id || index}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{checklist.name || "Checklist Section"}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{checklist.checklistItems?.length || 0} items</Badge>
                                <Badge variant="secondary" className="text-xs font-mono">
                                  {checklist.id}
                                </Badge>
                              </div>
                            </div>

                            {checklist.checklistItems && checklist.checklistItems.length > 0 && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Items Preview</label>
                                {checklist.checklistItems.slice(0, 3).map((item: any, itemIndex: number) => (
                                  <div
                                    key={item.id || itemIndex}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                  >
                                    <span className="text-sm">{item.description}</span>
                                    <Badge variant={item.required ? "default" : "secondary"}>
                                      {item.required ? "Required" : "Optional"}
                                    </Badge>
                                  </div>
                                ))}
                                {checklist.checklistItems.length > 3 && (
                                  <p className="text-sm text-gray-500">
                                    ... and {checklist.checklistItems.length - 3} more items
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No checklist sections created</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Stations Tab */}
            <TabsContent value="stations" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Associated Stations</h3>
                {stations.length > 0 ? (
                  <div className="grid gap-4">
                    {stations.map((station: any, index: number) => (
                      <Card key={station.id || index}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Wrench className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{station.stationName || "Unnamed Station"}</h4>
                                <p className="text-sm text-gray-600">Code: {station.stationCode || "N/A"}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{station.status || "Active"}</Badge>
                                <Badge variant="secondary" className="text-xs font-mono">
                                  {station.id}
                                </Badge>
                              </div>
                            </div>

                            {/* Station Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium text-gray-600">Station ID</label>
                                <p>{station.stationId || "N/A"}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-600">Location</label>
                                <p>{station.location || "N/A"}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-600">Operator</label>
                                <p>{station.operator || "N/A"}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-600">Status</label>
                                <p>{station.status || "N/A"}</p>
                              </div>
                            </div>

                            {/* Station Description */}
                            {station.description && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">Description</label>
                                <p className="text-sm text-gray-800 mt-1">{station.description}</p>
                              </div>
                            )}

                            {/* Technical Specifications */}
                            {station.technicalSpecifications && station.technicalSpecifications.length > 0 && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">Technical Specifications</label>
                                <div className="mt-2 space-y-1">
                                  {station.technicalSpecifications.map((spec: any, specIndex: number) => (
                                    <div
                                      key={spec.id || specIndex}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                                    >
                                      <span>{spec.name}</span>
                                      <span className="text-gray-600">{spec.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Documentation */}
                            {station.documentation && station.documentation.length > 0 && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">Documentation</label>
                                <div className="mt-2 space-y-1">
                                  {station.documentation.map((doc: any, docIndex: number) => (
                                    <div key={doc.id || docIndex} className="p-2 bg-gray-50 rounded text-sm">
                                      <p>{doc.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No stations selected</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
