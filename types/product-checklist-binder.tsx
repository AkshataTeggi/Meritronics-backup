
export interface ProductChecklistBinder {
  id: string
  productName: string
  productCode: string
  revision: string
  effectiveDate: string
  description?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  checklists?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  description: string
  section: string
  category?: string
  isRequired: boolean
  remarks?: string
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
  mpiId?: string
}

export interface CreateProductChecklistBinderDto {
  productName: string
  productCode: string
  revision: string
  effectiveDate: string
  description?: string
  isActive?: boolean
  createdBy: string
  checklistIds?: string[]
}