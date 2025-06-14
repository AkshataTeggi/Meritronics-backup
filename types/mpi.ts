// Checklist types
export interface Checklist {
  id: string
  description: string
  section: string
  category: string
  isRequired: boolean
  version: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

// MPI types
export interface Mpi {
  id: string
  jobId: string
  assemblyId: string
  checklistMpis: ChecklistMpi[]
  stationMpis: StationMpi[]
}

export interface CreateMpiDto {
  jobId: string
  assemblyId: string
}

export interface UpdateMpiDto {
  jobId?: string
  assemblyId?: string
}

// Checklist-MPI types
export interface ChecklistMpi {
  id: string
  mpiId: string
  checklistId: string
  value: string | null
  checklist?: Checklist
}

export interface CreateChecklistMpiDto {
  mpiId: string
  checklistId: string
  value?: string
}

export interface UpdateChecklistMpiDto {
  value?: string
}

// Station-MPI types
export interface StationMpi {
  id: string
  mpiId: string
  stationId: string
  value: string | null
  station?: Station
}

export interface CreateStationMpiDto {
  mpiId: string
  stationId: string
  value?: string
}

export interface UpdateStationMpiDto {
  value?: string
}

// Re-export existing Station types
export interface Station {
  id: string
  stationId: string
  stationName: string
  status: string
  stationCode?: string
  description?: string
  location?: string
  operator?: string
  addStation?: string | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  technicalSpecifications: any[]
  specifications: any[]
  flowCharts: any[]
  documentation: any[]
}
