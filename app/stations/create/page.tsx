"use client"

import CreateStationForm from "@/components/station/create-mpi-form"


interface CreateStationPageProps {
  onSuccess?: () => void
}

export default function CreateStationPage({ onSuccess }: CreateStationPageProps) {
  return <CreateStationForm onSuccess={onSuccess} />
}
