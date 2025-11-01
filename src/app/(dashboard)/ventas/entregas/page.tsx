import EntregasPageContent from '@/components/pages/EntregasPageContent'

export default async function VentasEntregasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams

  return (
    <EntregasPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={false}
      title="Entregas"
      subtitle="Consulta de entregas programadas y realizadas"
    />
  )
}
