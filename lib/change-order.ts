import { ChangeOrderEnums } from "@/types/change-order"
import { CreateChangeOrderDto, ChangeOrder, UpdateChangeOrderDto } from "@/types/mpi"
import { API_BASE_URL } from "./constants"

class ChangeOrderApi {
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

  // Create a new change order
  async create(data: CreateChangeOrderDto): Promise<ChangeOrder> {
    return this.request<ChangeOrder>("/change-orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Get all change orders
  async findAll(): Promise<ChangeOrder[]> {
    return this.request<ChangeOrder[]>("/change-orders")
  }

  // Get a specific change order by ID
  async findOne(id: string): Promise<ChangeOrder> {
    return this.request<ChangeOrder>(`/change-orders/${id}`)
  }

  // Update a change order
  async update(id: string, data: UpdateChangeOrderDto): Promise<ChangeOrder> {
    return this.request<ChangeOrder>(`/change-orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Delete a change order
  async remove(id: string): Promise<void> {
    return this.request<void>(`/change-orders/${id}`, {
      method: "DELETE",
    })
  }

  // Get enums for dropdowns and form validation
  async getEnums(): Promise<ChangeOrderEnums> {
    return this.request<ChangeOrderEnums>("/change-orders/enums")
  }
}

// Export API instance
export const changeOrderApi = new ChangeOrderApi(API_BASE_URL)

// Export types for convenience
export type {
  ChangeOrderEnums,
  OrderType,
  AttachmentType,
  FileAction,
  DocumentAttachment,
} from "@/types/change-order"
