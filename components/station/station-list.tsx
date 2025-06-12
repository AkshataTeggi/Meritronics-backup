import type React from "react"

interface Station {
  stationName: string
  id: string
  latitude: number
  longitude: number
}

interface StationsListProps {
  stations: Station[]
}

const StationsList: React.FC<StationsListProps> = ({ stations }) => {
  return (
    <div>
      {stations.map((station) => (
        <div key={station.id} className="mb-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">{station.stationName}</h3>
          <p>Latitude: {station.latitude}</p>
          <p>Longitude: {station.longitude}</p>
        </div>
      ))}
    </div>
  )
}

export default StationsList
