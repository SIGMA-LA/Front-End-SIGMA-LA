import { getLocalidades } from '@/actions/localidad'
import LocalidadesPageClient from './LocalidadesPageClient'

export default async function LocalidadesPage() {
  const localidades = await getLocalidades()
  return <LocalidadesPageClient localidades={localidades} />
}