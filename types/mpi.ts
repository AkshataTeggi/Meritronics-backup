// MPI-specific types and enums
export type OrderType = string
export type DocumentAttachment = string
export type LocationType = string
export type EnumAttachmentType = string
export type FileAction = string

// Interface for enum API response
export interface EnumsResponse {
  Type: string[]
  OrderType: string[]
  DocumentAttachment: string[]
  LocationType: string[]
  EnumAttachmentType: string[]
  FileAction: string[]
}

// MPI types
export interface Mpi {
  applicableJobId: any
  status: string
  id: string
  name: string
  revision: string
  effectiveDate: string
  createdAt: string
  updatedAt: string
  stations?: any[]
  checklists?: Checklist[]
  services?: Service[]
  changeOrders?: ChangeOrder[]
  documentControls?: DocumentControl[]
  documentations?: any[]
  documentationFiles?: any[]
  specifications?: any[]
  flowCharts?: any[]
  technicalSpecifications?: any[]
  flowChartFiles?: any[]
}

export interface CreateMpiDto {
  name: string
  revision: string
  effectiveDate: string
}

export interface UpdateMpiDto {
  name?: string
  revision?: string
  effectiveDate?: string
}

// Service types
export interface Service {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  mpiId?: string
  mpi?: Mpi
}

export interface CreateServiceDto {
  name: string
  description?: string
  mpiId?: string
}

export interface UpdateServiceDto {
  name?: string
  description?: string
  mpiId?: string
}

// Change Order types
export interface ChangeOrder {
  id: string
  orderType: OrderType
  location: LocationType
  distributionDate?: string
  requiredBy?: string
  internalOrderNumber: string
  customer: string
  assemblyNumber: string
  revision: string
  description?: string
  applicableJobId?: string
  enumAttachmentType: EnumAttachmentType
  customerEcoNumber?: string
  customerDeviation?: string
  fileActions: FileAction[]
  briefDescription?: string
  documentAttachments: DocumentAttachment[]
  otherAttachments?: string
  notes?: string
  markComplete: boolean
  documentControl?: DocumentControl
  mpiId?: string
  mpi?: Mpi
}

export interface CreateChangeOrderDto {
  orderType: OrderType
  location: LocationType
  distributionDate?: string
  requiredBy?: string
  internalOrderNumber: string
  customer: string
  assemblyNumber: string
  revision: string
  description?: string
  applicableJobId?: string
  enumAttachmentType: EnumAttachmentType
  customerEcoNumber?: string
  customerDeviation?: string
  fileActions: FileAction[]
  briefDescription?: string
  documentAttachments: DocumentAttachment[]
  otherAttachments?: string
  notes?: string
  markComplete?: boolean
  mpiId?: string
}

export interface UpdateChangeOrderDto {
  orderType?: OrderType
  location?: LocationType
  distributionDate?: string
  requiredBy?: string
  internalOrderNumber?: string
  customer?: string
  assemblyNumber?: string
  revision?: string
  description?: string
  applicableJobId?: string
  enumAttachmentType?: EnumAttachmentType
  customerEcoNumber?: string
  customerDeviation?: string
  fileActions?: FileAction[]
  briefDescription?: string
  documentAttachments?: DocumentAttachment[]
  otherAttachments?: string
  notes?: string
  markComplete?: boolean
  mpiId?: string
}

// Document Control types
export interface DocumentControl {
  id: string
  dateProcessed?: string
  clerkName?: string
  totalPageCount?: number
  mamsDataEntry?: string
  description?: string
  enteredBy?: string
  createdAt: string
  updatedAt: string
  changeOrderId?: string
  changeOrder?: ChangeOrder
  mpiId?: string
  mpi?: Mpi
}

// Checklist types
export interface Checklist {
  remarks: any
  id: string
  description: string
  section: string
  category?: string
  isRequired: boolean
  version: string
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
  mpiId?: string
  mpi?: Mpi
}

export interface CreateChecklistDto {
  description: string
  section: string
  category?: string
  isRequired?: boolean
  version?: string
  isActive?: boolean
  createdBy?: string
  mpiId?: string
}

export interface UpdateChecklistDto {
  description?: string
  section?: string
  category?: string
  isRequired?: boolean
  version?: string
  isActive?: boolean
  createdBy?: string
  mpiId?: string
}

// Legacy types for backward compatibility
export interface ChecklistMpi {
  id: string
  mpiId: string
  checklistId: string
  value: string | null
  checklist?: Checklist
  mpi?: Mpi
}

export interface StationMpi {
  id: string
  mpiId: string
  stationId: string
  value: string | null
  station?: any
  mpi?: Mpi
}

export interface CreateChecklistMpiDto {
  mpiId: string
  checklistId: string
  value?: string
}

export interface CreateStationMpiDto {
  mpiId: string
  stationId: string
  value?: string
}

export interface UpdateChecklistMpiDto {
  value?: string
}

export interface UpdateStationMpiDto {
  value?: string
}
