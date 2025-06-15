"use client"

import { CreateMpiWizard } from "@/components/mpi/create-mpi-wizard"
import { StationDetailsTabsPage } from "@/components/mpi/station-details-step"


export default function StationDetailsPage() {
  return (
    <div className="space-y-6">
      <CreateMpiWizard />
      <StationDetailsTabsPage />
    </div>
  )
}
