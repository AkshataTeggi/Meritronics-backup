// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import {
//   ArrowLeft,
//   AlertCircle,
//   FileText,
//   Edit,
//   Trash2,
//   Calendar,
//   Settings,
//   Activity,
//   Clock,
//   CheckCircle,
// } from "lucide-react"
// import { mpiApi } from "@/lib/mpi"
// import { Mpi } from "@/types/mpi"

// interface MpiDetailsProps {
//   mpiId: string
// }

// export default function MpiDetails({ mpiId }: MpiDetailsProps) {
//   const [mpi, setMpi] = useState<Mpi | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const fetchMpi = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)
//         const mpiData = await mpiApi.findOne(mpiId)
//         setMpi(mpiData)
//       } catch (err) {
//         console.error("Error fetching MPI:", err)
//         setError(err instanceof Error ? err.message : "Failed to fetch MPI data.")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchMpi()
//   }, [mpiId])

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString()
//     } catch {
//       return "Invalid Date"
//     }
//   }

//   const formatDateTime = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleString()
//     } catch {
//       return "Invalid Date"
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (error || !mpi) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to MPIs
//           </Button>
//         </div>
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error || "MPI not found"}</AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to MPIs
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Details</h1>
//             <p className="text-sm text-gray-500">Manufacturing Process Instruction</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="outline" className="text-blue-600 border-blue-200">
//             <FileText className="h-3 w-3 mr-1" />
//             MPI
//           </Badge>
//         </div>
//       </div>

//       {/* MPI Overview */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
//                 <FileText className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <CardTitle className="text-xl">{mpi.name}</CardTitle>
//                 <div className="flex items-center gap-4 mt-1">
//                   <Badge variant="outline">Rev: {mpi.revision}</Badge>
//                   <span className="text-sm text-gray-500">Effective: {formatDate(mpi.effectiveDate)}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
//                 <Edit className="h-4 w-4 mr-1" />
//                 Edit
//               </Button>
//               <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
//                 <Trash2 className="h-4 w-4 mr-1" />
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Status</CardTitle>
//             <Activity className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">Active</div>
//             <p className="text-xs text-muted-foreground">Current status</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Revision</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">{mpi.revision}</div>
//             <p className="text-xs text-muted-foreground">Current version</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Effective Date</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-purple-600">{formatDate(mpi.effectiveDate)}</div>
//             <p className="text-xs text-muted-foreground">Implementation date</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-600">{formatDate(mpi.updatedAt)}</div>
//             <p className="text-xs text-muted-foreground">Last modification</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* MPI Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             MPI Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">MPI Name</label>
//                 <p className="text-base font-medium">{mpi.name}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Revision</label>
//                 <p className="text-base font-medium">{mpi.revision}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Effective Date</label>
//                 <p className="text-base font-medium">{formatDate(mpi.effectiveDate)}</p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Created At</label>
//                 <p className="text-base font-medium">{formatDateTime(mpi.createdAt)}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Updated At</label>
//                 <p className="text-base font-medium">{formatDateTime(mpi.updatedAt)}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Status</label>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4 text-green-600" />
//                   <span className="text-base font-medium text-green-600">Active</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }















"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Settings,
  CheckCircle,
  MapPin,
  User,
  BookOpen,
  GitBranch,
  ClipboardList,
  Package,
  FileCheck,
  Building,
} from "lucide-react"
import { mpiApi } from "@/lib/mpi"

interface MpiDetailsProps {
  mpiId: string
}

