"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get created IDs from URL params or session storage
  const changeOrderId = searchParams.get("changeOrderId") || undefined
  const checklistIds = searchParams.get("checklistIds")?.split(",") || []
  const stationIds = searchParams.get("stationIds")?.split(",") || []

  const createdIds = {
    changeOrderId,
    checklistIds: checklistIds.length > 0 ? checklistIds : undefined,
    stationIds: stationIds.length > 0 ? stationIds : undefined,
  }

  const handleCreateMpi = async () => {
    try {
      // Create final MPI with all the created IDs
      const mpiData = {
        name: "New MPI",
        revision: "1.0",
        effectiveDate: new Date().toISOString(),
        changeOrderIds: changeOrderId ? [changeOrderId] : [],
        checklistIds: checklistIds || [],
        stationIds: stationIds || [],
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mpi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mpiData),
      })

      if (!response.ok) {
        throw new Error("Failed to create MPI")
      }

      const createdMpi = await response.json()
      console.log("MPI created successfully:", createdMpi)

      router.push("/dashboard/mpi")
    } catch (error) {
      console.error("Error creating MPI:", error)
      throw error
    }
  }

  const handleSaveAsDraft = () => {
    console.log("Saving as draft...")
    router.push("/dashboard/mpi")
  }

  return <MpiCreationReview createdIds={createdIds} onCreateMpi={handleCreateMpi} onSaveAsDraft={handleSaveAsDraft} />
}
