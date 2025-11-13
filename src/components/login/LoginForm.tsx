'use client'

import type React from 'react'
import { useState, useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Sigma } from 'lucide-react'
import { LoginFormData, loginSchema } from '@/schemas/loginSchemas'
import { safeParse } from 'valibot'

interface LoginFormProps {
  loginAction: (
    formData: FormData
  ) => Promise<{ error?: string; redirectTo?: string }>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-base font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-800 disabled:bg-blue-300"
    >
      {pending ? 'Ingresando...' : 'Ingresar'}
    </Button>
  )
}

export default function LoginForm({ loginAction }: LoginFormProps) {
  const router = useRouter()
  const wrappedAction = async (
    _prevState: { error?: string; redirectTo?: string },
    formData: FormData
  ) => {
    return await loginAction(formData)
  }

  const [state, formAction] = useActionState(wrappedAction, {
    error: undefined,
    redirectTo: undefined,
  })
  const [formData, setFormData] = useState({
    cuil: '',
    contrasenia: '',
  })

  const [errors, setErrors] = useState({
    cuil: '',
    contrasenia: '',
  })

  // Manejar redirect cuando loginAction retorna redirectTo
  useEffect(() => {
    if (state?.redirectTo) {
      router.push(state.redirectTo)
    }
  }, [state?.redirectTo, router])

  const validateForm = () => {
    const dataToValidate = {
      ...formData,
      cuil: formData.cuil,
    }

    const result = safeParse(loginSchema, dataToValidate)

    if (!result.success) {
      const fieldErrors: typeof errors = {
        cuil: '',
        contrasenia: '',
      }

      for (const issue of result.issues) {
        const path = issue.path?.[0]?.key as keyof LoginFormData | undefined
        if (path && path in fieldErrors) {
          fieldErrors[path] = issue.message
        }
      }

      setErrors(fieldErrors)
      return false
    }

    setErrors({ cuil: '', contrasenia: '' })
    return true
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateForm()) {
      e.preventDefault()
      return
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="flex w-full justify-center px-4 sm:px-0">
        <Card className="w-full max-w-xs border-0 bg-white shadow-xl sm:max-w-md">
          <CardHeader className="!p-0 !pt-8 text-center">
            <div className="mb-4 flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-3 shadow-md">
                <Sigma className="h-12 w-12 text-blue-700 drop-shadow" />
              </div>
              <span className="mt-3 text-2xl font-bold tracking-tight text-blue-700 drop-shadow-sm">
                SIGMA <span className="font-light text-blue-500">- LA</span>
              </span>
            </div>
            <h1 className="text-lg font-medium text-blue-900">
              Inicio de sesión
            </h1>
          </CardHeader>

          <CardContent className="p-0 px-1 pb-8 sm:px-8">
            <form
              action={formAction}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="mb-3">
                {state?.error && (
                  <div className="!m-4 rounded-md border border-red-200 bg-red-50 p-2 !px-4">
                    <p className="text-sm text-red-600">{state.error}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="usuario"
                  className="p-0 px-4 text-sm font-medium text-blue-800"
                >
                  Usuario
                </Label>
                <div className="px-4 pt-1">
                  <Input
                    id="usuario"
                    name="cuil"
                    type="text"
                    value={formData.cuil}
                    onChange={(e) => handleInputChange('cuil', e.target.value)}
                    placeholder="Ingresa tu cuil"
                    className={`h-10 w-full rounded-lg border-2 placeholder:text-blue-300 focus:border-blue-500 focus:ring-blue-500 sm:h-11 lg:h-12 ${
                      errors.cuil
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-blue-200'
                    }`}
                  />
                  {errors.cuil && (
                    <p className="mt-1 text-xs text-red-600">{errors.cuil}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="contrasenia"
                  className="px-4 text-sm font-medium text-blue-800"
                >
                  Contraseña
                </Label>
                <div className="px-4 pt-1">
                  <Input
                    id="contrasenia"
                    name="contrasenia"
                    type="password"
                    value={formData.contrasenia}
                    onChange={(e) =>
                      handleInputChange('contrasenia', e.target.value)
                    }
                    placeholder="Ingresa tu contraseña"
                    className={`h-10 w-full rounded-lg border-2 placeholder:text-blue-300 focus:border-blue-500 focus:ring-blue-500 sm:h-11 lg:h-12 ${
                      errors.contrasenia
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-blue-200'
                    }`}
                  />
                </div>
                {errors.contrasenia && (
                  <p className="mt-1 px-4 text-xs text-red-600">
                    {errors.contrasenia}
                  </p>
                )}
              </div>

              <div className="px-4 pt-2">
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
