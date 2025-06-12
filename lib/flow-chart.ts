import { CreateFlowChartDto, FlowChart, UpdateFlowChartDto } from "@/types/station"
import { API_BASE_URL } from "./constants"

// Flow Charts API functions
export const flowChartsApi = {
  async create(dto: CreateFlowChartDto, files: File[]): Promise<FlowChart> {
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

      const response = await fetch(`${API_BASE_URL}/flowcharts`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create flow chart: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Flow chart creation error:", error)
      throw error
    }
  },

  async findAll(): Promise<FlowChart[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowcharts`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch flow charts: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch flow charts error:", error)
      throw error
    }
  },

  async findOne(id: string): Promise<FlowChart> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowcharts/${id}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch flow chart: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Fetch flow chart error:", error)
      throw error
    }
  },

  async update(id: string, dto: UpdateFlowChartDto): Promise<FlowChart> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowcharts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update flow chart: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Update flow chart error:", error)
      throw error
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/flowcharts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete flow chart: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      console.error("Delete flow chart error:", error)
      throw error
    }
  },
}