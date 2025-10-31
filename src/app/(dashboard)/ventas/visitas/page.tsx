'use client'
import { obtenerVisitas } from '@/actions/visitas'
import VisitasList from '@/components/shared/VisitasList'

export default async function VisitasPage() {
  const visitas = await obtenerVisitas()
  return <VisitasList visitas={visitas} />
}
