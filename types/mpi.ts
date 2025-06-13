
// export interface Mpi {
//   id: string
//   revision?: string
//   effectiveDate?: string
//   purpose?: string
//   scope?: string
//   equipment?: string
//   materials?: string
//   responsibilities?: string
//   procedure?: string
//   safety?: string
//   processControl?: string
//   stationName: string
//   createdAt?: string
//   updatedAt?: string
// }

import { Station } from "./station"

// export interface CreateMpiDto {
//   revision?: string
//   effectiveDate?: string
//   purpose?: string
//   scope?: string
//   equipment?: string
//   materials?: string
//   responsibilities?: string
//   procedure?: string
//   safety?: string
//   processControl?: string
//   stationName: string
// }


// export interface UpdateMpiDto {
//   revision?: string
//   effectiveDate?: string
//   purpose?: string
//   scope?: string
//   equipment?: string
//   materials?: string
//   responsibilities?: string
//   procedure?: string
//   safety?: string
//   processControl?: string
//   stationName?: string
// }


















// Updated Checklist Types based on your Product Binder Checklist
export type ChecklistSection =
  | "production_information"
  | "customer_supplied_information"
  | "pre_production_preparation"
  | "surface_mount_area"
  | "manual_placement_wave_solder"
  | "modification_area"
  | "qc_area"
  | "mechanical_assembly"
  | "test_area"
  | "shipping_area"

export type RequirementStatus = "YES" | "NO" | "N/A"

export interface ChecklistItem {
  id: string
  description: string
  section: ChecklistSection
  isRequired: boolean
  status: RequirementStatus
  remark?: string
  order: number
  // Additional fields for manufacturing context
  estimatedTime?: number // in minutes
  tools?: string[]
  materials?: string[]
  safetyNotes?: string[]
  qualityCheckpoints?: string[]
  dependencies?: string[] // IDs of other checklist items that must be completed first
}

export interface Checklist {
  id: string
  name: string
  description: string
  version: string
  category: "product_binder" | "station_specific" | "process_specific" | "quality_control"
  isActive: boolean
  items: ChecklistItem[]
  sections: {
    [key in ChecklistSection]: {
      title: string
      description: string
      items: ChecklistItem[]
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  // Compliance and audit fields
  lastReviewed?: string
  reviewedBy?: string
  approvalRequired: boolean
  approvedBy?: string
  approvedAt?: string
}

export interface CreateChecklistDto {
  name: string
  description: string
  version: string
  category: "product_binder" | "station_specific" | "process_specific" | "quality_control"
  items: Omit<ChecklistItem, "id">[]
  approvalRequired?: boolean
}

export interface UpdateChecklistDto {
  name?: string
  description?: string
  version?: string
  category?: "product_binder" | "station_specific" | "process_specific" | "quality_control"
  isActive?: boolean
  items?: Omit<ChecklistItem, "id">[]
  approvalRequired?: boolean
  approvedBy?: string
  approvedAt?: string
}

// Updated MPI Types with checklist integration
export interface Mpi {
  id: string
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName: string
  stationId?: string
  stationInfo?: Station
  setupInstructions?: string
  operatingInstructions?: string
  qualityInstructions?: string
  troubleshootingInstructions?: string
  maintenanceInstructions?: string
  shutdownInstructions?: string
  createdAt?: string
  updatedAt?: string
  station?: Station
  // Checklist-based MPI fields
  checklistId?: string
  checklist?: Checklist
  completedItems?: {
    itemId: string
    status: RequirementStatus
    completedBy?: string
    completedAt?: string
    remark?: string
  }[]
  complianceStatus: "pending" | "in_progress" | "completed" | "approved" | "rejected"
  parameters?: Record<string, any>
  specifications?: Record<string, any>
  processName?: string
}

export interface CreateMpiDto {
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName: string
  stationId?: string
  setupInstructions?: string
  operatingInstructions?: string
  qualityInstructions?: string
  troubleshootingInstructions?: string
  maintenanceInstructions?: string
  shutdownInstructions?: string
  // Checklist-based MPI fields
  checklistId?: string
  parameters?: Record<string, any>
  specifications?: Record<string, any>
  processName?: string
}

export interface UpdateMpiDto {
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName?: string
  stationId?: string
  setupInstructions?: string
  operatingInstructions?: string
  qualityInstructions?: string
  troubleshootingInstructions?: string
  maintenanceInstructions?: string
  shutdownInstructions?: string
  checklistId?: string
  completedItems?: {
    itemId: string
    status: RequirementStatus
    completedBy?: string
    completedAt?: string
    remark?: string
  }[]
  complianceStatus?: "pending" | "in_progress" | "completed" | "approved" | "rejected"
  parameters?: Record<string, any>
  specifications?: Record<string, any>
  processName?: string
}
