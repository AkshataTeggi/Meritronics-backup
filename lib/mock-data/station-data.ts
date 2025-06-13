import { Station } from "@/types/station"

export const mockStations: Station[] = [
  {
    id: "station-1",
    stationId: "SMT-001",
    stationName: "SMT Line 1",
    stationCode: "SMT001",
    description: "Surface Mount Technology assembly line for high-volume production",
    location: "Production Floor A",
    status: "active",
    operator: "John Smith",
    specifications: [
      {
        id: "spec-1",
        name: "Placement Accuracy",
        value: "±0.05mm",
        unit: "mm",
        tolerance: "±0.01mm",
        description: "Component placement accuracy specification",
      },
      {
        id: "spec-2",
        name: "Cycle Time",
        value: "45",
        unit: "seconds",
        tolerance: "±5",
        description: "Standard cycle time per board",
      },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "station-2",
    stationId: "WS-001",
    stationName: "Wave Solder",
    stationCode: "WS001",
    description: "Wave soldering station for through-hole components",
    location: "Production Floor A",
    status: "active",
    operator: "Sarah Johnson",
    specifications: [
      {
        id: "spec-3",
        name: "Solder Temperature",
        value: "260",
        unit: "°C",
        tolerance: "±5",
        description: "Wave solder temperature",
      },
      {
        id: "spec-4",
        name: "Conveyor Speed",
        value: "1.2",
        unit: "m/min",
        tolerance: "±0.1",
        description: "Conveyor belt speed",
      },
    ],
    createdAt: "2024-01-08T09:00:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
  },
  {
    id: "station-3",
    stationId: "FT-001",
    stationName: "Final Test",
    stationCode: "FT001",
    description: "Final functional testing and quality assurance",
    location: "Test Area B",
    status: "active",
    operator: "Mike Wilson",
    specifications: [
      {
        id: "spec-5",
        name: "Test Voltage",
        value: "12",
        unit: "V",
        tolerance: "±0.5",
        description: "Standard test voltage",
      },
      {
        id: "spec-6",
        name: "Test Duration",
        value: "120",
        unit: "seconds",
        tolerance: "±10",
        description: "Complete test cycle duration",
      },
    ],
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "station-4",
    stationId: "QC-001",
    stationName: "Quality Control",
    stationCode: "QC001",
    description: "Quality control and inspection station",
    location: "QC Area",
    status: "active",
    operator: "Lisa Chen",
    specifications: [
      {
        id: "spec-7",
        name: "Inspection Time",
        value: "300",
        unit: "seconds",
        tolerance: "±30",
        description: "Standard inspection duration",
      },
    ],
    createdAt: "2024-01-03T07:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "station-5",
    stationId: "PKG-001",
    stationName: "Packaging",
    stationCode: "PKG001",
    description: "Final packaging and shipping preparation",
    location: "Shipping Area",
    status: "maintenance",
    operator: "Tom Brown",
    specifications: [
      {
        id: "spec-8",
        name: "Package Rate",
        value: "50",
        unit: "units/hour",
        tolerance: "±5",
        description: "Packaging throughput rate",
      },
    ],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-22T13:30:00Z",
  },
]

// Helper functions
export const getStationById = (id: string): Station | undefined => {
  return mockStations.find((station) => station.id === id)
}

export const getStationsByStatus = (status: string): Station[] => {
  return mockStations.filter((station) => station.status === status)
}

export const getActiveStations = (): Station[] => {
  return mockStations.filter((station) => station.status === "active")
}

export const getStationStats = () => {
  return {
    totalStations: mockStations.length,
    activeStations: mockStations.filter((s) => s.status === "active").length,
    maintenanceStations: mockStations.filter((s) => s.status === "maintenance").length,
    inactiveStations: mockStations.filter((s) => s.status === "inactive").length,
  }
}
