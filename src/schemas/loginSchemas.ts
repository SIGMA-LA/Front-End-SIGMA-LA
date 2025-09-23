import {
  object,
  string,
  minLength,
  nonEmpty,
  pipe,
  type InferOutput,
  number,
  minValue,
} from 'valibot'

export const loginSchema = object({
  cuil: pipe(
    string(),
    nonEmpty('El campo CUIL es obligatorio'),
    minLength(10, 'El CUIL debe tener al menos 10 caracteres')
  ),
  contrasenia: pipe(
    string(),
    nonEmpty('El campo Contraseña es obligatorio'),
    minLength(6, 'La contraseña debe tener al menos 6 caracteres')
  ),
});

export type LoginFormData = InferOutput<typeof loginSchema>
