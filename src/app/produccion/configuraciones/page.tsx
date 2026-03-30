import Configuraciones from '@/components/shared/Configuraciones'
import Navbar from '@/components/layout/Navbar'
import { getUsuario } from '@/lib/cache'
import { redirect } from 'next/navigation'

export default async function ProduccionConfiguracionesPage() {
  const usuario = await getUsuario()
  if (!usuario) redirect('/login')

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar usuario={usuario} />
      <Configuraciones />
    </div>
  )
}