export default function MpiDetails({ mpiId }: MpiDetailsProps) {
  const [mpi, setMpi] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const mpiData = await mpiApi.findOne(mpiId)
        setMpi(mpiData)
      } catch (err) {
        console.error("Error fetching MPI:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch MPI data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMpi()
  }, [mpiId])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  const formatEnumValue = (value: string) => {
    return (
      value
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !mpi) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MPIs
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "MPI not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MPIs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Details</h1>
            <p className="text-sm text-gray-500">Manufacturing Process Instruction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            MPI
          </Badge>
        </div>
      </div>

      {/* MPI Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">MPI #{mpi.id}</CardTitle>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">Created: {formatDate(mpi.createdAt)}</span>
                  <span className="text-sm text-gray-500">Updated: {formatDate(mpi.updatedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="change-orders">Change Orders</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{mpi.stations?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active stations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Change Orders</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{mpi.changeOrders?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checklists</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{mpi.checklists?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active checklists</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{mpi.services?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Available services</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">MPI ID</label>
                    <p className="text-base font-medium">{mpi.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="text-base font-medium">{formatDateTime(mpi.createdAt)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Updated At</label>
                    <p className="text-base font-medium">{formatDateTime(mpi.updatedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-base font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stations Tab */}
        <TabsContent value="stations" className="space-y-6">
          {mpi.stations && mpi.stations.length > 0 ? (
            <div className="space-y-4">
              {mpi.stations.map((station: any) => (
                <Card key={station.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{station.stationName}</CardTitle>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline">ID: {station.stationId}</Badge>
                            <Badge variant="outline">Code: {station.stationCode}</Badge>
                            <Badge variant={station.status === "active" ? "default" : "secondary"}>
                              {station.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-base">{station.description}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Location</label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{station.location}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Operator</label>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{station.operator}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Technical Specifications</label>
                          <div className="space-y-2">
                            {station.technicalSpecifications?.map((spec: any) => (
                              <div key={spec.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium">{spec.name}</span>
                                <Badge variant="outline">{spec.value}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Documentation</label>
                          <div className="space-y-2">
                            {station.documentation?.map((doc: any) => (
                              <div key={doc.id} className="p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">{doc.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Flow Charts</label>
                          <div className="space-y-2">
                            {station.flowCharts?.map((flow: any) => (
                              <div key={flow.id} className="p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <GitBranch className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{flow.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No stations found for this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Change Orders Tab */}
        <TabsContent value="change-orders" className="space-y-6">
          {mpi.changeOrders && mpi.changeOrders.length > 0 ? (
            <div className="space-y-4">
              {mpi.changeOrders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                          <FileCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Order #{order.internalOrderNumber}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{formatEnumValue(order.orderType)}</Badge>
                            <Badge variant="outline">{order.location}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Customer Information</label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Customer:</span>
                              <span className="font-medium">{order.customer}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Assembly Number:</span>
                              <span className="font-medium">{order.assemblyNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Revision:</span>
                              <span className="font-medium">{order.revision}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Job ID:</span>
                              <span className="font-medium">{order.applicableJobId}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-base">{order.description}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Order Details</label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Distribution Date:</span>
                              <span className="font-medium">{formatDate(order.distributionDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Required By:</span>
                              <span className="font-medium">{formatDate(order.requiredBy)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ECO Number:</span>
                              <span className="font-medium">{order.customerEcoNumber}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Attachments</label>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm">Document Attachments:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.documentAttachments?.map((attachment: string, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {attachment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm">File Actions:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.fileActions?.map((action: string, index: number) => (
                                  <Badge key={index} variant="outline">
                                    {formatEnumValue(action)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-sm mt-1">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No change orders found for this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Checklists Tab */}
        <TabsContent value="checklists" className="space-y-6">
          {mpi.checklists && mpi.checklists.length > 0 ? (
            <div className="space-y-4">
              {mpi.checklists.map((checklist: any) => (
                <Card key={checklist.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      {checklist.name || "Checklist"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Checklist details would be displayed here</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No checklists found for this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          {mpi.services && mpi.services.length > 0 ? (
            <div className="space-y-4">
              {mpi.services.map((service: any) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {service.name || "Service"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Service details would be displayed here</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No services found for this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {mpi.documentControls && mpi.documentControls.length > 0 ? (
            <div className="space-y-4">
              {mpi.documentControls.map((doc: any) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Document Control</CardTitle>
                          <p className="text-sm text-gray-500">MAMS: {doc.mamsDataEntry}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Clerk Information</label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Clerk Name:</span>
                              <span className="font-medium">{doc.clerkName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entered By:</span>
                              <span className="font-medium">{doc.enteredBy}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-base">{doc.description}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Document Details</label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Date Processed:</span>
                              <span className="font-medium">{formatDate(doc.dateProcessed)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Pages:</span>
                              <span className="font-medium">{doc.totalPageCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Created:</span>
                              <span className="font-medium">{formatDateTime(doc.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No document controls found for this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
