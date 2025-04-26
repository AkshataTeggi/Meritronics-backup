// Station and Equipment types
export interface Equipment {
  id: string
  name: string
  status: "operational" | "maintenance" | "offline"
  type: string
  serialNumber: string
  model?: string
  manufacturer?: string
  purchaseDate?: string
  lastMaintenance?: string
  nextMaintenance?: string
  location?: string
  assignedStation?: string
  notes?: string
}

export interface Station {
  id: string
  name: string
  description: string
  type: string
  code: string
  status: "active" | "maintenance" | "inactive"
  location: string
  operator: string
  lastMaintenance: string
  nextMaintenance?: string
  efficiency: number
  equipment: Equipment[]
  createdAt: string
  updatedAt: string
}

// Common component props
export interface StationModuleProps {
  viewMode?: "grid" | "list"
  filterStatus?: string
  searchQuery?: string
}

export interface EquipmentModuleProps {
  viewMode?: "grid" | "list"
  filterStatus?: string
  searchQuery?: string
}
