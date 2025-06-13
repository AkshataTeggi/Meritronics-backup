import { ChecklistSection, ChecklistItem, Checklist, Mpi } from "@/types/mpi"

// Mock Checklist Data
export const mockChecklistSections: ChecklistSection[] = [
  "production_information",
  "customer_supplied_information",
  "pre_production_preparation",
  "surface_mount_area",
  "manual_placement_wave_solder",
  "modification_area",
  "qc_area",
  "mechanical_assembly",
  "test_area",
  "shipping_area",
]

export const mockChecklistItems: ChecklistItem[] = [
  {
    id: "item-1",
    description: "Verify production order details and specifications",
    section: "production_information",
    isRequired: true,
    status: "N/A",
    order: 1,
    estimatedTime: 15,
    tools: ["Computer", "Production Order"],
    materials: [],
    safetyNotes: ["Ensure data accuracy"],
    qualityCheckpoints: ["Double-check part numbers"],
    dependencies: [],
  },
  {
    id: "item-2",
    description: "Check customer-supplied components and documentation",
    section: "customer_supplied_information",
    isRequired: true,
    status: "N/A",
    order: 2,
    estimatedTime: 20,
    tools: ["Inspection tools"],
    materials: ["Customer components"],
    safetyNotes: ["Handle components with care"],
    qualityCheckpoints: ["Verify component integrity"],
    dependencies: ["item-1"],
  },
  {
    id: "item-3",
    description: "Prepare workstation and gather required materials",
    section: "pre_production_preparation",
    isRequired: true,
    status: "N/A",
    order: 3,
    estimatedTime: 30,
    tools: ["Workstation setup tools"],
    materials: ["PCBs", "Components", "Solder"],
    safetyNotes: ["Ensure proper ESD protection"],
    qualityCheckpoints: ["Verify material quality"],
    dependencies: ["item-2"],
  },
  {
    id: "item-4",
    description: "Set up SMT line and program pick-and-place machine",
    section: "surface_mount_area",
    isRequired: true,
    status: "N/A",
    order: 4,
    estimatedTime: 45,
    tools: ["SMT equipment", "Programming interface"],
    materials: ["SMT components", "Solder paste"],
    safetyNotes: ["Machine safety protocols"],
    qualityCheckpoints: ["Verify placement accuracy"],
    dependencies: ["item-3"],
  },
  {
    id: "item-5",
    description: "Perform manual component placement and wave soldering",
    section: "manual_placement_wave_solder",
    isRequired: true,
    status: "N/A",
    order: 5,
    estimatedTime: 60,
    tools: ["Soldering iron", "Wave solder machine"],
    materials: ["Through-hole components", "Flux"],
    safetyNotes: ["Hot surface warnings", "Ventilation required"],
    qualityCheckpoints: ["Inspect solder joints"],
    dependencies: ["item-4"],
  },
]

