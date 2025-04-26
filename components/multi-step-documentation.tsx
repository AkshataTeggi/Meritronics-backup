"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  LogOut,
  ClipboardCheck,
  FileText,
  Zap,
  Printer,
  Layers,
  X,
  Settings,
  HelpCircle,
  Check,
  Circle,
  CheckCircle2,
} from "lucide-react"
import ProductBinderChecklist from "./product-binder-checklist"
import ProcessFlowChart from "./process-flow-chart"
import LaserEtching from "./laser-etching"
import ScreenPrinting from "./screen-printing"
import StepPlaceholder from "./step-placeholder"
import LoginForm from "./login-form"
import UploadComponent from "./upload"

// First, add all the imports for the new components at the top of the file
import SolderPasteInspection from "./solder-paste-inspection"
import SmMachinePlacement from "./sm-machine-placement"
import SmHandPlacement from "./sm-hand-placement"
import SmReflow from "./sm-reflow"
import VisualInspection from "./visual-inspection"
import TouchUp from "./touch-up"
import ManualLoad from "./manual-load"
import XRay from "./x-ray"
import WaveSolder from "./wave-solder"
import PcbaCleaning from "./pcba-cleaning"
import ChemicalWash from "./chemical-wash"
import HandSolder from "./hand-solder"
import Testing from "./testing"
import BurnIn from "./burn-in"
import Rtv from "./rtv"
import QaInspection from "./qa-inspection"
import Packaging from "./packaging"
import Bom from "./bom"
import AssemblyDrawing from "./assembly-drawing"
import FinalPictures from "./final-pictures"
import Image from "next/image"
// Add this import at the top of the file with the other imports
import ChangeOrderForm from "./change-order-form"
// First, add the import for the new StationModule component at the top of the file with the other imports
import StationModule from "./station-module"

// Define all steps in the documentation process with categories
const stepCategories = [
  {
    id: "documentation",
    name: "Documentation",
    icon: FileText,
    steps: [
      { id: "change-order", title: "Change Order" }, // Move this to be first
      { id: "checklist", title: "Product Binder Checklist" },
      { id: "upload", title: "Upload" },
      { id: "flowchart", title: "Process Flow Chart" },
      { id: "station-module", title: "Station Module" }, // Add this line
    ],
  },
  {
    id: "preparation",
    name: "Preparation",
    icon: Layers,
    steps: [
      { id: "laser-etching", title: "Laser Etching" },
      { id: "screen-printing", title: "Screen Printing" },
    ],
  },
  {
    id: "assembly",
    name: "Assembly",
    icon: Zap,
    steps: [
      { id: "spi", title: "SPI" },
      { id: "sm-pick-place", title: "SM-Pick and Place" },
      { id: "sm-hand-placement", title: "SM-Hand Placement" },
      { id: "sm-reflow", title: "SM-Reflow" },
      { id: "visual-inspection", title: "Visual Inspection" },
      { id: "touch-up", title: "Touch Up" },
      { id: "manual-load", title: "Manual Load (PTH)" },
      { id: "x-ray", title: "X-Ray" },
      { id: "wave-solder", title: "Wave Solder" },
      { id: "wash-clean", title: "Wash Clean" },
      { id: "chemical-wash", title: "Chemical Wash" },
      { id: "hand-solder", title: "Hand Solder-No Clean" },
    ],
  },
  {
    id: "testing",
    name: "Testing & QA",
    icon: ClipboardCheck,
    steps: [
      { id: "testing", title: "Testing" },
      { id: "burn-in", title: "Burn In" },
      { id: "rtv", title: "RTV" },
      { id: "qa-inspection", title: "QA-Inspection" },
    ],
  },
  {
    id: "finalization",
    name: "Finalization",
    icon: Printer,
    steps: [
      { id: "packaging", title: "Packaging" },
      { id: "bom", title: "BOM" },
      { id: "assembly-drawing", title: "Assembly Drawing" },
      { id: "final-pictures", title: "Final Pictures" },
    ],
  },
]

// Meritronics logo URL from Vercel Blob
const LOGO_URL =
  "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// Flatten steps for easier access
const steps = stepCategories.flatMap((category) => category.steps)

