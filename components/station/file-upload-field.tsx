"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, type File, X, Paperclip } from "lucide-react"

interface FileUploadFieldProps {
  id: string
  label: string
  multiple?: boolean
  accept?: string
  onChange: (files: File[]) => void
  value?: File[]
  error?: string
  helpText?: string
}

export function FileUploadField({
  id,
  label,
  multiple = true,
  accept,
  onChange,
  value = [],
  error,
  helpText,
}: FileUploadFieldProps) {
  const [files, setFiles] = useState<File[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files)
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onChange(updatedFiles)
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onChange(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer.files?.length) return

    const newFiles = Array.from(e.dataTransfer.files)
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onChange(updatedFiles)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-600"
        } hover:border-gray-400 dark:hover:border-gray-500`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="text-center cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">{multiple ? "Upload multiple files" : "Upload a file"}</p>
          </div>
          <Input
            ref={fileInputRef}
            id={id}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label className="text-sm font-medium">Selected Files</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Paperclip className="h-4 w-4 text-gray-500 shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 shrink-0">({formatFileSize(file.size)})</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
