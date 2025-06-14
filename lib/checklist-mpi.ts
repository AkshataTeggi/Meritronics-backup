import { CreateChecklistMpiDto, ChecklistMpi, UpdateChecklistMpiDto } from "@/types/mpi"
import { API_BASE_URL } from "./constants"

// Checklist-MPI API functions
export const checklistMpiApi = {
  async create(dto: CreateChecklistMpiDto): Promise<ChecklistMpi> {
    const response = await fetch(`${API_BASE_URL}/checklist-mpis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) {
      throw new Error("Failed to create checklist-MPI association")
    }
    return response.json()
  },

  async findAll(): Promise<ChecklistMpi[]> {
    const response = await fetch(`${API_BASE_URL}/checklist-mpis`)
    if (!response.ok) {
      throw new Error("Failed to fetch checklist-MPI associations")
    }
    return response.json()
  },

  async findOne(id: string): Promise<ChecklistMpi> {
    const response = await fetch(`${API_BASE_URL}/checklist-mpis/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch checklist-MPI association with id ${id}`)
    }
    return response.json()
  },

  async update(id: string, dto: UpdateChecklistMpiDto): Promise<ChecklistMpi> {
    const response = await fetch(`${API_BASE_URL}/checklist-mpis/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) {
      throw new Error(`Failed to update checklist-MPI association with id ${id}`)
    }
    return response.json()
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/checklist-mpis/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Failed to delete checklist-MPI association with id ${id}`)
    }
  },
}