import { API_BASE_URL } from "./constants"

export interface ChecklistItem {
  id: string
  description: string
  category: string | null
  required: boolean
  remarks: string | null
  isActive: boolean
  createdBy: string | null
  sectionId: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistSection {
  id: string
  name: string
  mpiId: string | null
  createdAt: string
  updatedAt: string
  checklistItems: ChecklistItem[]
}

export class ChecklistAPI {
  static async getAllChecklistSections(): Promise<ChecklistSection[]> {
    const response = await fetch(`${API_BASE_URL}/checklists`)
    if (!response.ok) {
      throw new Error("Failed to fetch checklists")
    }
    return response.json()
  }

  static async getChecklistSectionById(id: string): Promise<ChecklistSection> {
    const response = await fetch(`${API_BASE_URL}/checklists/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch checklist")
    }
    return response.json()
  }

  // Update checklist section (this will update the entire section including items)
  static async updateChecklistSection(
    sectionId: string,
    updates: Partial<ChecklistSection>,
  ): Promise<ChecklistSection> {
    console.log("Updating checklist section:", sectionId, updates)

    const response = await fetch(`${API_BASE_URL}/checklists/${sectionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to update checklist section:", response.status, errorText)
      throw new Error(`Failed to update checklist section: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("Updated checklist section result:", result)
    return result
  }

  // Create new checklist section
  static async createChecklistSection(data: Partial<ChecklistSection>): Promise<ChecklistSection> {
    console.log("Creating checklist section:", data)

    const response = await fetch(`${API_BASE_URL}/checklists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to create checklist section:", response.status, errorText)
      throw new Error(`Failed to create checklist section: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("Created checklist section result:", result)
    return result
  }

  // Delete checklist section
  static async deleteChecklistSection(sectionId: string): Promise<void> {
    console.log("Deleting checklist section:", sectionId)

    const response = await fetch(`${API_BASE_URL}/checklists/${sectionId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to delete checklist section:", response.status, errorText)
      throw new Error(`Failed to delete checklist section: ${response.status} ${errorText}`)
    }

    console.log("Deleted checklist section:", sectionId)
  }
}
