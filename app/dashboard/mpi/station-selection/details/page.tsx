"use client"

import { CreateMpiWizard } from "@/components/mpi/create-mpi-wizard"
import { StationDetailsTabsPage } from "@/components/mpi/station-details-step"

export default function StationDetailsPage() {
  return (
    <div className="p-4">
      {/* Compact Wizard */}
      <div className="mb-6">
        <CreateMpiWizard />
      </div>

      {/* Station Details Content */}
      <StationDetailsTabsPage />
    </div>
  )
}
