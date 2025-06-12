import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { StationDetailView } from "@/components/station/station-details"
import { stationApi } from "@/lib/stations"

interface StationDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function StationDetailContent({ stationId }: { stationId: string }) {
  try {
    const station = await stationApi.findOne(stationId)

    if (!station) {
      notFound()
    }

    return <StationDetailView station={station} />
  } catch (error) {
    console.error("Error fetching station:", error)
    notFound()
  }
}

function StationDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default async function StationDetailPage({ params }: StationDetailPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      {/* Header with back button */}
     <div className="flex items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold">Station Details</h1>
  </div>
  <Link href="/dashboard/stations">
    <Button variant="outline" size="sm">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Stations
    </Button>
  </Link>
</div>


      {/* Station detail content */}
      <Suspense fallback={<StationDetailSkeleton />}>
        <StationDetailContent stationId={id} />
      </Suspense>
    </div>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: StationDetailPageProps) {
  try {
    const { id } = await params
    const station = await stationApi.findOne(id)
    return {
      title: `${station?.stationName || "Station"} - Manufacturing Dashboard`,
      description: `View details for ${station?.stationName || "station"} including specifications, documentation, and flow charts.`,
    }
  } catch {
    return {
      title: "Station Details - Manufacturing Dashboard",
      description: "View station details and specifications",
    }
  }
}
