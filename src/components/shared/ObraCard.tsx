'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Obra, Provincia } from '@/types'
import EstadoObraBadge from './EstadoObraBadge'
import {
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  User,
  Building2,
} from 'lucide-react'
import ConfirmDeleteModal from '../ventas/ConfirmDeleteModal'
import Link from 'next/link'
import { deleteObra } from '@/actions/obras'

interface ObraCardProps {
  obra: Obra
  usuarioRol: string | undefined
  provincias: Provincia[]
}

export default function ObraCard({
  obra,
  usuarioRol,
  provincias,
}: ObraCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)

  const provincia = useMemo(() => {
    if (obra.localidad && provincias.length > 0) {
      return provincias.find(
        (p) => p.cod_provincia === obra.localidad.cod_provincia
      )
    }
    return null
  }, [obra.localidad, provincias])

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteObra(obra.cod_obra)
        setModalOpen(false)
        router.refresh()
      } catch (error) {
        console.error('Error al eliminar obra:', error)
        alert('Error al eliminar la obra')
      }
    })
  }

  const esVentas = usuarioRol === 'VENTAS'
  const isCancelada = obra.estado === 'CANCELADA'

  const nombreCliente =
    obra.cliente?.tipo_cliente === 'EMPRESA'
      ? obra.cliente.razon_social
      : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim() ||
        'N/A'

  return (
    <>
      <ConfirmDeleteModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleDelete}
        loading={isPending}
        title="Eliminar Obra"
        message={`¿Está seguro que desea eliminar la obra "${obra.direccion}"? Pasará a estado "CANCELADA".`}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header con dirección y estado */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{obra.direccion}</h3>
          </div>
          <EstadoObraBadge estado={obra.estado} />
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Ubicación */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Ubicación</p>
                <p className="font-semibold text-gray-900">
                  {obra.localidad?.nombre_localidad || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {provincia?.nombre || 'N/A'}
                </p>
              </div>
            </div>

            {/* Cliente */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Cliente</p>
                <p className="font-semibold text-gray-900">{nombreCliente}</p>
                <p className="text-sm text-gray-600">
                  Inicio:{' '}
                  {new Date(obra.fecha_ini).toLocaleDateString('es-AR', {
                    timeZone: 'UTC',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-2">
            {!esVentas && (
              <>
                <Link
                  href={`/coordinacion/visitas/crear?obraId=${obra.cod_obra}`}
                  className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar Visita
                </Link>
                <Link
                  href={`/coordinacion/entregas/crear?obraId=${obra.cod_obra}`}
                  className="flex items-center gap-2 rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar Entrega
                </Link>
              </>
            )}

            {esVentas && (
              <>
                <Link
                  href={`/ventas/obras/${obra.cod_obra}/pagos`}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <DollarSign className="h-4 w-4" />
                  Pagos
                </Link>
                <Link
                  href={`/ventas/obras/${obra.cod_obra}/editar`}
                  className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>
                {!isCancelada && (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
