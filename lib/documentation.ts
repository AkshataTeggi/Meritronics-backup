import { CreateDocumentationDto, Documentation, UpdateDocumentationDto } from "@/types/station"
import { API_BASE_URL } from "./constants"

// Documentation API functions
export const documentationApi = {
  async create(dto: CreateDocumentationDto, files: File[]): Promise<Documentation> {
    try {
      const formData = new FormData()

      // Add the DTO data
      formData.append("content", dto.content)
      formData.append("stationId", dto.stationId)

      // Add files
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      const response = await fetch(`${API_BASE_URL}/documentation`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create documentation: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Documentation creation error:", error)
      throw error
    }
  },

  async findAll(): Promise<Documentation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/documentation`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch documentation error:", error)
      throw error
    }
  },

  async findOne(id: string): Promise<Documentation> {
    try {
      const response = await fetch(`${API_BASE_URL}/documentation/${id}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch documentation error:", error)
      throw error
    }
  },

  async update(id: string, dto: UpdateDocumentationDto): Promise<Documentation> {
    try {
      const response = await fetch(`${API_BASE_URL}/documentation/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update documentation: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Update documentation error:", error)
      throw error
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/documentation/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete documentation: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      console.error("Delete documentation error:", error)
      throw error
    }
  },
}
