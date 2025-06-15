"use client"

import { CreateMpiWizard } from "@/components/mpi/create-mpi-wizard"
import { StationSelectionPage } from "@/components/mpi/station-selection-step"

export default function StationSelection() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Station Selection</h1>
          <p className="text-muted-foreground mt-1">Select multiple stations for your MPI process</p>
        </div>
      </div>

      {/* Station Selection Content - Above Wizard */}
      <StationSelectionPage />

      {/* MPI Wizard - Below Station Selection */}
      <div className="border-t pt-6">
        <CreateMpiWizard />
      </div>
    </div>
  )
}
