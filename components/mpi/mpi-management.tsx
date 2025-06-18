// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import {
//   Plus,
//   Search,
//   AlertCircle,
//   RefreshCw,
//   Edit,
//   Trash2,
//   FileText,
//   Eye,
//   List,
//   LayoutGrid,
//   TrendingUp,
//   GripHorizontal,
// } from "lucide-react"
// import { mpiApi } from "@/lib/mpi"
// import { Mpi } from "@/types/mpi"

// type ViewMode = "list" | "grid"

// export default function MpiManagement() {
//   const [mpis, setMpis] = useState<Mpi[]>([])
//   const [filteredMpis, setFilteredMpis] = useState<Mpi[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [deletingId, setDeletingId] = useState<string | null>(null)
//   const [viewMode, setViewMode] = useState<ViewMode>("list")
//   const router = useRouter()
//   const [jobIdFilter, setJobIdFilter] = useState("")
//   const [groupByJobId, setGroupByJobId] = useState(false)

//   const fetchMpis = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const data = await mpiApi.findAll()
//       setMpis(data)
//       setFilteredMpis(data)
//     } catch (err) {
//       console.error("Error fetching MPIs:", err)
//       setError(err instanceof Error ? err.message : "Failed to fetch MPIs.")
//     } finally {
//       setIsLoading(false)
//       setIsRefreshing(false)
//     }
//   }

//   useEffect(() => {
//     fetchMpis()
//   }, [])

//   useEffect(() => {
//     let filtered = mpis

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (mpi) =>
//           mpi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           mpi.revision?.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     }

//     if (jobIdFilter) {
//       filtered = filtered.filter((mpi) => mpi.applicableJobId?.toLowerCase().includes(jobIdFilter.toLowerCase()))
//     }

//     setFilteredMpis(filtered)
//   }, [searchTerm, jobIdFilter, mpis])

//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this MPI?")) {
//       try {
//         setDeletingId(id)
//         await mpiApi.remove(id)
//         await fetchMpis()
//       } catch (err) {
//         console.error("Error deleting MPI:", err)
//         setError(err instanceof Error ? err.message : "Failed to delete MPI.")
//       } finally {
//         setDeletingId(null)
//       }
//     }
//   }

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString()
//     } catch {
//       return "Invalid Date"
//     }
//   }

