// Enum types to match your Prisma schema
export type LabelLocation = "TOP" | "BOTTOM" | "LEFT" | "RIGHT"
export type BoardDirection = "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT" | "FRONT_TO_BACK" | "BACK_TO_FRONT"
export type PcbBoardSide = "TOP" | "BOTTOM" | "BOTH"

export interface Station {
  id: number
  stationId: string
  stationName: string
  labelLocation?: LabelLocation | null
  programName?: string | null
  labelFormat?: string | null
  labelRange?: string | null
  boardDirectionFirstSide?: BoardDirection | null
  boardDirectionSecondSide?: BoardDirection | null
  pcbBoardSide?: PcbBoardSide | null
  stencilName?: string | null
  stencilRevision?: string | null
  pwb?: string | null
  pwbRevision?: string | null
  stencilThickness?: string | null
  printingMaterial?: string | null
  solderPasteType?: string | null
  squeegeeType?: string | null
  squeegeeSettingsId?: number | null
  processFlowId?: number | null
  // New fields for documentation and specifications
  documentation?: string | null
  flowCharts?: string | null
  specifications?: string | null
  createdAt?: string
  updatedAt?: string
  processFlow?: ProcessFlow | null
  squeegeeSettings?: SqueegeeSettings | null
}

export interface CreateStationDto {
  stationId: string
  stationName: string
  labelLocation?: LabelLocation
  programName?: string
  labelFormat?: string
  labelRange?: string
  boardDirectionFirstSide?: BoardDirection
  boardDirectionSecondSide?: BoardDirection
  pcbBoardSide?: PcbBoardSide
  stencilName?: string
  stencilRevision?: string
  pwb?: string
  pwbRevision?: string
  stencilThickness?: string
  printingMaterial?: string
  solderPasteType?: string
  squeegeeType?: string
  squeegeeSettingsId?: number
  processFlowId?: number
  // New fields
  documentation?: string
  flowCharts?: string
  specifications?: string
}

export interface UpdateStationDto {
  stationId?: string
  stationName?: string
  labelLocation?: LabelLocation
  programName?: string
  labelFormat?: string
  labelRange?: string
  boardDirectionFirstSide?: BoardDirection
  boardDirectionSecondSide?: BoardDirection
  pcbBoardSide?: PcbBoardSide
  stencilName?: string
  stencilRevision?: string
  pwb?: string
  pwbRevision?: string
  stencilThickness?: string
  printingMaterial?: string
  solderPasteType?: string
  squeegeeType?: string
  squeegeeSettingsId?: number
  processFlowId?: number
  // New fields
  documentation?: string
  flowCharts?: string
  specifications?: string
}

// Process Flow type
export interface ProcessFlow {
  id: number
  fileName: string
  filePath: string
  fileSize: number
  createdAt: string
  updatedAt: string
}

// Squeegee Settings type
export interface SqueegeeSettings {
  id: number
  // Add other fields as needed
  createdAt?: string
  updatedAt?: string
}
