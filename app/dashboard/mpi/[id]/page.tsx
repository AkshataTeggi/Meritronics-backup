"use client"

import MpiDetails from "@/components/mpi/mpi-detail"

interface MpiDetailsPageProps {
  params: {
    id: string
  }
}

export default function MpiDetailsPage({ params }: MpiDetailsPageProps) {
  return <MpiDetails mpiId={params.id} />
}
