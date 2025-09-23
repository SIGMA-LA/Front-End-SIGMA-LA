'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ChevronRight } from 'lucide-react'
import { LoginFormData, loginSchema } from '@/schemas/loginSchemas'
import { safeParse, number} from 'valibot'
import { LoginFormProps } from '@/types/index'

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    cuil: '',
    contrasenia: '',
  });

  const [errors, setErrors] = useState({
    cuil: '',
    contrasenia: '',
    general: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {

    const dataToValidate = {
      ...formData,
      cuil: formData.cuil,
    };

    const result = safeParse(loginSchema, dataToValidate)

    if (!result.success) {
      const fieldErrors: typeof errors = {
        cuil: '',
        contrasenia: '',
        general: '',
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

    setErrors({ cuil: '', contrasenia: '', general: '' })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors((prev) => ({ ...prev, general: '' }))

    try {
      await onLogin(formData.cuil, formData.contrasenia)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general:
          'CUIL o contraseña incorrectos. Por favor, inténtalo de nuevo.',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="border-gray-20 w-full max-w-md border bg-white shadow-sm sm:max-w-md">
        <CardHeader className="pt-12 text-center">
          <div className="mb-8 flex items-center justify-center space-x-3">
            <span className="text-2xl font-semibold text-blue-600">
              SIGMA - LA
            </span>
            <div className="flex">
              <ChevronRight className="h-6 w-6 text-blue-400" />
              <ChevronRight className="-ml-2 h-6 w-6 text-blue-400" />
              <ChevronRight className="-ml-2 h-6 w-6 text-blue-400" />
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-normal text-gray-800">
            Inicio de sesión
          </h1>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="usuario"
                className="text-sm font-medium text-gray-700"
              >
                Usuario
              </Label>
              <div className="pt-1">
                <Input
                  id="usuario"
                  type="text"
                  value={formData.cuil}
                  onChange={(e) => handleInputChange('cuil', e.target.value)}
                  placeholder="Ingresa tu cuil"
                  className={`h-10 w-full placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:h-11 lg:h-12 ${
                    errors.cuil
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.cuil && (
                  <p className="mt-1 text-sm text-red-600">{errors.cuil}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contrasenia"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </Label>
              <div className="pt-1">
                <Input
                  id="contrasenia"
                  type="password"
                  value={formData.contrasenia}
                  onChange={(e) =>
                    handleInputChange('contrasenia', e.target.value)
                  }
                  placeholder="Ingresa tu contraseña"
                  className={`h-10 w-full placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:h-11 lg:h-12 ${
                    errors.contrasenia
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.contrasenia && (
                <p className="mt-1 text-sm text-red-600">{errors.contrasenia}</p>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-md bg-blue-500 text-base font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
