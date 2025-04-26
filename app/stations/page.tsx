"use client"

import { useState } from "react"
import MainLayout from "@/components/main-layout"
import StationModule from "@/components/station/station-module"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

export default function StationsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Stations</h1>
          <div className="bg-gray-100 rounded-md p-1 flex">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 flex items-center justify-center"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 flex items-center justify-center"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Station Cards */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <StationModule
            viewMode={viewMode}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>
      </div>
    </MainLayout>
  )
}
