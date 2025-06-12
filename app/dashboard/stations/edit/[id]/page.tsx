import EditStationForm from "@/components/station/edit-station-form"

interface EditStationPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditStationPage({ params }: EditStationPageProps) {
  const { id } = await params
  return <EditStationForm stationId={id} />
}
