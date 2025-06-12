import { CreateStationDto, Station, UpdateStationDto } from "@/types/station"
import { API_BASE_URL } from "./constants"


// Station API functions
export const stationApi = {
  async create(dto: CreateStationDto): Promise<Station> {
    const response = await fetch(`${API_BASE_URL}/stations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw new Error("Failed to create station")
    return response.json()
  },

  async findAll(): Promise<Station[]> {
    const response = await fetch(`${API_BASE_URL}/stations`)
    if (!response.ok) throw new Error("Failed to fetch stations")
    return response.json()
  },

  async findOne(stationId: string): Promise<Station> {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}`)
    if (!response.ok) throw new Error("Failed to fetch station")
    return response.json()
  },

  async update(stationId: string, dto: UpdateStationDto): Promise<Station> {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    if (!response.ok) throw new Error("Failed to update station")
    return response.json()
  },

  async remove(stationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete station")
  },
}