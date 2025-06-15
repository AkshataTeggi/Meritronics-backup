// import {
//   Zap,
//   Cpu,
//   Wrench,
//   Package,
//   Scissors,
//   Drill,
//   Cog,
//   CircuitBoard,
//   Flame,
//   Eye,
//   Printer,
//   Paintbrush,
//   Factory,
//   Settings,
//   PenToolIcon as Tool,
//   Gauge,
//   TestTube,
//   Camera,
//   Layers,
//   Box,
//   Scan,
//   Target,
//   Shield,
//   Thermometer,
//   Activity,
//   Radio,
//   Monitor,
//   Server,
//   Filter,
//   Sliders,
//   Droplets,
// } from "lucide-react"

// interface StationIconProps {
//   stationName: string
//   className?: string
// }

// export function StationIcon({ stationName, className = "h-6 w-6 text-red-600" }: StationIconProps) {
//   const getIconForStation = (name: string) => {
//     const lowerName = name.toLowerCase()

//     // Laser related
//     if (lowerName.includes("laser")) return Zap

//     // SPI (Solder Paste Inspection)
//     if (lowerName.includes("spi") || lowerName.includes("solder paste")) return Eye

//     // Pick and Place
//     if (lowerName.includes("pick") || lowerName.includes("place") || lowerName.includes("placement")) return Target

//     // Reflow/Oven
//     if (lowerName.includes("reflow") || lowerName.includes("oven") || lowerName.includes("solder")) return Flame

//     // AOI (Automated Optical Inspection)
//     if (lowerName.includes("aoi") || lowerName.includes("optical") || lowerName.includes("inspection")) return Camera

//     // ICT (In-Circuit Test)
//     if (lowerName.includes("ict") || lowerName.includes("test") || lowerName.includes("testing")) return TestTube

//     // Programming/Flashing
//     if (lowerName.includes("program") || lowerName.includes("flash") || lowerName.includes("firmware")) return Cpu

//     // Assembly
//     if (lowerName.includes("assembly") || lowerName.includes("assemble")) return Wrench

//     // Packaging
//     if (lowerName.includes("pack") || lowerName.includes("box")) return Package

//     // Cutting/Routing
//     if (lowerName.includes("cut") || lowerName.includes("route") || lowerName.includes("trim")) return Scissors

//     // Drilling
//     if (lowerName.includes("drill") || lowerName.includes("hole")) return Drill

//     // Coating/Painting
//     if (lowerName.includes("coat") || lowerName.includes("paint") || lowerName.includes("finish")) return Paintbrush

//     // Quality Control
//     if (lowerName.includes("quality") || lowerName.includes("qc") || lowerName.includes("control")) return Shield

//     // Measurement/Gauge
//     if (lowerName.includes("measure") || lowerName.includes("gauge") || lowerName.includes("dimension")) return Gauge

//     // Cleaning
//     if (lowerName.includes("clean") || lowerName.includes("wash")) return Droplets

//     // Printing
//     if (lowerName.includes("print") || lowerName.includes("label")) return Printer

//     // Scanning/Barcode
//     if (lowerName.includes("scan") || lowerName.includes("barcode") || lowerName.includes("qr")) return Scan

//     // Temperature related
//     if (lowerName.includes("temp") || lowerName.includes("heat") || lowerName.includes("cool")) return Thermometer

//     // Functional Test
//     if (lowerName.includes("functional") || lowerName.includes("final")) return Activity

//     // RF/Wireless
//     if (lowerName.includes("rf") || lowerName.includes("wireless") || lowerName.includes("antenna")) return Radio

//     // Calibration
//     if (lowerName.includes("calibrat") || lowerName.includes("adjust")) return Sliders

//     // Sorting
//     if (lowerName.includes("sort") || lowerName.includes("separate")) return Filter

//     // Stacking/Layering
//     if (lowerName.includes("stack") || lowerName.includes("layer")) return Layers

//     // Default icons based on common manufacturing terms
//     if (lowerName.includes("station")) return Factory
//     if (lowerName.includes("machine")) return Cog
//     if (lowerName.includes("tool")) return Tool
//     if (lowerName.includes("equipment")) return Settings
//     if (lowerName.includes("device")) return Monitor
//     if (lowerName.includes("unit")) return Box
//     if (lowerName.includes("system")) return Server

//     // Default fallback
//     return CircuitBoard
//   }

