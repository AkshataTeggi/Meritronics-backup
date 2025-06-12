
export interface Mpi {
  id: string
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateMpiDto {
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName: string
}


export interface UpdateMpiDto {
  revision?: string
  effectiveDate?: string
  purpose?: string
  scope?: string
  equipment?: string
  materials?: string
  responsibilities?: string
  procedure?: string
  safety?: string
  processControl?: string
  stationName?: string
}
