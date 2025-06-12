import { CreateStationDto, Station, UpdateStationDto, SpecificationType, CreateSpecificationDto, Specification, UpdateSpecificationDto, CreateTechnicalSpecificationDto, TechnicalSpecification, UpdateTechnicalSpecificationDto, CreateDocumentationDto, Documentation, UpdateDocumentationDto, CreateFlowChartDto, FlowChart, UpdateFlowChartDto } from "@/types/station"
import { API_BASE_URL } from "./constants"


// Station API functions
export const stationApi = {
  async create(dto: CreateStationDto): Promise<Station> {
    try {
      const response = await fetch(`${API_BASE_URL}/stations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create station: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Station creation error:", error)
      throw error
    }
  },

  async findAll(): Promise<Station[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stations`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch stations error:", error)
      throw error
    }
  },

  async findOne(stationId: string): Promise<Station> {
    try {
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch station: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch station error:", error)
      throw error
    }
  },

  async update(stationId: string, dto: UpdateStationDto): Promise<Station> {
    try {
      console.log(`Updating station with ID: ${stationId}`, dto)
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update station: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Station update response:", data)
      return data
    } catch (error) {
      console.error("Update station error:", error)
      throw error
    }
  },

  async remove(stationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete station: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      console.error("Delete station error:", error)
      throw error
    }
  },
}

