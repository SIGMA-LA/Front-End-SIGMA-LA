'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { useGlobalContext } from '@/context/GlobalContext'
import EstadoObraBadge from '../shared/EstadoObraBadge'
import { ExternalLink, FileX } from 'lucide-react'

export default function ObrasView() {
  const { obras, fetchObras } = useGlobalContext()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarObras = async () => {
      try {
        await fetchObras()
      } catch (err) {
        setError('No se pudieron cargar las obras.')
      } finally {
        setCargando(false)
      }
    }
    cargarObras()
  }, [fetchObras])

  if (cargando) return <div className="p-8 text-center">Cargando obras...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Supervisión de Obras</h2>
      <div className="space-y-4">
        {obras.length > 0 ? (
          obras.map((obra) => (
            <Card key={obra.cod_obra}>
              <CardContent className="p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {obra.direccion}
                    </h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-gray-600 sm:grid-cols-2">
                      <p>
                        <strong>Cliente:</strong> {obra.cliente.razon_social}
                      </p>
                      <p>
                        <strong>Fecha Inicio:</strong>{' '}
                        {new Date(obra.fecha_ini).toLocaleDateString('es-AR')}
                      </p>
                      <div className="col-span-1 sm:col-span-2">
                        <strong>Nota de Fábrica:</strong>
                        {obra.nota_fabrica &&
                        obra.nota_fabrica.trim() !== '' ? (
                          <a
                            href={obra.nota_fabrica}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline"
                          >
                            Ver Nota
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="ml-2 inline-flex items-center gap-1.5 text-gray-500">
                            <FileX className="h-4 w-4" />
                            No disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <EstadoObraBadge estado={obra.estado} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No hay obras para mostrar.</p>
        )}
      </div>
    </div>
  )
}
