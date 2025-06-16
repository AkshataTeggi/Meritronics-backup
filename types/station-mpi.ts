
interface Station {
  id: string
  stationId: string
  stationName: string
  stationCode?: string
  status?: string
  location?: string
  operator?: string
  description?: string
  addStation?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  mpiId?: string
  mpi?: {
    id: string
    name: string
    revision: string
    effectiveDate: string
    createdAt: string
    updatedAt: string
  }
  specifications?: {
    id: string
    name: string
    slug: string
    type: string
    isRequired: boolean
    isActive: boolean
    suggestions: string[]
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    stationId: string
    mpiId?: string
  }[]
  technicalSpecifications?: {
    id: string
    name: string
    value: string
    unit?: string
    createdAt: string
    updatedAt: string
  }[]
  flowCharts?: {
    id: string
    content: string
    stationId: string
    createdAt: string
    updatedAt: string
    mpiId?: string
  }[]
  documentation?: {
    id: string
    content: string
    stationId: string
    createdAt: string
    updatedAt: string
    mpiId?: string
  }[]
}
