import EmpleadosPageContent from '@/components/pages/EmpleadosPageContent'

interface EmpleadosPageProps {
  searchParams?: Promise<{
    q?: string
  }>
}

export default async function EmpleadosPage({
  searchParams,
}: EmpleadosPageProps) {
  const params = await searchParams
  const searchQuery = params?.q || ''

  return <EmpleadosPageContent searchQuery={searchQuery} />
}
