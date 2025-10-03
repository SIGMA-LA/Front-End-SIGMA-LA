import { useState, useCallback } from 'react'
import { safeParse, type BaseSchema, type BaseIssue } from 'valibot'

interface UseValibotFormOptions<T> {
  schema: BaseSchema<T, T, BaseIssue<unknown>>
  onSubmit: (data: T) => void | Promise<void>
  initialValues?: Partial<T>
}

interface FormErrors {
  [key: string]: string
}

export function useValibotForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues = {},
}: UseValibotFormOptions<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback(
    (data: Partial<T>): { success: boolean; errors: FormErrors } => {
      const result = safeParse(schema, data)

      if (!result.success) {
        const formErrors: FormErrors = {}
        
        result.issues.forEach((issue) => {
          const field = issue.path?.[0]?.key as string
          if (field && !formErrors[field]) {
            formErrors[field] = issue.message
          }
        })

        return { success: false, errors: formErrors }
      }

      return { success: true, errors: {} }
    },
    [schema]
  )

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      
      // Limpiar error del campo cuando el usuario empieza a escribir
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field as string]
          return newErrors
        })
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      const validation = validate(values)
      
      if (!validation.success) {
        setErrors(validation.errors)
        return
      }

      setErrors({})
      setIsSubmitting(true)

      try {
        await onSubmit(values as T)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validate, onSubmit]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setFieldError,
    setValues,
  }
}