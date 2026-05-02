'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadNotaFabrica, deleteNotaFabrica } from '@/actions/obras'
import { notify } from '@/lib/toast'

interface UseNotaFabricaParams {
  codObra: number
  onUploadSuccess?: (url: string) => void
  onClose: () => void
}

export function useNotaFabrica({
  codObra,
  onUploadSuccess,
  onClose,
}: UseNotaFabricaParams) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modoCambio, setModoCambio] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF')
        setSelectedFile(null)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no puede superar los 10MB')
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Debe seleccionar un archivo PDF')
      return
    }
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await uploadNotaFabrica(codObra, formData)

      if (!res.success) {
        setError(res.error || 'Error al subir la nota de fábrica.')
        notify.error(res.error || 'Error al subir la nota de fábrica.')
        return
      }

      setSelectedFile(null)
      setModoCambio(false)
      onUploadSuccess?.(res.data!.nota_fabrica || '')
      notify.success('Nota de fabrica actualizada correctamente.')
      router.refresh()
      onClose()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al subir la nota de fábrica. Intenta nuevamente.'
      setError(message)
      notify.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async () => {
    try {
      setIsDeleting(true)
      setLoading(true)
      setError(null)
      const res = await deleteNotaFabrica(codObra)
      if (!res.success) {
        setError(res.error || 'Error al eliminar la nota de fábrica.')
        notify.error(res.error || 'Error al eliminar la nota de fábrica.')
        return
      }
      onUploadSuccess?.(res.data!.nota_fabrica || '')
      setModoCambio(false)
      notify.success('Nota de fabrica eliminada correctamente.')
      router.refresh()
      onClose()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al eliminar la nota de fábrica. Intenta nuevamente.'
      setError(message)
      notify.error(message)
    } finally {
      setLoading(false)
      setIsDeleting(false)
    }
  }

  const handleCambioNota = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await deleteNotaFabrica(codObra)
      if (!res.success) {
        setError(res.error || 'Error al eliminar la nota de fábrica.')
        notify.error(res.error || 'Error al eliminar la nota de fábrica.')
        return
      }
      onUploadSuccess?.(res.data!.nota_fabrica || '')
      setModoCambio(true)
      setSelectedFile(null)
      notify.info('Nota eliminada. Ya puedes subir una nueva.')
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al eliminar la nota de fábrica. Intenta nuevamente.'
      setError(message)
      notify.error(message)
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setSelectedFile(null)
    setError(null)
    setModoCambio(false)
  }

  return {
    selectedFile,
    loading,
    isDeleting,
    error,
    modoCambio,
    setModoCambio,
    handleFileChange,
    handleUpload,
    handleEliminar,
    handleCambioNota,
    resetState,
  }
}
