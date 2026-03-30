'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

export default function EstadoVisitaFilter({ initialValue = '' }: { initialValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentEstado = searchParams.get('estado') || initialValue || ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value && e.target.value !== 'ALL') {
      params.set('estado', e.target.value)
    } else {
      params.delete('estado')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="relative w-full leading-normal text-sm text-gray-700">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <select
        value={currentEstado}
        onChange={handleChange}
        className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm outline-none transition-colors appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="ALL">Todos los Estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="COMPLETADA">Completada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
