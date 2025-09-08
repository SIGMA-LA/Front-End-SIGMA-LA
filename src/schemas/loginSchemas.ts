/*
import { object, string, minLength, type Output } from 'valibot'

// Definimos el esquema de validación para el formulario de login.
export const loginSchema = object({
  usuario: string('El nombre de usuario es obligatorio.'),
  contrasena: string([
    minLength(1, 'La contraseña es obligatoria.'),
    minLength(6, 'La contraseña debe tener al menos 6 caracteres.'),
  ]),
})

// Exportamos el tipo inferido del esquema para usarlo en nuestro componente.
export type LoginFormData = Output<typeof loginSchema>
*/