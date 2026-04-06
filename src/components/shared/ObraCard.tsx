'use client'

import { useState, useMemo, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ObraCardProps } from '@/types'
import EstadoObraBadge from './EstadoObraBadge'
import {
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  User,
  Building2,
  FileText,
  DraftingCompass,
  ArchiveX,
} from 'lucide-react'
import EliminarObraModal from '../ventas/EliminarObraModal'
import NotaFabricaModal from '../ventas/NotaFabricaModal'
import Link from 'next/link'
import { deleteObra, cancelObra } from '@/actions/obras'
import { notify } from '@/lib/toast'

export default function ObraCard({
  obra,
  usuarioRol,
  provincias,
}: ObraCardProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'deu6htdbs'
  const getNotaUrl = useCallback(
    (publicId?: string | null) =>
      publicId
        ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
        : '',
    [cloudName]
  )

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [notaFabricaModalOpen, setNotaFabricaModalOpen] = useState(false)
  // nota_fabrica_pid contiene el public_id de Cloudinary, no nota_fabrica que es texto
  const [notaFabricaUrl, setNotaFabricaUrl] = useState(
    getNotaUrl(obra.nota_fabrica_pid)
  )

  useEffect(() => {
    setNotaFabricaUrl(getNotaUrl(obra.nota_fabrica_pid))
  }, [obra.nota_fabrica_pid, getNotaUrl])

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
        const res = await deleteObra(obra.cod_obra)
        if (!res.success) {
          notify.error(
            res.error || 'No se pudo eliminar la obra. Intente nuevamente.'
          )
          return
        } else {
          notify.success('Obra eliminada correctamente.')
        }
        setModalOpen(false)
        router.refresh()
      } catch (error) {
        console.error('Error al eliminar obra:', error)
        notify.error('Error al eliminar la obra')
      }
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      try {
        const res = await cancelObra(obra.cod_obra)
        if (!res.success) {
          notify.error(
            res.error || 'No se pudo cancelar la obra. Intente nuevamente.'
          )
          return
        }
        notify.success('Obra cancelada correctamente.')
        setModalOpen(false)
        router.refresh()
      } catch (error) {
        console.error('Error al cancelar obra:', error)
        notify.error('Error al cancelar la obra')
      }
    })
  }

  const handleNotaFabricaSuccess = (publicId: string) => {
    setNotaFabricaUrl(getNotaUrl(publicId))
    router.refresh()
  }

  const esVentas = usuarioRol === 'VENTAS'
  const esAdmin = usuarioRol === 'ADMIN'
  const esCoordinacion = usuarioRol === 'COORDINACION'
  const isCancelada = obra.estado === 'CANCELADA'
  const esperaPago = obra.estado === 'EN ESPERA DE PAGO'

  const nombreCliente =
    obra.cliente?.tipo_cliente === 'EMPRESA'
      ? obra.cliente.razon_social
      : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim() ||
        'N/A'

  const nombreArquitecto = obra.arquitecto
    ? `${obra.arquitecto.nombre ?? ''} ${obra.arquitecto.apellido ?? ''}`.trim()
    : null

  return (
    <>
      <EliminarObraModal
        open={modalOpen}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onClose={() => setModalOpen(false)}
        direccion={obra.direccion}
        isEliminacion={esperaPago}
      />

      <NotaFabricaModal
        isOpen={notaFabricaModalOpen}
        onClose={() => setNotaFabricaModalOpen(false)}
        notaUrl={notaFabricaUrl}
        codObra={obra.cod_obra}
        onUploadSuccess={handleNotaFabricaSuccess}
        rolActual={usuarioRol}
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
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Arquitecto */}
            {nombreArquitecto && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <DraftingCompass className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Arquitecto
                  </p>
                  <p className="font-semibold text-gray-900">
                    {nombreArquitecto}
                  </p>
                  <p className="text-sm text-gray-600">Profesional Resp.</p>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-2">
            {/* ADMIN: Solo ver detalle */}
            {esAdmin && (
              <Link
                href={`/admin/obras/${obra.cod_obra}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Building2 className="h-4 w-4" />
                Ver Detalle
              </Link>
            )}

            {/* COORDINACION: Agendar visitas y entregas */}
            {esCoordinacion && (
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

            {/* VENTAS: Gestión completa */}
            {esVentas && (
              <>
                <Link
                  href={`/ventas/pagos?q=${encodeURIComponent(obra.direccion)}`}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <DollarSign className="h-4 w-4" />
                  Pagos
                </Link>
                <button
                  onClick={() => setNotaFabricaModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4" />
                  {notaFabricaUrl ? 'Ver Nota' : 'Subir Nota'}
                </button>
                <Link
                  href={`/ventas/obras/${obra.cod_obra}/editar`}
                  className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>
                {!isCancelada && esperaPago && (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                  </button>
                )}
                {!isCancelada && !esperaPago && (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <ArchiveX className="h-4 w-4" />
                    {isPending ? 'Cancelando...' : 'Cancelar'}
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