export const mockChecklists: Checklist[] = [
  {
    id: "checklist-1",
    name: "Product Binder Checklist",
    description: "Comprehensive manufacturing checklist for electronic assembly production",
    version: "2.1",
    category: "product_binder",
    isActive: true,
    items: mockChecklistItems,
    sections: {
      production_information: {
        title: "Production Information",
        description: "Verify all production order details and requirements",
        items: mockChecklistItems.filter((item) => item.section === "production_information"),
      },
      customer_supplied_information: {
        title: "Customer Supplied Information",
        description: "Check customer-provided components and documentation",
        items: mockChecklistItems.filter((item) => item.section === "customer_supplied_information"),
      },
      pre_production_preparation: {
        title: "Pre-Production Preparation",
        description: "Prepare workstation and materials for production",
        items: mockChecklistItems.filter((item) => item.section === "pre_production_preparation"),
      },
      surface_mount_area: {
        title: "Surface Mount Area",
        description: "SMT assembly and placement operations",
        items: mockChecklistItems.filter((item) => item.section === "surface_mount_area"),
      },
      manual_placement_wave_solder: {
        title: "Manual Placement & Wave Solder",
        description: "Manual component placement and wave soldering operations",
        items: mockChecklistItems.filter((item) => item.section === "manual_placement_wave_solder"),
      },
      modification_area: {
        title: "Modification Area",
        description: "PCB modifications and rework operations",
        items: [],
      },
      qc_area: {
        title: "QC Area",
        description: "Quality control and inspection procedures",
        items: [],
      },
      mechanical_assembly: {
        title: "Mechanical Assembly",
        description: "Mechanical component assembly and integration",
        items: [],
      },
      test_area: {
        title: "Test Area",
        description: "Functional testing and validation procedures",
        items: [],
      },
      shipping_area: {
        title: "Shipping Area",
        description: "Final packaging and shipping preparation",
        items: [],
      },
    },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
    createdBy: "admin",
    lastReviewed: "2024-01-20T10:30:00Z",
    reviewedBy: "quality_manager",
    approvalRequired: true,
    approvedBy: "production_manager",
    approvedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "checklist-2",
    name: "Station Specific Checklist",
    description: "Checklist tailored for specific manufacturing stations",
    version: "1.5",
    category: "station_specific",
    isActive: true,
    items: [],
    sections: {
      production_information: { title: "Production Information", description: "", items: [] },
      customer_supplied_information: { title: "Customer Supplied Information", description: "", items: [] },
      pre_production_preparation: { title: "Pre-Production Preparation", description: "", items: [] },
      surface_mount_area: { title: "Surface Mount Area", description: "", items: [] },
      manual_placement_wave_solder: { title: "Manual Placement & Wave Solder", description: "", items: [] },
      modification_area: { title: "Modification Area", description: "", items: [] },
      qc_area: { title: "QC Area", description: "", items: [] },
      mechanical_assembly: { title: "Mechanical Assembly", description: "", items: [] },
      test_area: { title: "Test Area", description: "", items: [] },
      shipping_area: { title: "Shipping Area", description: "", items: [] },
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T11:15:00Z",
    createdBy: "station_supervisor",
    approvalRequired: false,
  },
]

export const mockMpis: Mpi[] = [
  {
    id: "mpi-1",
    stationName: "SMT Line 1",
    stationId: "SMT-001",
    processName: "SMT Assembly Process",
    revision: "Rev. A",
    effectiveDate: "2024-01-15",
    purpose: "Manufacturing Process Instruction for SMT Line 1 surface mount assembly operations",
    scope: "This MPI applies to all SMT assembly operations at Station SMT-001",
    equipment: "Pick and place machine, Reflow oven, Inspection equipment",
    materials: "PCBs, SMT components, Solder paste, Flux",
    responsibilities: "Operators: Execute assembly process, QC: Inspect quality, Engineering: Process optimization",
    procedure:
      "1. Load PCB into fixture\n2. Apply solder paste\n3. Place components\n4. Reflow solder\n5. Inspect assembly",
    safety: "ESD protection required, Hot surface warnings, Proper ventilation",
    processControl: "Temperature monitoring, Placement accuracy verification, Solder joint inspection",
    setupInstructions:
      "1. Power on equipment\n2. Load program\n3. Calibrate placement head\n4. Set temperature profile",
    operatingInstructions: "1. Load PCB\n2. Start cycle\n3. Monitor process\n4. Remove completed assembly",
    qualityInstructions: "Inspect solder joints, Verify component placement, Check for defects",
    troubleshootingInstructions: "Common issues: Misalignment - recalibrate, Poor solder joints - check temperature",
    maintenanceInstructions: "Daily: Clean nozzles, Weekly: Calibrate vision system, Monthly: Replace filters",
    shutdownInstructions:
      "1. Complete current cycle\n2. Power down equipment\n3. Clean work area\n4. Log production data",
    checklistId: "checklist-1",
    checklist: mockChecklists[0],
    completedItems: [
      {
        itemId: "item-1",
        status: "YES",
        completedBy: "operator1",
        completedAt: "2024-01-15T10:00:00Z",
        remark: "Production order verified",
      },
      {
        itemId: "item-2",
        status: "YES",
        completedBy: "operator1",
        completedAt: "2024-01-15T10:15:00Z",
        remark: "Customer components inspected and approved",
      },
    ],
    complianceStatus: "in_progress",
    parameters: {
      temperature: "245°C",
      speed: "50mm/s",
      pressure: "2.5 bar",
    },
    specifications: {
      placement_accuracy: "±0.05mm",
      cycle_time: "45 seconds",
      yield_target: "99.5%",
    },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
  },
  {
    id: "mpi-2",
    stationName: "Wave Solder",
    stationId: "WS-001",
    processName: "Wave Soldering Process",
    revision: "Rev. B",
    effectiveDate: "2024-01-12",
    purpose: "Manufacturing Process Instruction for Wave Solder station through-hole component soldering",
    scope: "This MPI applies to all wave soldering operations at Station WS-001",
    equipment: "Wave solder machine, Flux applicator, Preheater",
    materials: "PCBs with THT components, Solder wire, Flux",
    responsibilities: "Operators: Load/unload PCBs, Monitor process, QC: Inspect solder quality",
    procedure: "1. Preheat PCB\n2. Apply flux\n3. Wave solder\n4. Cool down\n5. Inspect joints",
    safety: "Hot solder warnings, Fume extraction required, Heat-resistant gloves",
    processControl: "Temperature control, Wave height monitoring, Conveyor speed regulation",
    setupInstructions: "1. Heat up solder pot\n2. Set conveyor speed\n3. Adjust wave height\n4. Prime flux system",
    operatingInstructions:
      "1. Load PCB on conveyor\n2. Monitor process parameters\n3. Inspect output\n4. Adjust as needed",
    qualityInstructions: "Check for cold joints, Verify hole fill, Inspect for bridges",
    troubleshootingInstructions: "Cold joints - increase temperature, Bridges - reduce wave height",
    maintenanceInstructions: "Daily: Skim dross, Weekly: Clean flux nozzles, Monthly: Calibrate temperature",
    shutdownInstructions:
      "1. Complete current boards\n2. Lower temperature\n3. Clean flux system\n4. Record parameters",
    checklistId: "checklist-1",
    checklist: mockChecklists[0],
    completedItems: [],
    complianceStatus: "pending",
    parameters: {
      solder_temperature: "260°C",
      conveyor_speed: "1.2 m/min",
      wave_height: "8mm",
    },
    specifications: {
      hole_fill: "75% minimum",
      joint_quality: "IPC Class 2",
      throughput: "120 boards/hour",
    },
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "mpi-3",
    stationName: "Final Test",
    stationId: "FT-001",
    processName: "Final Testing Process",
    revision: "Rev. A",
    effectiveDate: "2024-01-18",
    purpose: "Manufacturing Process Instruction for Final Test station functional testing",
    scope: "This MPI applies to all final testing operations at Station FT-001",
    equipment: "Test fixture, Multimeter, Function generator, Oscilloscope",
    materials: "Test cables, Calibration standards, Test software",
    responsibilities: "Test Technicians: Execute tests, Record results, Engineering: Maintain test procedures",
    procedure:
      "1. Connect DUT to fixture\n2. Run automated tests\n3. Verify results\n4. Generate report\n5. Apply pass/fail label",
    safety: "Electrical safety protocols, Proper grounding, Voltage awareness",
    processControl: "Test parameter verification, Calibration checks, Result validation",
    setupInstructions: "1. Power on test equipment\n2. Load test program\n3. Verify calibration\n4. Connect fixtures",
    operatingInstructions: "1. Place DUT in fixture\n2. Start test sequence\n3. Monitor progress\n4. Record results",
    qualityInstructions: "Verify test coverage, Check measurement accuracy, Validate pass criteria",
    troubleshootingInstructions: "Test failures - check connections, Equipment errors - recalibrate",
    maintenanceInstructions: "Daily: Check connections, Weekly: Calibrate instruments, Monthly: Update software",
    shutdownInstructions: "1. Complete current tests\n2. Save test data\n3. Power down equipment\n4. Secure test area",
    checklistId: "checklist-2",
    checklist: mockChecklists[1],
    completedItems: [],
    complianceStatus: "completed",
    parameters: {
      test_voltage: "12V",
      test_current: "500mA",
      test_duration: "30 seconds",
    },
    specifications: {
      test_coverage: "100%",
      test_time: "2 minutes max",
      pass_rate: "98% minimum",
    },
    createdAt: "2024-01-18T07:30:00Z",
    updatedAt: "2024-01-18T07:30:00Z",
  },
]

// Helper functions for mock data
export const getMpiById = (id: string): Mpi | undefined => {
  return mockMpis.find((mpi) => mpi.id === id)
}

export const getMpisByStation = (stationName: string): Mpi[] => {
  return mockMpis.filter((mpi) => mpi.stationName.toLowerCase().includes(stationName.toLowerCase()))
}

export const getChecklistById = (id: string): Checklist | undefined => {
  return mockChecklists.find((checklist) => checklist.id === id)
}

export const getMpiStats = () => {
  return {
    totalMpis: mockMpis.length,
    activeMpis: mockMpis.filter((mpi) => mpi.complianceStatus === "completed").length,
    pendingMpis: mockMpis.filter((mpi) => mpi.complianceStatus === "pending").length,
    inProgressMpis: mockMpis.filter((mpi) => mpi.complianceStatus === "in_progress").length,
  }
}
