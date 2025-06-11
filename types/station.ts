export interface Station {
  id: string
  stationId: string
  name: string
  description?: string
  location?: string
  status?: "active" | "inactive" | "maintenance"
  createdAt?: string
  updatedAt?: string
}

export interface CreateStationDto {
  stationId: string
  name: string
  description?: string
  location?: string
  status?: "active" | "inactive" | "maintenance"
}

export interface UpdateStationDto {
  stationId?: string
  name?: string
  description?: string
  location?: string
  status?: "active" | "inactive" | "maintenance"
}