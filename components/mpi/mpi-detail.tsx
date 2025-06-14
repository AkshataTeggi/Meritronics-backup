"use client"

import { useState, useEffect } from "react"
import type { Mpi } from "@/types/mpi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { getMpi } from "@/lib/mpi"

interface MpiDetailProps {
  id: string
}

export function MpiDetail({ id }: MpiDetailProps) {
  const [mpi, setMpi] = useState<Mpi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMpi = async () => {
      try {
        const data = await getMpi(id)
        setMpi(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch MPI details")
        setLoading(false)
      }
    }

    fetchMpi()
  }, [id])

  if (loading) return <div className="flex justify-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!mpi) return <div className="p-4">MPI not found</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mpi.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p>{mpi.description || "No description provided"}</p>
          </div>
          {mpi.createdAt && (
            <div>
              <h3 className="font-medium">Created At</h3>
              <p>{new Date(mpi.createdAt).toLocaleString()}</p>
            </div>
          )}
          {mpi.updatedAt && (
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p>{new Date(mpi.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/mpis/${id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
