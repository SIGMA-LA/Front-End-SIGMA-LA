'use server'

import { revalidatePath } from 'next/cache'
import { getAccessToken } from './auth'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

interface CrearOrdenData {
  cod_obra: number
  file: File
  observaciones?: string
}

/**
 * Sube un PDF a Cloudinary
 */
async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!)
  formData.append('folder', 'ordenes_produccion')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Error al subir archivo a Cloudinary')
  }

  const data = await response.json()
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  }
}

/**
 * Crea una nueva orden de producción
 */
export async function crearOrdenProduccion(formData: FormData) {
  try {
    const cod_obra = parseInt(formData.get('cod_obra') as string)
    const file = formData.get('file') as File
    const observaciones = formData.get('observaciones') as string | null

    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Debe seleccionar un archivo',
      }
    }

    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'Solo se permiten archivos PDF',
      }
    }

    const { secure_url, public_id } = await uploadToCloudinary(file)
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/ordenes-produccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cod_obra,
        fecha_confeccion: new Date().toISOString().split('T')[0],
        fecha_validacion: null,
        url: secure_url,
        public_id: public_id,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al crear orden de producción')
    }

    const ordenCreada = await response.json()
    revalidatePath('/produccion')
    revalidatePath('/obras')

    return {
      success: true,
      data: ordenCreada,
    }
  } catch (error) {
    console.error('Error en crearOrdenProduccion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Obtiene órdenes de producción con filtros opcionales
 */
export async function obtenerOrdenesProduccion(
  estado?: 'PENDIENTE' | 'APROBADA' | 'EN PRODUCCION' | 'FINALIZADA',
  cod_obra?: number
) {
  try {
    let url = `${baseUrl}/ordenes-produccion`

    // Si se especifica un estado específico, usar el endpoint correspondiente
    if (estado === 'APROBADA') {
      url = `${baseUrl}/ordenes-produccion/validadas`
    } else if (estado === 'EN PRODUCCION') {
      url = `${baseUrl}/ordenes-produccion/en-produccion`
    }

    // Si se especifica una obra, usar el endpoint por obra
    if (cod_obra) {
      url = `${baseUrl}/ordenes-produccion/obra/${cod_obra}`
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Error al obtener órdenes de producción')
    }

    const ordenes = await response.json()

    // Si se especifica un estado y no es un endpoint específico, filtrar manualmente
    if (
      estado &&
      estado !== 'APROBADA' &&
      estado !== 'EN PRODUCCION' &&
      !cod_obra
    ) {
      return {
        success: true,
        data: ordenes.filter((orden: any) => orden.estado === estado),
      }
    }

    return {
      success: true,
      data: ordenes,
    }
  } catch (error) {
    console.error('Error en obtenerOrdenesProduccion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: [],
    }
  }
}

/**
 * Aprueba una orden de producción (cambia estado a APROBADA y registra fecha_validacion)
 */
export async function aprobarOrdenProduccion(cod_op: number) {
  try {
    const response = await fetch(`${baseUrl}/ordenes-produccion/${cod_op}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estado: 'APROBADA',
        fecha_validacion: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Error al aprobar orden de producción')
    }

    const ordenActualizada = await response.json()
    revalidatePath('/dashboard')
    revalidatePath('/coordinacion')

    return {
      success: true,
      data: ordenActualizada,
      message: 'Orden de producción aprobada exitosamente',
    }
  } catch (error) {
    console.error('Error en aprobarOrdenProduccion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Obtiene una orden de producción por su código
 */
export async function obtenerOrdenProduccion(cod_op: number) {
  try {
    const response = await fetch(`${baseUrl}/ordenes-produccion/${cod_op}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Error al obtener orden de producción')
    }

    const orden = await response.json()

    return {
      success: true,
      data: orden,
    }
  } catch (error) {
    console.error('Error en obtenerOrdenProduccion:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