//   const IconComponent = getIconForStation(stationName)

//   return <IconComponent className={className} />
// }











import {
  Zap,
  Cpu,
  Wrench,
  Package,
  Scissors,
  Drill,
  Cog,
  CircuitBoard,
  Flame,
  Eye,
  Printer,
  Paintbrush,
  Factory,
  Settings,
  PenToolIcon as Tool,
  Gauge,
  TestTube,
  Camera,
  Layers,
  Box,
  Scan,
  Target,
  Shield,
  Thermometer,
  Activity,
  Radio,
  Monitor,
  Server,
  Filter,
  Sliders,
  Droplets,
} from "lucide-react"

interface StationIconProps {
  stationName: string
  className?: string
}

export function StationIcon({ stationName, className = "h-6 w-6 text-red-600" }: StationIconProps) {
  const getIconForStation = (name: string) => {
    // Handle undefined, null, or empty names
    if (!name || typeof name !== "string") {
      return CircuitBoard // Default fallback icon
    }

    const lowerName = name.toLowerCase()

    // Laser related
    if (lowerName.includes("laser")) return Zap

    // SPI (Solder Paste Inspection)
    if (lowerName.includes("spi") || lowerName.includes("solder paste")) return Eye

    // Pick and Place
    if (lowerName.includes("pick") || lowerName.includes("place") || lowerName.includes("placement")) return Target

    // Reflow/Oven
    if (lowerName.includes("reflow") || lowerName.includes("oven") || lowerName.includes("solder")) return Flame

    // AOI (Automated Optical Inspection)
    if (lowerName.includes("aoi") || lowerName.includes("optical") || lowerName.includes("inspection")) return Camera

    // ICT (In-Circuit Test)
    if (lowerName.includes("ict") || lowerName.includes("test") || lowerName.includes("testing")) return TestTube

    // Programming/Flashing
    if (lowerName.includes("program") || lowerName.includes("flash") || lowerName.includes("firmware")) return Cpu

    // Assembly
    if (lowerName.includes("assembly") || lowerName.includes("assemble")) return Wrench

    // Packaging
    if (lowerName.includes("pack") || lowerName.includes("box")) return Package

    // Cutting/Routing
    if (lowerName.includes("cut") || lowerName.includes("route") || lowerName.includes("trim")) return Scissors

    // Drilling
    if (lowerName.includes("drill") || lowerName.includes("hole")) return Drill

    // Coating/Painting
    if (lowerName.includes("coat") || lowerName.includes("paint") || lowerName.includes("finish")) return Paintbrush

    // Quality Control
    if (lowerName.includes("quality") || lowerName.includes("qc") || lowerName.includes("control")) return Shield

    // Measurement/Gauge
    if (lowerName.includes("measure") || lowerName.includes("gauge") || lowerName.includes("dimension")) return Gauge

    // Cleaning
    if (lowerName.includes("clean") || lowerName.includes("wash")) return Droplets

    // Printing
    if (lowerName.includes("print") || lowerName.includes("label")) return Printer

    // Scanning/Barcode
    if (lowerName.includes("scan") || lowerName.includes("barcode") || lowerName.includes("qr")) return Scan

    // Temperature related
    if (lowerName.includes("temp") || lowerName.includes("heat") || lowerName.includes("cool")) return Thermometer

    // Functional Test
    if (lowerName.includes("functional") || lowerName.includes("final")) return Activity

    // RF/Wireless
    if (lowerName.includes("rf") || lowerName.includes("wireless") || lowerName.includes("antenna")) return Radio

    // Calibration
    if (lowerName.includes("calibrat") || lowerName.includes("adjust")) return Sliders

    // Sorting
    if (lowerName.includes("sort") || lowerName.includes("separate")) return Filter

    // Stacking/Layering
    if (lowerName.includes("stack") || lowerName.includes("layer")) return Layers

    // Default icons based on common manufacturing terms
    if (lowerName.includes("station")) return Factory
    if (lowerName.includes("machine")) return Cog
    if (lowerName.includes("tool")) return Tool
    if (lowerName.includes("equipment")) return Settings
    if (lowerName.includes("device")) return Monitor
    if (lowerName.includes("unit")) return Box
    if (lowerName.includes("system")) return Server

    // Default fallback
    return CircuitBoard
  }

  // Provide fallback for undefined stationName
  const IconComponent = getIconForStation(stationName || "default")

  return <IconComponent className={className} />
}