export default function MultiStepDocumentation() {
  const [currentStep, setCurrentStep] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  // For mobile view
  const [isMobileView, setIsMobileView] = useState(false)

  // Initialize expanded categories
  useEffect(() => {
    // Find which category contains the current step
    const initialExpandedCategories: Record<string, boolean> = {}
    stepCategories.forEach((category) => {
      const containsCurrentStep = category.steps.some((_, index) => {
        const stepIndex = steps.findIndex((s) => s.id === category.steps[index].id)
        return stepIndex === currentStep
      })
      initialExpandedCategories[category.id] = containsCurrentStep
    })
    setExpandedCategories(initialExpandedCategories)
  }, [])

  // Load completed steps from localStorage
  useEffect(() => {
    const savedCompletedSteps = localStorage.getItem("mpi-completed-steps")
    if (savedCompletedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedCompletedSteps))
      } catch (error) {
        console.error("Error parsing completed steps:", error)
      }
    }
  }, [])

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mpi-completed-steps", JSON.stringify(completedSteps))
  }, [completedSteps])

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  // Add custom scrollbar styles
  useEffect(() => {
    // Add global styles to hide scrollbars
    const style = document.createElement("style")
    style.innerHTML = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      
      /* Hide scrollbar for IE, Edge and Firefox */
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Check for existing login session
  useEffect(() => {
    const savedUser = localStorage.getItem("meritronics-user")
    if (savedUser) {
      setIsLoggedIn(true)
      setUsername(savedUser)
    }
  }, [])

  // Handle login
  const handleLogin = (user: string) => {
    setIsLoggedIn(true)
    setUsername(user)
    localStorage.setItem("meritronics-user", user)
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    localStorage.removeItem("meritronics-user")
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Toggle step completion
  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepIndex)) {
        return prev.filter((index) => index !== stepIndex)
      } else {
        return [...prev, stepIndex]
      }
    })
  }

  // Calculate completion percentage
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  // Add print functionality
  const handlePrint = () => {
    window.print()
  }

  // Add save functionality
  const handleSave = () => {
    // Create an object with all the form data
    const formData = {
      currentStep,
      timestamp: new Date().toISOString(),
      completedSteps,
      // You would add actual form data here from each step
    }

    // Convert to JSON and save to localStorage
    localStorage.setItem("mpi-manufacturing-data", JSON.stringify(formData))

    // Show a confirmation message
    alert("Data saved successfully!")
  }

  useEffect(() => {
    // Add print styles
    const style = document.createElement("style")
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-section, .print-section * {
          visibility: visible;
        }
        .print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const goToNextStep = () => {
    if (currentStep < steps.length - 1 && !isTransitioning) {
      setIsTransitioning(true)

      // Add fade-out effect
      if (contentRef.current) {
        contentRef.current.classList.add("opacity-0")
      }

      // Wait for animation to complete
      setTimeout(() => {
        setCurrentStep(currentStep + 1)

        // Add fade-in effect after changing content
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.classList.remove("opacity-0")
          }
          setIsTransitioning(false)
        }, 50)
      }, 200)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true)

      // Add fade-out effect
      if (contentRef.current) {
        contentRef.current.classList.add("opacity-0")
      }

      // Wait for animation to complete
      setTimeout(() => {
        setCurrentStep(currentStep - 1)

        // Add fade-in effect after changing content
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.classList.remove("opacity-0")
          }
          setIsTransitioning(false)
        }, 50)
      }, 200)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length && !isTransitioning && stepIndex !== currentStep) {
      setIsTransitioning(true)

      // Add fade-out effect
      if (contentRef.current) {
        contentRef.current.classList.add("opacity-0")
      }

      // Wait for animation to complete
      setTimeout(() => {
        setCurrentStep(stepIndex)

        // Add fade-in effect after changing content
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.classList.remove("opacity-0")
          }
          setIsTransitioning(false)
        }, 50)
      }, 200)

      // Close sidebar on mobile after selection
      if (isMobileView) {
        setSidebarOpen(false)
      }
    }
  }

  // Now update the renderStepContent function to include all the new components
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ChangeOrderForm />
      case 1:
        return <ProductBinderChecklist />
      case 2:
        return <UploadComponent />
      case 3:
        return <ProcessFlowChart />
      case 4:
        return <StationModule />
      case 5:
        return <LaserEtching />
      case 6:
        return <ScreenPrinting />
      case 7:
        return <SolderPasteInspection />
      case 8:
        return <SmMachinePlacement />
      case 9:
        return <SmHandPlacement />
      case 10:
        return <SmReflow />
      case 11:
        return <VisualInspection />
      case 12:
        return <TouchUp />
      case 13:
        return <ManualLoad />
      case 14:
        return <XRay />
      case 15:
        return <WaveSolder />
      case 16:
        return <PcbaCleaning />
      case 17:
        return <ChemicalWash />
      case 18:
        return <HandSolder />
      case 19:
        return <Testing />
      case 20:
        return <BurnIn />
      case 21:
        return <Rtv />
      case 22:
        return <QaInspection />
      case 23:
        return <Packaging />
      case 24:
        return <Bom />
      case 25:
        return <AssemblyDrawing />
      case 26:
        return <FinalPictures />
      default:
        return <StepPlaceholder stepTitle={steps[currentStep].title} stepNumber={currentStep + 1} />
    }
  }

  // If not logged in, show login form
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 compact-layout red-theme friendly-ui overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-3 left-3 z-30 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 shadow-md rounded-friendly btn-friendly"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-20 w-[280px] md:w-56 h-screen bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] transition-transform duration-300 ease-in-out overflow-hidden flex flex-col shadow-sm`}
      >
        {/* Sidebar Header with Logo */}
        <div className="py-3 px-3 border-b border-[hsl(var(--sidebar-border))] flex flex-col items-center">
          <div className="w-full flex justify-center">
            <Image
              src={LOGO_URL || "/placeholder.svg"}
              alt="Meritronics Logo"
              width={140}
              height={40}
              className="h-7 w-auto"
              priority
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-2 py-2 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-start gap-2 py-1.5 px-2 text-xs hover-friendly"
              onClick={() => goToStep(0)}
            >
              <FileText className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <span>Create MPI</span>
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-3 py-2 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(var(--sidebar-foreground)/0.7)]">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-[hsl(var(--sidebar-border))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--primary))] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar p-2">
          <div className="space-y-0.5">
            {/* Categories and Steps */}
            {stepCategories.map((category) => (
              <div key={category.id} className="space-y-0.5">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] sidebar-category hover-friendly"
                >
                  <div className="flex items-center">
                    <category.icon className="mr-2 h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                    {category.name}
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${expandedCategories[category.id] ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Steps within category */}
                {expandedCategories[category.id] && (
                  <div className="ml-6 space-y-0.5">
                    {category.steps.map((step, index) => {
                      const stepIndex = steps.findIndex((s) => s.id === step.id)
                      const isCompleted = completedSteps.includes(stepIndex)
                      return (
                        <div key={step.id} className="flex items-center gap-1">
                          <button
                            onClick={() => goToStep(stepIndex)}
                            className={`flex-1 text-left px-2 py-1.5 text-xs rounded-md transition-colors sidebar-item ${
                              stepIndex === currentStep
                                ? "active-nav-item"
                                : "text-[hsl(var(--sidebar-foreground)/0.8)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                            } hover-friendly`}
                          >
                            <div className="flex items-center">
                              {isCompleted ? (
                                <CheckCircle2 className="h-3 w-3 mr-1.5 text-[hsl(var(--primary))]" />
                              ) : (
                                <Circle className="h-3 w-3 mr-1.5 text-[hsl(var(--sidebar-foreground)/0.4)]" />
                              )}
                              {step.title}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-[hsl(var(--sidebar-foreground)/0.7)]">{username || "User"}</div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 rounded-full hover:bg-[hsl(var(--sidebar-accent))]"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 rounded-full hover:bg-[hsl(var(--sidebar-accent))]"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1 text-xs btn-outline btn-friendly"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background h-screen">
        {/* Content Area */}
        <div
          ref={contentRef}
          className="flex-1 p-4 overflow-y-auto hide-scrollbar print-section transition-opacity duration-200 ease-in-out max-h-screen"
        >
          {/* Header with Navigation */}
          <div className="mb-4 pb-2 border-b border-[hsl(var(--border))] section-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold text-[hsl(var(--primary))]">Manufacturing Process</h1>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep + 1}: {steps[currentStep].title}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStepCompletion(currentStep)}
                  className={`flex items-center gap-1 text-xs h-7 px-2 btn-friendly ${
                    completedSteps.includes(currentStep)
                      ? "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))/0.9]"
                      : "border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.1]"
                  }`}
                >
                  {completedSteps.includes(currentStep) ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Completed
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" /> Mark Complete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0 || isTransitioning}
                  className="flex items-center gap-1 text-xs h-7 px-2 btn-outline btn-friendly"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <Button
                  size="sm"
                  onClick={goToNextStep}
                  disabled={currentStep === steps.length - 1 || isTransitioning}
                  className="flex items-center gap-1 text-xs h-7 px-2 btn-primary btn-friendly"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pb-4">{renderStepContent()}</div>
        </div>
      </main>
    </div>
  )
}
