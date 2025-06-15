export interface OrderType {
  id: number
  name: string
}

export interface AttachmentType {
  id: number
  name: string
}

export interface DocumentAttachment {
  id: number
  name: string
}

export interface FileAction {
  id: number
  name: string
}

export interface ChangeOrderEnums {
  orderTypes: OrderType[]
  locationTypes: string[] // Changed from locations to locationTypes
  attachmentTypes: AttachmentType[]
  documentAttachments: DocumentAttachment[]
  fileActions: FileAction[]
}
