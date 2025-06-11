export interface Station {
  id: number
  stationId: string
  stationName: string
  labelLocation?: string
  programName?: string
  labelFormat?: string
  labelRange?: string
  boardDirectionFirstSide?: string
  boardDirectionSecondSide?: string
  pcbBoardSide?: string
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
  createdAt?: string
  updatedAt?: string
}

export interface CreateStationDto {
  stationId: string
  stationName: string
  labelLocation?: string
  programName?: string
  labelFormat?: string
  labelRange?: string
  boardDirectionFirstSide?: string
  boardDirectionSecondSide?: string
  pcbBoardSide?: string
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
}

export interface UpdateStationDto {
  stationId?: string
  stationName?: string
  labelLocation?: string
  programName?: string
  labelFormat?: string
  labelRange?: string
  boardDirectionFirstSide?: string
  boardDirectionSecondSide?: string
  pcbBoardSide?: string
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
}