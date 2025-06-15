// Checklist types
export interface ChecklistItem {
  id: string
  description: string
  isCompleted: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Checklist {
  id: string
  name: string
  description?: string
  category: string
  version: string
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
  items?: ChecklistItem[]
  mpiId?: string
  mpi?: any
}

export interface CreateChecklistDto {
  name: string
  description?: string
  category: string
  version?: string
  isActive?: boolean
  createdBy?: string
  mpiId?: string
}

export interface UpdateChecklistDto {
  name?: string
  description?: string
  category?: string
  version?: string
  isActive?: boolean
  createdBy?: string
  mpiId?: string
}

export interface CreateChecklistItemDto {
  description: string
  isCompleted?: boolean
  notes?: string
  checklistId: string
}

export interface UpdateChecklistItemDto {
  description?: string
  isCompleted?: boolean
  notes?: string
}

// Product Checklist Binder specific types
export interface ProductChecklistBinder {
  id: string
  productName: string
  productCode: string
  revision: string
  effectiveDate: string
  checklists: Checklist[]
  createdAt: string
  updatedAt: string
  mpiId?: string
}

export interface CreateProductChecklistBinderDto {
  productName: string
  productCode: string
  revision: string
  effectiveDate: string
  mpiId?: string
}

export interface UpdateProductChecklistBinderDto {
  productName?: string
  productCode?: string
  revision?: string
  effectiveDate?: string
  mpiId?: string
}











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