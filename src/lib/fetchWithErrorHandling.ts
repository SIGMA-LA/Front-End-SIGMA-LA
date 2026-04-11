import type { ValidationIssue, ValidationDetail, BackendErrorData } from '@/types'

const TECHNICAL_MESSAGE_PATTERNS = [
  /Invalid length/i,
  /Expected .* but received/i,
  /^Invalid type/i,
  /must be a/i,
  /is required/i,
  /is not allowed/i,
]

function isTechnicalMessage(msg: string): boolean {
  return TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(msg))
}

const FIELD_NAME_MAP: Record<string, string> = {
  cuil: 'CUIL',
  contrasenia: 'contraseña',
  nombre: 'nombre',
  apellido: 'apellido',
  email: 'correo electrónico',
  telefono: 'teléfono',
  direccion: 'dirección',
  monto: 'monto',
  fecha: 'fecha',
  estado: 'estado',
  rol_actual: 'rol',
  area_trabajo: 'área de trabajo',
  patente: 'patente',
  tipo: 'tipo',
  detalle: 'detalle',
  observaciones: 'observaciones',
}

function resolveFieldName(path: string): string {
  const field = path.split('.').pop() ?? path
  return FIELD_NAME_MAP[field] ?? field
}

function mapValidationIssues(details: ValidationDetail[]): string {
  const seenPaths = new Set<string>()
  const messages: string[] = []

  for (const detail of details) {
    for (const issue of detail.issues) {
      if (seenPaths.has(issue.path)) continue
      seenPaths.add(issue.path)

      const fieldLabel = resolveFieldName(issue.path)
      if (isTechnicalMessage(issue.message)) {
        messages.push(`El campo "${fieldLabel}" no es válido.`)
      } else {
        const msg = issue.message.endsWith('.') ? issue.message : `${issue.message}.`
        messages.push(msg)
      }
    }
  }

  return messages.length > 0 ? messages.join(' ') : 'Los datos ingresados no son válidos.'
}

export async function fetchWithErrorHandling<T = unknown>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response & { json(): Promise<T> }> {
  const { timeout = 10000, ...fetchOptions } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      let errorMsg = 'Ocurrió un error al procesar la solicitud.'
      try {
        const errorData = (await res.json()) as BackendErrorData

        if (errorData.errorCode === 'VALIDATION_ERROR' && Array.isArray(errorData.details)) {
          const validationDetails = errorData.details.filter(
            (d): d is ValidationDetail => typeof d === 'object' && d !== null && 'issues' in d
          )
          errorMsg = mapValidationIssues(validationDetails)
        } else if (errorData.message) {
          errorMsg = errorData.message
        } else if (errorData.error) {
          errorMsg = errorData.error
        }
      } catch {
        if (res.status === 401) errorMsg = 'Sesión expirada o no autorizada.'
        else if (res.status === 404) errorMsg = 'El recurso solicitado no fue encontrado.'
        else if (res.status === 403) errorMsg = 'No tenés permisos para realizar esta acción.'
        else if (res.status >= 500) errorMsg = 'Ocurrió un problema en el servidor. Intentá nuevamente.'
      }
      throw new Error(errorMsg)
    }

    const originalJson = res.json.bind(res)
    res.json = async <R = unknown>() => {
      const json = (await originalJson()) as {
        status: string
        data: R
        message?: string
      }
      if (json && json.status === 'success' && json.data !== undefined) {
        return json.data
      }
      return json as unknown as R
    }

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new Error('La solicitud tardó demasiado. Intentá nuevamente.')

      const cause = err.cause as { code?: string } | undefined
      if (cause?.code === 'ECONNREFUSED') {
        throw new Error('No se pudo establecer conexión. Verificá tu conexión a internet e intentá nuevamente.')
      }
      throw err
    }
    throw new Error('Ocurrió un error inesperado. Intentá nuevamente.')
  }
}