//   const handleViewMpi = (mpi: Mpi) => {
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMpi = (mpi: Mpi) => {
//     router.push(`/dashboard/mpi/edit/${mpi.id}`)
//   }

//   // Calculate statistics from actual data
//   const activeMpis = mpis.filter((m) => m.status === "active").length
//   const draftMpis = mpis.filter((m) => m.status === "draft").length
//   const archivedMpis = mpis.filter((m) => m.status === "archived").length

//   const groupMpisByJobId = (mpis: Mpi[]) => {
//     return mpis.reduce((groups: { [key: string]: Mpi[] }, mpi) => {
//       const jobId = mpi.applicableJobId || "No Job ID"
//       if (!groups[jobId]) {
//         groups[jobId] = []
//       }
//       groups[jobId].push(mpi)
//       return groups
//     }, {})
//   }

//   const renderListView = () => {
//     if (groupByJobId) {
//       const groupedMpis = groupMpisByJobId(filteredMpis)
//       return (
//         <div className="space-y-4">
//           {Object.entries(groupedMpis).map(([jobId, mpis]) => (
//             <div key={jobId} className="space-y-2">
//               <h4 className="font-semibold text-lg">Job ID: {jobId}</h4>
//               {mpis.map((mpi) => (
//                 <div
//                   key={mpi.id}
//                   className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
//                       <FileText className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold">{mpi.name}</h3>
//                       <p className="text-sm text-gray-500">
//                         Rev: {mpi.revision} | Effective: {formatDate(mpi.effectiveDate)}
//                         {mpi.applicableJobId && ` | Job ID: ${mpi.applicableJobId}`}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)}>
//                       <Eye className="h-4 w-4 mr-1" />
//                       View
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
//                       <Edit className="h-4 w-4 mr-1" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(mpi.id)}
//                       disabled={deletingId === mpi.id}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                     >
//                       {deletingId === mpi.id ? (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                       ) : (
//                         <Trash2 className="h-4 w-4 mr-1" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )
//     }

//     return (
//       <div className="space-y-2">
//         {filteredMpis.map((mpi) => (
//           <div
//             key={mpi.id}
//             className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
//                 <FileText className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">{mpi.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   Rev: {mpi.revision} | Effective: {formatDate(mpi.effectiveDate)}
//                   {mpi.applicableJobId && ` | Job ID: ${mpi.applicableJobId}`}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)}>
//                 <Eye className="h-4 w-4 mr-1" />
//                 View
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
//                 <Edit className="h-4 w-4 mr-1" />
//                 Edit
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handleDelete(mpi.id)}
//                 disabled={deletingId === mpi.id}
//                 className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//               >
//                 {deletingId === mpi.id ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                 ) : (
//                   <Trash2 className="h-4 w-4 mr-1" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   const renderGridView = () => {
//     if (groupByJobId) {
//       const groupedMpis = groupMpisByJobId(filteredMpis)
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {Object.entries(groupedMpis).map(([jobId, mpis]) => (
//             <div key={jobId} className="space-y-2">
//               <h4 className="font-semibold text-lg">Job ID: {jobId}</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {mpis.map((mpi) => (
//                   <Card key={mpi.id} className="hover:shadow-md transition-shadow">
//                     <CardContent className="p-4">
//                       <div className="flex flex-col items-center text-center space-y-3">
//                         <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
//                           <FileText className="h-8 w-8 text-blue-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-lg">{mpi.name}</h3>
//                           <p className="text-sm text-gray-500">Rev: {mpi.revision}</p>
//                           <p className="text-xs text-gray-400">{formatDate(mpi.effectiveDate)}</p>
//                           {mpi.applicableJobId && (
//                             <p className="text-xs text-blue-600 font-medium">Job ID: {mpi.applicableJobId}</p>
//                           )}
//                         </div>
//                         <div className="flex gap-2 w-full">
//                           <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)} className="flex-1">
//                             <Eye className="h-4 w-4 mr-1" />
//                             View
//                           </Button>
//                           <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDelete(mpi.id)}
//                             disabled={deletingId === mpi.id}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                           >
//                             {deletingId === mpi.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {filteredMpis.map((mpi) => (
//           <Card key={mpi.id} className="hover:shadow-md transition-shadow">
//             <CardContent className="p-4">
//               <div className="flex flex-col items-center text-center space-y-3">
//                 <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
//                   <FileText className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">{mpi.name}</h3>
//                   <p className="text-sm text-gray-500">Rev: {mpi.revision}</p>
//                   <p className="text-xs text-gray-400">{formatDate(mpi.effectiveDate)}</p>
//                   {mpi.applicableJobId && (
//                     <p className="text-xs text-blue-600 font-medium">Job ID: {mpi.applicableJobId}</p>
//                   )}
//                 </div>
//                 <div className="flex gap-2 w-full">
//                   <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)} className="flex-1">
//                     <Eye className="h-4 w-4 mr-1" />
//                     View
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
//                     <Edit className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleDelete(mpi.id)}
//                     disabled={deletingId === mpi.id}
//                     className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                   >
//                     {deletingId === mpi.id ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                     ) : (
//                       <Trash2 className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Management</h1>
//         <Button
//           onClick={() => router.push("/dashboard/mpi/create")}
//           className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Create MPI
//         </Button>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total MPIs</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-[hsl(var(--primary))]">{isLoading ? "--" : mpis.length}</div>
//             <p className="text-xs text-muted-foreground">All manufacturing processes</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active</CardTitle>
//             <TrendingUp className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{isLoading ? "--" : activeMpis}</div>
//             <p className="text-xs text-muted-foreground">Currently in use</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Draft</CardTitle>
//             <AlertCircle className="h-4 w-4 text-yellow-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-600">{isLoading ? "--" : draftMpis}</div>
//             <p className="text-xs text-muted-foreground">Under development</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Archived</CardTitle>
//             <FileText className="h-4 w-4 text-gray-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-600">{isLoading ? "--" : archivedMpis}</div>
//             <p className="text-xs text-muted-foreground">No longer active</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search and View Toggle */}
//       <div className="flex items-center gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//           <Input
//             type="search"
//             placeholder="Search by MPI name or revision..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="relative flex-1">
//           <Input
//             type="search"
//             placeholder="Filter by Job ID..."
//             value={jobIdFilter}
//             onChange={(e) => setJobIdFilter(e.target.value)}
//           />
//         </div>
//         <Button variant="outline" onClick={() => setIsRefreshing(true) || fetchMpis()} disabled={isRefreshing}>
//           <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//           Refresh
//         </Button>
//       </div>

//       {/* MPIs List */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
//               <FileText className="h-5 w-5" />
//               All MPIs
//             </CardTitle>
//             <div className="flex gap-2">
//               <Button
//                 variant={viewMode === "list" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("list")}
//               >
//                 <List className="h-4 w-4 mr-2" />
//                 List
//               </Button>
//               <Button
//                 variant={viewMode === "grid" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("grid")}
//               >
//                 <LayoutGrid className="h-4 w-4 mr-2" />
//                 Grid
//               </Button>
//               <Button
//                 variant={groupByJobId ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setGroupByJobId(!groupByJobId)}
//               >
//                 <GripHorizontal className="h-4 w-4 mr-2" />
//                 Group by Job ID
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {isLoading ? (
//             <div className="text-center py-8 text-gray-500">Loading MPIs...</div>
//           ) : filteredMpis.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">No MPIs found</div>
//           ) : viewMode === "list" ? (
//             renderListView()
//           ) : (
//             renderGridView()
//           )}
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
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Plus,
  Search,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  FileText,
  Eye,
  List,
  LayoutGrid,
  TrendingUp,
} from "lucide-react"
import { mpiApi } from "@/lib/mpi"
import { Mpi } from "@/types/mpi"

type ViewMode = "list" | "grid"

export default function MpiManagement() {
  const [mpis, setMpis] = useState<Mpi[]>([])
  const [filteredMpis, setFilteredMpis] = useState<Mpi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const router = useRouter()
  const [jobIdFilter, setJobIdFilter] = useState("")

  const fetchMpis = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await mpiApi.findAll()
      setMpis(data)
      setFilteredMpis(data)
    } catch (err) {
      console.error("Error fetching MPIs:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch MPIs.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMpis()
  }, [])

  useEffect(() => {
    let filtered = mpis

    if (searchTerm) {
      filtered = filtered.filter(
        (mpi) =>
          mpi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mpi.revision?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (jobIdFilter) {
      filtered = filtered.filter((mpi) => mpi.applicableJobId?.toLowerCase().includes(jobIdFilter.toLowerCase()))
    }

    setFilteredMpis(filtered)
  }, [searchTerm, jobIdFilter, mpis])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this MPI?")) {
      try {
        setDeletingId(id)
        await mpiApi.remove(id)
        await fetchMpis()
      } catch (err) {
        console.error("Error deleting MPI:", err)
        setError(err instanceof Error ? err.message : "Failed to delete MPI.")
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const handleViewMpi = (mpi: Mpi) => {
    router.push(`/dashboard/mpi/${mpi.id}`)
  }

  const handleEditMpi = (mpi: Mpi) => {
    router.push(`/dashboard/mpi/edit/${mpi.id}`)
  }

  // Calculate statistics from actual data
  const activeMpis = mpis.filter((m) => m.status === "active").length
  const draftMpis = mpis.filter((m) => m.status === "draft").length
  const archivedMpis = mpis.filter((m) => m.status === "archived").length

  const renderListView = () => (
    <div className="space-y-2">
      {filteredMpis.map((mpi) => (
        <div
          key={mpi.id}
          className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{mpi.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Rev: {mpi.revision || "N/A"}</span>
                <span>Job ID: {mpi.applicableJobId || "N/A"}</span>
                <span>Effective: {formatDate(mpi.effectiveDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(mpi.id)}
              disabled={deletingId === mpi.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {deletingId === mpi.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredMpis.map((mpi) => (
        <Card key={mpi.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{mpi.name}</h3>
                <p className="text-sm text-gray-500">Rev: {mpi.revision || "N/A"}</p>
                <p className="text-sm text-blue-600 font-medium">Job ID: {mpi.applicableJobId || "N/A"}</p>
                <p className="text-xs text-gray-400">{formatDate(mpi.effectiveDate)}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" onClick={() => handleViewMpi(mpi)} className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditMpi(mpi)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(mpi.id)}
                  disabled={deletingId === mpi.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {deletingId === mpi.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">MPI Management</h1>
        <Button
          onClick={() => router.push("/dashboard/mpi/create")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create MPI
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total MPIs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">{isLoading ? "--" : mpis.length}</div>
            <p className="text-xs text-muted-foreground">All manufacturing processes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{isLoading ? "--" : activeMpis}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{isLoading ? "--" : draftMpis}</div>
            <p className="text-xs text-muted-foreground">Under development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{isLoading ? "--" : archivedMpis}</div>
            <p className="text-xs text-muted-foreground">No longer active</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by MPI name or revision..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Filter by Job ID..."
            value={jobIdFilter}
            onChange={(e) => setJobIdFilter(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setIsRefreshing(true) || fetchMpis()} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* MPIs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
              <FileText className="h-5 w-5" />
              All MPIs
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading MPIs...</div>
          ) : filteredMpis.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No MPIs found</div>
          ) : viewMode === "list" ? (
            renderListView()
          ) : (
            renderGridView()
          )}
        </CardContent>
      </Card>
    </div>
  )
}
