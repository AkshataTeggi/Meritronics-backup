import { SpecificationType, CreateSpecificationDto, Specification, UpdateSpecificationDto } from "@/types/station"
import { API_BASE_URL } from "./constants"

// Specifications API functions
export const specificationsApi = {
  async getTypes(): Promise<SpecificationType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications/types/enum`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch specification types: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch specification types error:", error)
      throw error
    }
  },

  async create(dto: CreateSpecificationDto): Promise<Specification> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create specification: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Specification creation error:", error)
      throw error
    }
  },

  async findAll(): Promise<Specification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch specifications: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch specifications error:", error)
      throw error
    }
  },

  async findByStation(stationId: string): Promise<Specification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications?stationId=${stationId}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch specifications: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch specifications error:", error)
      throw error
    }
  },

  async findOne(id: string): Promise<Specification> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications/${id}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch specification: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch specification error:", error)
      throw error
    }
  },

  async update(id: string, dto: UpdateSpecificationDto): Promise<Specification> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update specification: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Update specification error:", error)
      throw error
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/specifications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete specification: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      console.error("Delete specification error:", error)
      throw error
    }
  },
}