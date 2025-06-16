"use client"
import EditMpiForm from "@/components/mpi/edit-mpi-form"

interface EditMpiPageProps {
  params: {
    id: string
  }
}

export default function EditMpiPage({ params }: EditMpiPageProps) {
  return <EditMpiForm mpiId={params.id} />
}
