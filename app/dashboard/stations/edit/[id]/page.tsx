import EditStationForm from "@/components/station/edit-station-form"

interface EditStationPageProps {
  params: {
    id: string
  }
}

export default function EditStationPage({ params }: EditStationPageProps) {
  return <EditStationForm stationId={params.id} />
}
