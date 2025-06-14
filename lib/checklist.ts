// import { CreateChecklistDto, Checklist, UpdateChecklistDto } from "@/types/mpi"
// import { API_BASE_URL } from "./constants"

import { Checklist } from "@/types/mpi"
import { API_BASE_URL } from "./constants"


// export async function createChecklist(data: CreateChecklistDto): Promise<Checklist> {
//   const response = await fetch(`${API_BASE_URL}/checklists`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to create checklist")
//   }

//   return response.json()
// }

// export async function getAllChecklists(): Promise<Checklist[]> {
//   const response = await fetch(`${API_BASE_URL}/checklists`)

//   if (!response.ok) {
//     throw new Error("Failed to fetch checklists")
//   }

//   return response.json()
// }

// export async function getChecklist(id: string): Promise<Checklist> {
//   const response = await fetch(`${API_BASE_URL}/checklists/${id}`)

//   if (!response.ok) {
//     throw new Error(`Failed to fetch checklist with id ${id}`)
//   }

//   return response.json()
// }

// export async function updateChecklist(id: string, data: UpdateChecklistDto): Promise<Checklist> {
//   const response = await fetch(`${API_BASE_URL}/checklists/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to update checklist with id ${id}`)
//   }

//   return response.json()
// }

// export async function deleteChecklist(id: string): Promise<void> {
//   const response = await fetch(`${API_BASE_URL}/checklists/${id}`, {
//     method: "DELETE",
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to delete checklist with id ${id}`)
//   }
// }








// Checklist API functions
export const checklistApi = {
  async findAll(): Promise<Checklist[]> {
    const response = await fetch(`${API_BASE_URL}/checklists`)
    if (!response.ok) {
      throw new Error("Failed to fetch checklists")
    }
    return response.json()
  },

  async findOne(id: string): Promise<Checklist> {
    const response = await fetch(`${API_BASE_URL}/checklists/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch checklist with id ${id}`)
    }
    return response.json()
  },
}