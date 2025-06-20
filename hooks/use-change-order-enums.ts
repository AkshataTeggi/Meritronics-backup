"use client"

import { useState, useEffect } from "react"

export interface ChangeOrderEnums {
  orderTypes: string[]
  locationTypes: string[]
  attachmentTypes: string[]
  documentAttachments: string[]
  fileActions: string[]
}

export function useChangeOrderEnums() {
  const [enums, setEnums] = useState<ChangeOrderEnums | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("http://192.168.0.130:3000/change-orders/enums")

        if (!response.ok) {
          throw new Error(`Failed to fetch enums: ${response.status}`)
        }

        const enumsData = await response.json()
        setEnums(enumsData)
      } catch (err) {
        console.error("Error fetching change order enums:", err)
        setError("Failed to load form options")
      } finally {
        setLoading(false)
      }
    }

    fetchEnums()
  }, [])

  // Helper functions to get options for dropdowns
  const getOrderTypeOptions = () => {
    if (!enums?.orderTypes) return []
    return enums.orderTypes.map((type) => ({
      value: type,
      label: formatEnumLabel(type),
    }))
  }

  const getLocationOptions = () => {
    if (!enums?.locationTypes) return []
    return enums.locationTypes.map((location) => ({
      value: location,
      label: formatEnumLabel(location),
    }))
  }

  const getAttachmentTypeOptions = () => {
    if (!enums?.attachmentTypes) return []
    return enums.attachmentTypes.map((type) => ({
      value: type,
      label: formatEnumLabel(type),
    }))
  }

  const getFileActionOptions = () => {
    if (!enums?.fileActions) return []
    return enums.fileActions.map((action) => ({
      value: action,
      label: formatEnumLabel(action),
    }))
  }

  const getDocumentAttachmentOptions = () => {
    if (!enums?.documentAttachments) return []
    return enums.documentAttachments.map((attachment) => ({
      value: attachment,
      label: formatEnumLabel(attachment),
    }))
  }

  // Helper function to format enum values for display
  const formatEnumLabel = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Helper function to get formatted label for a specific enum value
  const getFormattedLabel = (enumType: keyof ChangeOrderEnums, value: string) => {
    return formatEnumLabel(value)
  }

  return {
    enums,
    loading,
    error,
    getOrderTypeOptions,
    getLocationOptions,
    getAttachmentTypeOptions,
    getFileActionOptions,
    getDocumentAttachmentOptions,
    getFormattedLabel,
    formatEnumLabel,
  }
}
