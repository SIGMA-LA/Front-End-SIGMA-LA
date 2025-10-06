'use server'

import { revalidatePath } from 'next/cache'

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ordenes-produccion`,
      {
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
      }
    )

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
