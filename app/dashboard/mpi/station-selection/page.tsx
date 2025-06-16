"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateMpiWizard } from "@/components/mpi/create-mpi-wizard"
import StationSelectionStep from "@/components/mpi/station-selection-step"

export default function StationSelection() {
  const router = useRouter()
  const [selectedStations, setSelectedStations] = useState<string[]>([])

  const handleStationSelectionComplete = (data: { selectedStations: string[] }) => {
    console.log("Station selection completed with data:", data)
    setSelectedStations(data.selectedStations)

    // Navigate to station details page with selected stations
    const stationIds = data.selectedStations.join(",")
    router.push(`/dashboard/mpi/station-selection/details?stations=${stationIds}`)
  }

  return (
    <div className="p-4">
      {/* Compact Wizard */}
      <div className="mb-6">
        <CreateMpiWizard />
      </div>

      {/* Station Selection Content */}
      <StationSelectionStep
        onComplete={handleStationSelectionComplete}
        selectedStations={selectedStations}
        isWizardMode={false}
      />
    </div>
  )
}
