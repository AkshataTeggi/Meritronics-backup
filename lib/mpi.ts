import { CreateMpiDto, Mpi, UpdateMpiDto } from "@/types/mpi"
import { API_BASE_URL } from "./constants"

// MPI API functions
export const mpiApi = {
  async create(dto: CreateMpiDto): Promise<Mpi> {
    const response = await fetch(`${API_BASE_URL}/mpi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw new Error("Failed to create MPI")
    return response.json()
  },

  async findAll(): Promise<Mpi[]> {
    const response = await fetch(`${API_BASE_URL}/mpi`)
    if (!response.ok) throw new Error("Failed to fetch MPIs")
    return response.json()
  },

  async findOne(id: string): Promise<Mpi> {
    const response = await fetch(`${API_BASE_URL}/mpi/${id}`)
    if (!response.ok) throw new Error("Failed to fetch MPI")
    return response.json()
  },

  async findByStationName(stationName: string): Promise<Mpi[]> {
    const response = await fetch(`${API_BASE_URL}/mpi/search/${stationName}`)
    if (!response.ok) throw new Error("Failed to fetch MPIs by station")
    return response.json()
  },

  async update(id: string, dto: UpdateMpiDto): Promise<Mpi> {
    const response = await fetch(`${API_BASE_URL}/mpi/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw new Error("Failed to update MPI")
    return response.json()
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mpi/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete MPI")
  },
}
