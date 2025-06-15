"use client"

import { useState, useEffect } from "react"
import { changeOrderApi, type ChangeOrderEnums } from "@/lib/change-order"

export function useChangeOrderEnums() {
  const [enums, setEnums] = useState<ChangeOrderEnums | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setLoading(true)
        setError(null)
        const enumsData = await changeOrderApi.getEnums()
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
      label: formatEnumLabel(String(type)),
    }))
  }

  const getLocationOptions = () => {
    if (!enums?.locations) return []
    return enums.locations.map((location) => ({
      value: location,
      label: location,
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
      label: formatEnumLabel(String(action)),
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
  const formatEnumLabel = (value: string | number) => {
    return String(value)
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const getLocationTypeOptions = () => {
    if (!enums?.locationTypes) return []
    return enums.locationTypes.map((location) => ({
      value: location,
      label: formatEnumLabel(location),
    }))
  }

  return {
    enums,
    loading,
    error,
    getOrderTypeOptions,
    getLocationOptions,
    getLocationTypeOptions,
    getAttachmentTypeOptions,
    getFileActionOptions,
    getDocumentAttachmentOptions,
  }
}
