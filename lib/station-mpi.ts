import { CreateStationMpiDto, StationMpi, UpdateStationMpiDto } from "@/types/mpi"
import { API_BASE_URL } from "./constants"

// Station-MPI API functions
export const stationMpiApi = {
  async create(dto: CreateStationMpiDto): Promise<StationMpi> {
    const response = await fetch(`${API_BASE_URL}/station-mpis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) {
      throw new Error("Failed to create station-MPI association")
    }
    return response.json()
  },

  async findAll(): Promise<StationMpi[]> {
    const response = await fetch(`${API_BASE_URL}/station-mpis`)
    if (!response.ok) {
      throw new Error("Failed to fetch station-MPI associations")
    }
    return response.json()
  },

  async findOne(id: string): Promise<StationMpi> {
    const response = await fetch(`${API_BASE_URL}/station-mpis/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch station-MPI association with id ${id}`)
    }
    return response.json()
  },

  async update(id: string, dto: UpdateStationMpiDto): Promise<StationMpi> {
    const response = await fetch(`${API_BASE_URL}/station-mpis/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) {
      throw new Error(`Failed to update station-MPI association with id ${id}`)
    }
    return response.json()
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/station-mpis/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Failed to delete station-MPI association with id ${id}`)
    }
  },
}
