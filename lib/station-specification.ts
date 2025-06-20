import { API_BASE_URL } from "../constants"

export interface StationSpecification {
  id: string
  name: string
  type: "text" | "number" | "select" | "boolean"
  unit?: string
  required: boolean
  options?: string[]
  defaultValue?: string
  description?: string
}

export interface StationSpecificationResponse {
  stationId: string
  stationName: string
  specifications: StationSpecification[]
  technicalSpecifications: StationSpecification[]
}

class StationSpecificationsApi {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get specifications for a specific station
  async getStationSpecifications(stationId: string): Promise<StationSpecificationResponse> {
    return this.request<StationSpecificationResponse>(`/stations/${stationId}/specifications`)
  }

  // Get specifications for multiple stations
  async getMultipleStationSpecifications(stationIds: string[]): Promise<StationSpecificationResponse[]> {
    const promises = stationIds.map((id) => this.getStationSpecifications(id))
    return Promise.all(promises)
  }

  // Mock data for development - replace with actual API calls
  async getMockStationSpecifications(stationId: string): Promise<StationSpecificationResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockSpecs: Record<string, StationSpecificationResponse> = {
      "station-1": {
        stationId: "station-1",
        stationName: "SMT Station",
        specifications: [
          {
            id: "temp-range",
            name: "Temperature Range",
            type: "text",
            unit: "°C",
            required: true,
            description: "Operating temperature range",
          },
          {
            id: "humidity",
            name: "Humidity Level",
            type: "number",
            unit: "%",
            required: true,
            description: "Relative humidity percentage",
          },
          {
            id: "pressure",
            name: "Air Pressure",
            type: "number",
            unit: "PSI",
            required: false,
            description: "Air pressure for pneumatic systems",
          },
        ],
        technicalSpecifications: [
          {
            id: "voltage",
            name: "Operating Voltage",
            type: "number",
            unit: "V",
            required: true,
            description: "Main operating voltage",
          },
          {
            id: "current",
            name: "Current Draw",
            type: "number",
            unit: "A",
            required: true,
            description: "Maximum current consumption",
          },
          {
            id: "frequency",
            name: "Operating Frequency",
            type: "number",
            unit: "Hz",
            required: false,
            description: "Operating frequency range",
          },
        ],
      },
      "station-2": {
        stationId: "station-2",
        stationName: "Test Station",
        specifications: [
          {
            id: "test-voltage",
            name: "Test Voltage",
            type: "number",
            unit: "V",
            required: true,
            description: "Voltage for testing procedures",
          },
          {
            id: "test-duration",
            name: "Test Duration",
            type: "number",
            unit: "min",
            required: true,
            description: "Duration of test cycle",
          },
        ],
        technicalSpecifications: [
          {
            id: "accuracy",
            name: "Measurement Accuracy",
            type: "text",
            unit: "%",
            required: true,
            description: "Measurement accuracy specification",
          },
          {
            id: "resolution",
            name: "Resolution",
            type: "text",
            unit: "bits",
            required: true,
            description: "Measurement resolution",
          },
        ],
      },
      "station-3": {
        stationId: "station-3",
        stationName: "AOI Station",
        specifications: [
          {
            id: "lighting",
            name: "Lighting Intensity",
            type: "number",
            unit: "lux",
            required: true,
            description: "Lighting intensity for inspection",
          },
          {
            id: "camera-resolution",
            name: "Camera Resolution",
            type: "select",
            options: ["1080p", "4K", "8K"],
            required: true,
            description: "Camera resolution setting",
          },
        ],
        technicalSpecifications: [
          {
            id: "processing-speed",
            name: "Processing Speed",
            type: "number",
            unit: "fps",
            required: true,
            description: "Image processing speed",
          },
          {
            id: "detection-accuracy",
            name: "Detection Accuracy",
            type: "number",
            unit: "%",
            required: true,
            description: "Defect detection accuracy",
          },
        ],
      },
    }

    return (
      mockSpecs[stationId] || {
        stationId,
        stationName: `Station ${stationId}`,
        specifications: [],
        technicalSpecifications: [],
      }
    )
  }
}

// Export API instance
export const stationSpecificationsApi = new StationSpecificationsApi(API_BASE_URL)
