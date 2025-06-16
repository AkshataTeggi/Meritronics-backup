
export interface MPI {
  id: string
  name: string
  revision: string
  effectiveDate: string
  createdAt: string
  updatedAt: string
}

export interface Specification {
  id: string
  name: string
  slug: string
  type: "TEXT" | "NUMBER" | "BOOLEAN_TYPE" | "DATE" | "DROPDOWN"
  isRequired: boolean
  isActive: boolean
  suggestions: string[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  stationId: string
  mpiId: string | null
}

export interface TechnicalSpecification {
  id: string
  name: string
  value: string
  stationId: string
  mpiId?: string | null
}

export interface FlowChart {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  mpiId: string | null
}

export interface Documentation {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  mpiId: string | null
}

export interface Station {
  id: string
  stationId: string
  stationName: string
  status: string
  stationCode: string
  description: string
  location: string
  operator: string
  addStation: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  mpiId?: string | null
  mpi?: MPI | null
  technicalSpecifications: TechnicalSpecification[]
  specifications: Specification[]
  flowCharts: FlowChart[]
  documentation: Documentation[]
}






