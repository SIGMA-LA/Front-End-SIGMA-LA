import ClientesPageContent from '@/components/pages/ClientesPageContent'

export default async function CoordinacionClientesPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams

  return <ClientesPageContent searchQuery={sp?.q ?? ''} canCreate={false} />
}
