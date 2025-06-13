"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMpiById } from "@/lib/mock-data/mpi-data"
import { ArrowLeft, Settings, Edit, FileText, CheckSquare } from "lucide-react"
import { Mpi } from "@/types/mpi"

interface ViewMpiPageProps {
  params: {
    id: string
  }
}

export default function ViewMpiPage({ params }: ViewMpiPageProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        const mpiData = getMpiById(params.id)
        setMpi(mpiData || null)
      } catch (err) {
        console.error("Failed to fetch MPI:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMpi()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading MPI...</p>
        </div>
      </div>
    )
  }

  if (!mpi) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">MPI not found</p>
        <Button onClick={() => router.push("/dashboard/mpi")} className="mt-4">
          Back to MPIs
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
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
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">{mpi.processName}</h1>
            <p className="text-gray-600">
              {mpi.stationName} ({mpi.stationId})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(mpi.complianceStatus)}>{mpi.complianceStatus}</Badge>
          <Button onClick={() => router.push(`/dashboard/mpi/edit/${mpi.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* MPI Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            MPI Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <strong>Revision:</strong> {mpi.revision || "N/A"}
            </div>
            <div>
              <strong>Effective Date:</strong>{" "}
              {mpi.effectiveDate ? new Date(mpi.effectiveDate).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <strong>Created:</strong> {mpi.createdAt ? new Date(mpi.createdAt).toLocaleDateString() : "N/A"}
            </div>
            {mpi.checklistId && (
              <div>
                <strong>Checklist:</strong> {mpi.checklist?.name || "Associated"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purpose & Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mpi.purpose && (
                  <div>
                    <strong>Purpose:</strong>
                    <p className="mt-1 text-sm text-gray-600">{mpi.purpose}</p>
                  </div>
                )}
                {mpi.scope && (
                  <div>
                    <strong>Scope:</strong>
                    <p className="mt-1 text-sm text-gray-600">{mpi.scope}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mpi.equipment && (
                  <div>
                    <strong>Equipment:</strong>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{mpi.equipment}</p>
                  </div>
                )}
                {mpi.materials && (
                  <div>
                    <strong>Materials:</strong>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{mpi.materials}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {mpi.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.responsibilities}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mpi.procedure && (
              <Card>
                <CardHeader>
                  <CardTitle>Procedure Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.procedure}</p>
                </CardContent>
              </Card>
            )}

            {mpi.safety && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.safety}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {mpi.processControl && (
            <Card>
              <CardHeader>
                <CardTitle>Process Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.processControl}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {mpi.setupInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.setupInstructions}</p>
                </CardContent>
              </Card>
            )}

            {mpi.operatingInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Operating Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.operatingInstructions}</p>
                </CardContent>
              </Card>
            )}

            {mpi.qualityInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Quality Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.qualityInstructions}</p>
                </CardContent>
              </Card>
            )}

            {mpi.troubleshootingInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.troubleshootingInstructions}</p>
                </CardContent>
              </Card>
            )}

            {mpi.maintenanceInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.maintenanceInstructions}</p>
                </CardContent>
              </Card>
            )}

            {mpi.shutdownInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Shutdown Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{mpi.shutdownInstructions}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4">
          {mpi.checklist ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  {mpi.checklist.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Version {mpi.checklist.version}</Badge>
                    <Badge variant="default">{mpi.checklist.items.length} items</Badge>
                    <Badge variant={mpi.checklist.isActive ? "default" : "secondary"}>
                      {mpi.checklist.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">{mpi.checklist.description}</p>

                  {mpi.completedItems && mpi.completedItems.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Completed Items ({mpi.completedItems.length})</h4>
                      <div className="space-y-2">
                        {mpi.completedItems.map((item) => (
                          <div key={item.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Item {item.itemId}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={item.status === "YES" ? "default" : "secondary"}>{item.status}</Badge>
                              {item.completedBy && <span className="text-xs text-gray-500">by {item.completedBy}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No checklist associated with this MPI</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
