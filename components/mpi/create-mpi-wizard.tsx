
"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { CreateChangeOrderForm } from "./create-change-order-form"
import CreateProductChecklistBinderForm from "./product-binder-checklist"

interface MpiWizardData {
  changeOrder?: any
  productChecklist?: any
  selectedStations?: string[]
  stationDetails?: Record<string, any>
}

const STEPS = [
  {
    id: 1,
    title: "Order Form",
    description: "Create order form details",
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
]

export function CreateMpiWizard() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<MpiWizardData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        // Don't render - handled by parent component
        return null
      case "station-details":
        // Don't render - handled by parent component
        return null
      case "review":
        // Don't render - handled by parent component
        return null
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Create New MPI</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/mpi")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MPIs
        </Button>
      </div>

      {/* Progress */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
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
      <Card className="mb-4">
        <CardContent className="py-4 px-4">
          <div className="flex w-full items-center justify-between relative">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Circle */}
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors cursor-pointer
              ${
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

                {/* Title */}
                <p
                  className={`mt-2 text-xs text-center font-medium cursor-pointer ${
                    step.id <= currentStep ? "text-foreground" : "text-gray-500"
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  {step.title}
                </p>

                {/* Connector line - except after last step */}
                {index < STEPS.length - 1 && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 z-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between py-3 px-4 gap-4">
          {/* Left side: step title */}
          <h2 className="text-lg font-semibold text-foreground">{currentStepData?.title}</h2>

          {/* Right side: Previous and Next buttons */}
          <div className="flex gap-2">
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="mt-4">{renderStepContent()}</div>
    </div>
  )
}
