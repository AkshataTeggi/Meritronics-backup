import { CreateMpiDto, Mpi, UpdateMpiDto } from "@/types/mpi"
import { API_BASE_URL } from "./constants"

// MPI API functions
export const mpiApi = {
  async create(dto: CreateMpiDto): Promise<Mpi> {
    try {
      console.log("Creating MPI at:", `${API_BASE_URL}/mpi`, dto)
      const response = await fetch(`${API_BASE_URL}/mpi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("MPI API error:", errorText)
        throw new Error(`Failed to create MPI: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("MPI API error:", error)
      throw error
    }
  },

  async findAll(): Promise<Mpi[]> {
    try {
      console.log("Fetching MPIs from:", `${API_BASE_URL}/mpi`)
      const response = await fetch(`${API_BASE_URL}/mpi`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("MPI API error:", errorText)
        throw new Error(`Failed to fetch MPIs: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("MPI API error:", error)
      throw error
    }
  },

  async findOne(id: string): Promise<Mpi> {
    try {
      console.log("Fetching MPI from:", `${API_BASE_URL}/mpi/${id}`)
      const response = await fetch(`${API_BASE_URL}/mpi/${id}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("MPI API error:", errorText)
        throw new Error(`Failed to fetch MPI: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("MPI API error:", error)
      throw error
    }
  },

  async update(id: string, dto: UpdateMpiDto): Promise<Mpi> {
    try {
      console.log("Updating MPI at:", `${API_BASE_URL}/mpi/${id}`, dto)
      const response = await fetch(`${API_BASE_URL}/mpi/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("MPI API error:", errorText)
        throw new Error(`Failed to update MPI: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("MPI API error:", error)
      throw error
    }
  },

  async remove(id: string): Promise<void> {
    try {
      console.log("Deleting MPI at:", `${API_BASE_URL}/mpi/${id}`)
      const response = await fetch(`${API_BASE_URL}/mpi/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("MPI API error:", errorText)
        throw new Error(`Failed to delete MPI: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("MPI API error:", error)
      throw error
    }
  },
}
