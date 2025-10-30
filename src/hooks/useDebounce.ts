import { useEffect, useState } from 'react'

/**
 * Hook genérico de debounce.
 * Retorna el valor debounced después del delay especificado.
 *
 * @example
 * const debounced = useDebounce(searchTerm, 500)
 */
export default function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
