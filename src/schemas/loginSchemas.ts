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
    number('El CUIL debe ser un número'),
    minValue(1, 'El campo CUIL es obligatorio')
  ),
  contrasenia: pipe(
    string(),
    nonEmpty('El campo Contraseña es obligatorio'),
    minLength(6, 'La contraseña debe tener al menos 6 caracteres')
  ),
});

export type LoginFormData = InferOutput<typeof loginSchema>
