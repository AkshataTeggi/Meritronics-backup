"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ArrowLeft, ArrowRight, Save } from "lucide-react"
import { CreateChangeOrderForm } from "./create-change-order-form"
import CreateProductChecklistBinderForm from "./product-binder-checklist"
// Remove: import { StationSelectionPage } from "./station-selection-step"
import { StationDetailsTabsPage } from "./station-details-step"

interface MpiWizardData {
  changeOrder?: any
  productChecklist?: any
  selectedStations?: string[]
  stationDetails?: Record<string, any>
}

const STEPS = [
  {
    id: 1,
    title: "Change Order",
    description: "Create change order details",
    component: "change-order",
    route: "/dashboard/mpi/change-order/create",
  },
  {
    id: 2,
    title: "Product Checklist Binder",
    description: "Setup product checklist",
    component: "product-checklist",
    route: "/dashboard/mpi/product-checklist-binder",
  },
  {
    id: 3,
    title: "Station Selection",
    description: "Choose manufacturing stations",
    component: "station-selection",
    route: "/dashboard/mpi/station-selection",
  },
  {
    id: 4,
    title: "Station Details",
    description: "Fill station-specific details",
    component: "station-details",
    route: "/dashboard/mpi/station-selection/details",
  },
  {
    id: 5,
    title: "Review & Create",
    description: "Review and create MPI",
    component: "review",
    route: "/dashboard/mpi/review",
  },
  {
    id: 6,
    title: "Station Details View",
    description: "View selected station details",
    component: "station-details-view",
    route: "/dashboard/mpi/station-selection/details",
  },
]

function StationSelectionStep({
  onComplete,
  selectedStations,
}: { onComplete: (data: any) => void; selectedStations: string[] }) {
  const [selected, setSelected] = useState<string[]>(selectedStations)

  const handleContinue = () => {
    onComplete({ selectedStations: selected })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Selection</CardTitle>
        <CardDescription>Select the stations for this MPI process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <p>Station selection interface will be implemented here</p>
          <p className="text-sm mt-2">Currently selected: {selected.length} stations</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleContinue}>Continue with {selected.length} stations</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CreateMpiWizard() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<MpiWizardData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine current step based on pathname
  useEffect(() => {
    const step = STEPS.find((s) => s.route === pathname)
    if (step) {
      setCurrentStep(step.id)
    }
  }, [pathname])

  const currentStepData = STEPS.find((step) => step.id === currentStep)
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  const handleStepClick = (stepId: number) => {
    const step = STEPS.find((s) => s.id === stepId)
    if (step) {
      setCurrentStep(stepId)
      router.push(step.route)
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      const nextStepData = STEPS.find((step) => step.id === nextStep)
      if (nextStepData) {
        router.push(nextStepData.route)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      const prevStepData = STEPS.find((step) => step.id === prevStep)
      if (prevStepData) {
        router.push(prevStepData.route)
      }
    }
  }

  const handleStepComplete = (stepData: any) => {
    setWizardData((prev) => ({
      ...prev,
      [currentStepData?.component || ""]: stepData,
    }))
    handleNext()
  }

  const handleFinish = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Creating MPI with data:", wizardData)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/dashboard/mpi")
    } catch (err) {
      console.error("Error creating MPI:", err)
      setError("Failed to create MPI. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStepData?.component) {
      case "change-order":
        return <CreateChangeOrderForm onComplete={handleStepComplete} isWizardMode={true} />
      case "product-checklist":
        return <CreateProductChecklistBinderForm onComplete={handleStepComplete} isWizardMode={true} />
      case "station-selection":
        return (
          <StationSelectionStep onComplete={handleStepComplete} selectedStations={wizardData.selectedStations || []} />
        )
      case "station-details":
        return (
          <StationDetailsTabsPage
            onComplete={handleStepComplete}
            selectedStations={wizardData.selectedStations || []}
            stationDetails={wizardData.stationDetails || {}}
          />
        )
      case "review":
        return <ReviewStep wizardData={wizardData} onFinish={handleFinish} loading={loading} />
      case "station-details-view":
        return <div>Station details will be displayed here</div>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New MPI</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of {STEPS.length}
              </CardTitle>
              <CardDescription>{currentStepData?.title}</CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
      </Card>

      {/* Stepper */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors ${
                      step.id < currentStep
                        ? "bg-green-500 border-green-500 text-white"
                        : step.id === currentStep
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center w-24 text-xs font-medium">
                    <p
                      className={`cursor-pointer ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"}`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && <div className="flex-1 h-0.5 mx-4 bg-muted" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep <= 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentStep >= STEPS.length}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReviewStep({
  wizardData,
  onFinish,
  loading,
}: {
  wizardData: MpiWizardData
  onFinish: () => void
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review MPI Details</CardTitle>
        <CardDescription>Confirm all entries before creating the MPI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold mb-1 text-foreground">Change Order</h4>
            <p>Customer: {wizardData.changeOrder?.customer || "N/A"}</p>
            <p>Order Type: {wizardData.changeOrder?.orderType || "N/A"}</p>
            <p>Location: {wizardData.changeOrder?.location || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-foreground">Product Checklist</h4>
            <p>Name: {wizardData.productChecklist?.name || "N/A"}</p>
            <p>Version: {wizardData.productChecklist?.version || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-foreground">Selected Stations</h4>
            <p>{wizardData.selectedStations?.length || 0} stations selected</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-foreground">Station Details</h4>
            <p>{Object.keys(wizardData.stationDetails || {}).length} stations configured</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={onFinish} disabled={loading} size="lg">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating MPI...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create MPI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
