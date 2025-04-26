"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"

export default function UploadDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const stationId = params.id as string

  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [documentTitle, setDocumentTitle] = useState("")
  const [station, setStation] = useState<any>(null)

  // Load station data - similar to what we had in the station detail page
  useState(() => {
    const savedStations = localStorage.getItem("meritronics-stations") || localStorage.getItem("stations")
    if (savedStations) {
      try {
        const stations = JSON.parse(savedStations)
        const foundStation = stations.find((s: any) => s.id === stationId)
        if (foundStation) {
          setStation(foundStation)
        }
      } catch (error) {
        console.error("Error parsing stations:", error)
      }
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would upload the document
    alert("Document would be uploaded in a real implementation")
    router.back()
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Upload Document</h1>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Documentation</CardTitle>
            <CardDescription>Upload documentation for this station or equipment</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {station?.equipment?.map((eq: any) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name}
                      </SelectItem>
                    )) || []}
                    <SelectItem value="station">Entire Station</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="docType">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="docType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user_manual">User Manual</SelectItem>
                    <SelectItem value="specifications">Specifications</SelectItem>
                    <SelectItem value="maintenance_guide">Maintenance Guide</SelectItem>
                    <SelectItem value="troubleshooting_guide">Troubleshooting Guide</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="docTitle">Document Title</Label>
                <Input
                  id="docTitle"
                  placeholder="Enter document title"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docFile">File to Upload</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <Input id="docFile" type="file" className="hidden" />
                  <label htmlFor="docFile" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</span>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Upload Document</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
