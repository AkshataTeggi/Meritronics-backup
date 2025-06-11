
export interface Mpi {
  id: string
  stationName: string
  processName: string
  parameters?: Record<string, any>
  specifications?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface CreateMpiDto {
  stationName: string
  processName: string
  parameters?: Record<string, any>
  specifications?: Record<string, any>
}

export interface UpdateMpiDto {
  stationName?: string
  processName?: string
  parameters?: Record<string, any>
  specifications?: Record<string, any>
}
