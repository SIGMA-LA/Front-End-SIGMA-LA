import {
  object,
  string,
  minLength,
  nonEmpty,
  pipe,
  type InferOutput,
} from 'valibot'

export const loginSchema = object({
  usuario: pipe(
    string(),
    nonEmpty('El campo Usuario es obligatorio'),
    minLength(3, 'El usuario debe tener al menos 3 caracteres')
  ),
  contrasena: pipe(
    string(),
    nonEmpty('El campo Contraseña es obligatorio'),
    minLength(6, 'La contraseña debe tener al menos 6 caracteres')
  ),
})

export type LoginFormData = InferOutput<typeof loginSchema>
