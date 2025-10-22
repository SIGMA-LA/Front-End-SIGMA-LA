'use client'

import { useRouter } from 'next/navigation'
import ObrasList from '@/components/shared/ObrasList'
import type { Obra, Provincia, Localidad } from '@/types'

export default function ObrasClient({
  obras,
  provincias = [],
  localidades = [],
  buscarObrasAction,
}: {
  obras: Obra[]
  provincias?: Provincia[]
  localidades?: Localidad[]
  buscarObrasAction?: (filtro: string) => Promise<Obra[]>
}) {
  const router = useRouter()

  const handleCreate = () => router.push('/coordinacion/obras/crear')
  const handleEdit = (obra: Obra) => {
    const id = (obra as any).cod_obra ?? (obra as any).id
    router.push(`/coordinacion/obras/${id}/editar`)
  }
  const handleScheduleVisit = (obra: Obra) =>
    router.push(`/coordinacion/visitas/crear?obra=${obra.cod_obra}`)
  const handleScheduleEntrega = (obra: Obra) =>
    router.push(`/coordinacion/entregas/crear?obra=${obra.cod_obra}`)

  return (
    <ObrasList
      obras={obras}
      onCreateClick={handleCreate}
      onEditClick={handleEdit}
      onScheduleVisit={handleScheduleVisit}
      onScheduleEntrega={handleScheduleEntrega}
      provincias={provincias}
      localidades={localidades}
      buscarObrasAction={buscarObrasAction}
    />
  )
}
