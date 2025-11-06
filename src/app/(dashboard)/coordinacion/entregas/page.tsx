import EntregasPageContent from '@/components/pages/EntregasPageContent'

export default async function CoordinacionEntregasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams

  return (
    <EntregasPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={true}
      createUrl="/coordinacion/entregas/crear"
    />
  )
}
