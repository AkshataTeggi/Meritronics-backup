import { ReactNode } from "react"

export type SpecificationType = string


export interface FileUpload {
  id: string
  name: string
  size: number
  url: string
  createdAt: string
  flowChartId?: string
  documentationId?: string
}

export interface Specification {
  id: string
  name: string
  slug: string
  type: SpecificationType
  isRequired: boolean
  isActive: boolean
  suggestions: string[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  stationId: string
}

export interface TechnicalSpecification {
  id: number
  name: string
  value: string
  stationId: string
}

export interface FlowChart {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  files: FileUpload[]
}

export interface Documentation {
  id: string
  content: string
  stationId: string
  createdAt: string
  updatedAt: string
  files: FileUpload[]
}

export interface Station {
  id: string
  stationId: string
  stationName: string
  status: string
  stationCode?: string // Changed from staticCode
  description?: string
  location?: string
  operator?: string
  addStation?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  specifications: Specification[]
  technicalSpecifications: TechnicalSpecification[]
  flowCharts: FlowChart[]
  documentation: Documentation[]
}

export interface CreateStationDto {
  stationId: string
  stationName: string
  status?: string
  stationCode?: string // Changed from staticCode
  description?: string
  location?: string
  operator?: string
  addStation?: string
  specifications?: CreateSpecificationDto[]
}

export interface UpdateStationDto {
  stationId?: string
  stationName?: string
  status?: string
  stationCode?: string // Changed from staticCode
  description?: string
  location?: string
  operator?: string
  addStation?: string
}

export interface CreateSpecificationDto {
  name: string
  slug: string
  type: SpecificationType
  isRequired: boolean
  isActive: boolean
  suggestions: string[]
  stationId: string
}

export interface UpdateSpecificationDto {
  name?: string
  slug?: string
  type?: SpecificationType
  isRequired?: boolean
  isActive?: boolean
  suggestions?: string[]
}

export interface CreateTechnicalSpecificationDto {
  name: string
  value: string
  stationId: string
}

export interface UpdateTechnicalSpecificationDto {
  name?: string
  value?: string
}

export interface CreateFlowChartDto {
  content: string
  stationId: string
  files?: File[]
}

export interface UpdateFlowChartDto {
  content?: string
}

export interface CreateDocumentationDto {
  content: string
  stationId: string
  files?: File[]
}

export interface UpdateDocumentationDto {
  content?: string
}