import { CreateTechnicalSpecificationDto, TechnicalSpecification, UpdateTechnicalSpecificationDto } from "@/types/station"
import { API_BASE_URL } from "./constants"

// Technical Specifications API functions
export const technicalSpecificationsApi = {
  async create(dto: CreateTechnicalSpecificationDto): Promise<TechnicalSpecification> {
    try {
      const response = await fetch(`${API_BASE_URL}/technical-specifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to create technical specification: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      return response.json()
    } catch (error) {
      console.error("Technical specification creation error:", error)
      throw error
    }
  },

  async findAll(): Promise<TechnicalSpecification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/technical-specifications`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to fetch technical specifications: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      return response.json()
    } catch (error) {
      console.error("Fetch technical specifications error:", error)
      throw error
    }
  },

  async findOne(id: number): Promise<TechnicalSpecification> {
    try {
      const response = await fetch(`${API_BASE_URL}/technical-specifications/${id}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to fetch technical specification: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      return response.json()
    } catch (error) {
      console.error("Fetch technical specification error:", error)
      throw error
    }
  },

  async update(id: number, dto: UpdateTechnicalSpecificationDto): Promise<TechnicalSpecification> {
    try {
      const response = await fetch(`${API_BASE_URL}/technical-specifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to update technical specification: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      return response.json()
    } catch (error) {
      console.error("Update technical specification error:", error)
      throw error
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/technical-specifications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to delete technical specification: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }
    } catch (error) {
      console.error("Delete technical specification error:", error)
      throw error
    }
  },
}
