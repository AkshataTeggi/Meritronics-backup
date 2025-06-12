"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { StationIcon } from "./station-icon"
import { FileText, GitBranch, Loader2, Edit, Trash2, Download, Settings, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import type { Station } from "@/types/station"
import { stationApi } from "@/lib/stations"

interface StationDetailModalProps {
  stationId: string | null
  isOpen: boolean
  onClose: () => void
}

interface StationDetailViewProps {
  station: Station
  isModal?: boolean
  onDelete?: () => void
}

// Standalone component for station details (can be used in modal or page)
export function StationDetailView({ station, isModal = false, onDelete }: StationDetailViewProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const getStationId = () => {
    // Prioritize the database ID (id) over the business ID (stationId)
    const id = station.id || station.stationId
    console.log("Using station ID for operations:", id, station)
    return id
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setDeleteError("")

    try {
      const id = getStationId()
      console.log("Deleting station with ID:", id)

      await stationApi.remove(id)

      // Show success toast
      toast({
        title: "Station deleted",
        description: `Station "${station.stationName}" has been deleted successfully.`,
      })

      // Close the delete dialog
      setIsDeleteDialogOpen(false)

      // Call the onDelete callback if provided (for modal)
      if (onDelete) {
        onDelete()
      } else {
        // Navigate back to stations list
        router.push("/dashboard/stations")
      }
    } catch (error) {
      console.error("Failed to delete station:", error)
      setDeleteError(error instanceof Error ? error.message : "Failed to delete station")

      // Show error toast
      toast({
        title: "Delete failed",
        description: `Could not delete station: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const renderSpecificationsTable = () => {
    if (!station.specifications || station.specifications.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No specifications available</div>
    }

    return (
      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-3 px-4 text-left">Name</TableHead>
              <TableHead className="py-3 px-4 text-left">Type</TableHead>
              <TableHead className="py-3 px-4 text-left">Required</TableHead>
              <TableHead className="py-3 px-4 text-left">Active</TableHead>
              <TableHead className="py-3 px-4 text-left">Suggestions</TableHead>
              <TableHead className="py-3 px-4 text-left">Created At</TableHead>
              <TableHead className="py-3 px-4 text-left">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {station.specifications.map((spec) => (
              <TableRow key={spec.id} className="border-b hover:bg-muted/20">
                <TableCell className="py-4 px-4 font-medium">{spec.name}</TableCell>
                <TableCell className="py-4 px-4">
                  <span className="capitalize text-sm">{spec.type}</span>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <span className="text-sm">{spec.isRequired ? "Required" : "Optional"}</span>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <span className="text-sm">{spec.isActive ? "Active" : "Inactive"}</span>
                </TableCell>
                <TableCell className="py-4 px-4">
                  {spec.suggestions && spec.suggestions.length > 0 ? (
                    <div className="text-sm leading-relaxed">{spec.suggestions.join(", ")}</div>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground">
                  {new Date(spec.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground">
                  {new Date(spec.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderTechnicalSpecsTable = () => {
    if (!station.technicalSpecifications || station.technicalSpecifications.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No technical specifications available</div>
    }

    return (
      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-3 px-4 text-left">Name</TableHead>
              <TableHead className="py-3 px-4 text-left">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {station.technicalSpecifications.map((spec) => (
              <TableRow key={spec.id} className="border-b hover:bg-muted/20">
                <TableCell className="py-4 px-4 font-medium">{spec.name}</TableCell>
                <TableCell className="py-4 px-4">{spec.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderDocumentationTable = () => {
    if (!station.documentation || station.documentation.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No documentation available</div>
    }

    return (
      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-3 px-4 text-left">Content</TableHead>
              <TableHead className="py-3 px-4 text-left">Files</TableHead>
              <TableHead className="py-3 px-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {station.documentation.map((doc) => (
              <TableRow key={doc.id} className="border-b hover:bg-muted/20">
                <TableCell className="py-4 px-4 max-w-md">
                  <p className="text-sm leading-relaxed">{doc.content}</p>
                </TableCell>
                <TableCell className="py-4 px-4">
                  {doc.files && doc.files.length > 0 ? (
                    <div className="space-y-3">
                      {doc.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No files</span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">
                  {doc.files && doc.files.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {doc.files.map((file) => (
                        <Button key={file.id} variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderFlowChartsTable = () => {
    if (!station.flowCharts || station.flowCharts.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No flow charts available</div>
    }

    return (
      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-3 px-4 text-left">Content</TableHead>
              <TableHead className="py-3 px-4 text-left">Flow Chart Files</TableHead>
              <TableHead className="py-3 px-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {station.flowCharts.map((chart) => (
              <TableRow key={chart.id} className="border-b hover:bg-muted/20">
                <TableCell className="py-4 px-4">
                  <p className="text-sm leading-relaxed">{chart.content}</p>
                </TableCell>
                <TableCell className="py-4 px-4">
                  {chart.files && chart.files.length > 0 ? (
                    <div className="space-y-3">
                      {chart.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-3">
                          <GitBranch className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No files</span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">
                  {chart.files && chart.files.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {chart.files.map((file) => (
                        <Button key={file.id} variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // InfoItem component for displaying label-value pairs in the info grid
  function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Station Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left Section: Icon + Title */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <StationIcon stationName={station.stationName} className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className={`font-bold ${isModal ? "text-xl" : "text-2xl"}`}>{station.stationName}</CardTitle>
              </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/stations/edit/${getStationId()}`} passHref>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </span>
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label="Station ID" value={station.stationId} />
            <InfoItem label="Station Code" value={station.stationCode || "N/A"} />
            <InfoItem label="Location" value={station.location || "N/A"} />
            <InfoItem label="Operator" value={station.operator || "N/A"} />
            <InfoItem label="Status" value={<span className="capitalize text-sm">{station.status}</span>} />
          </div>

          {/* Description */}
          {station.description && (
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground">{station.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="specifications" className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="specifications" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Specifications ({station.specifications?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Technical ({station.technicalSpecifications?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Documentation ({station.documentation?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="flowcharts" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Flow Charts ({station.flowCharts?.length || 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="specifications" className="p-6 pt-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Station Specifications</h3>
                {renderSpecificationsTable()}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="p-6 pt-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                {renderTechnicalSpecsTable()}
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="p-6 pt-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                {renderDocumentationTable()}
              </div>
            </TabsContent>

            <TabsContent value="flowcharts" className="p-6 pt-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Flow Charts</h3>
                {renderFlowChartsTable()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this station?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the station "{station.stationName}" and all its
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {deleteError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Station"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Modal wrapper component
export function StationDetailModal({ stationId, isOpen, onClose }: StationDetailModalProps) {
  const [station, setStation] = useState<Station | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (stationId && isOpen) {
      fetchStationDetails(stationId)
    }
  }, [stationId, isOpen])

  const fetchStationDetails = async (id: string) => {
    setIsLoading(true)
    setError("")
    try {
      const stationData = await stationApi.findOne(id)
      setStation(stationData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch station details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    onClose()
    // Refresh the parent component
    window.location.reload()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {station && <StationIcon stationName={station.stationName} className="h-6 w-6" />}
            Station Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading station details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">{error}</div>
        ) : station ? (
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <StationDetailView station={station} isModal={true} onDelete={handleDelete} />
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
