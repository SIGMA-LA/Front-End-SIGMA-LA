# Front-End SIGMA-LA

Esta es la aplicación cliente del sistema SIGMA-LA, construida con **Next.js 15** utilizando el **App Router** y **React 19**.

## Estructura del Proyecto

```text
src/
├── app/              # Rutas, layouts y páginas (Next.js App Router)
│   ├── (auth)/       # Rutas de autenticación (Login)
│   ├── (dashboard)/  # Rutas protegidas divididas por rol
│   └── api/          # Route handlers locales (si aplican)
├── actions/          # Server Actions para mutaciones y fetching de datos
├── components/       # Componentes de React
│   ├── ui/           # Componentes base (shadcn/ui o similares)
│   ├── shared/       # Componentes reutilizables entre distintos módulos
│   └── [modulo]/     # Componentes específicos de una funcionalidad
├── hooks/            # Hooks personalizados
├── lib/              # Utilidades, configuración de clientes (axios, fetch)
├── schemas/          # Esquemas de validación con Valibot
├── types/            # Definiciones de TypeScript
└── middleware.ts     # Manejo de sesiones y redirección por roles
```

## Convenciones de Desarrollo

### Server Actions
Las Server Actions son el mecanismo principal para interactuar con el backend desde los componentes del lado del servidor.

-   **Ubicación**: Siempre deben estar en `src/actions/`.
-   **Nomenclatura**:
    -   Funciones de formulario: `[accion]Action` (ej. `loginAction`).
    -   Funciones de obtención: `get[Entidad]` (ej. `getClientes`).
-   **Estructura**:
    -   Deben usar `'use server'` en la parte superior.
    -   Deben retornar un tipo consistente, preferiblemente `ActionResponse<T>`.
-   **Validación**: Utilizar **Valibot** para validar los datos de entrada (especialmente en mutaciones).

### Autenticación y Sesiones
El sistema utiliza un flujo de autenticación basado en **JWT** (JSON Web Tokens).

1.  **Tokens**: El `accessToken` y `refreshToken` se almacenan en cookies `httpOnly` para mayor seguridad.
2.  **Middleware**: El archivo `src/middleware.ts` intercepta las peticiones para verificar la sesión y redirigir al dashboard correspondiente según el rol del usuario (`ADMIN`, `VENTAS`, etc.).
3.  **Refresco de Token**: La función `getAccessToken` en `actions/auth.ts` gestiona automáticamente la renovación del token si el de acceso ha expirado.

## Funciones Clave

### `fetchWithErrorHandling<T>`
Ubicada en `src/lib/fetchWithErrorHandling.ts`, esta función envuelve el `fetch` nativo para estandarizar el manejo de errores del backend.
-   **Mapeo de Errores**: Traduce códigos de error técnicos (como errores de validación) a mensajes amigables en español utilizando un `FIELD_NAME_MAP`.
-   **Manejo de Timeouts**: Incluye un mecanismo de aborto automático (10s por defecto).
-   **Parsing de Respuesta**: Detecta si la respuesta del backend sigue el formato `{ status: 'success', data: ... }` y retorna directamente la data desempaquetada.

### `getAccessToken()`
Ubicada en `src/actions/auth.ts`, es la función encargada de proveer un token válido para las peticiones seguras.
-   **Silent Refresh**: Si el `accessToken` no está en las cookies pero sí el `refreshToken`, realiza una petición al endpoint `/auth/refresh` de forma transparente para el usuario.

## Flujos Principales

### Flujo de Autenticación
1.  **Login**: El `loginAction` envía las credenciales al backend. Si es exitoso, setea las cookies `accessToken`, `refreshToken` y `usuario` como `httpOnly`.
2.  **Protección de Rutas**: El `middleware.ts` intercepta la navegación. Si el usuario intenta entrar a una ruta de rol (ej. `/admin`) sin token, es redirigido a `/login`. Si tiene un rol distinto, es redirigido a su dashboard correspondiente.
3.  **Persistencia**: Al recargar, el servidor lee las cookies para determinar el estado de la sesión.

### Flujo de Mutación (Creación/Edición)
1.  **Componente**: Un formulario de React captura los datos del usuario.
2.  **Server Action**: Llama a funciones como `createCliente(formData)`.
3.  **Validación & Envío**: La acción convierte el `FormData` a JSON y usa `fetchWithErrorHandling` para enviarlo a la API.
4.  **Respuesta**: Si hay error, se retorna al componente para mostrar un `toast`. Si es exitoso, se ejecuta `revalidatePath` para actualizar la caché de Next.js.

## Dependencias Principales

-   **Next.js 15**: Framework para React con renderizado híbrido.
-   **React 19**: Biblioteca para interfaces de usuario.
-   **Valibot**: Biblioteca de validación de esquemas (ligera y modular).
-   **Lucide React**: Set de iconos.
-   **Recharts**: Visualización de datos y gráficos.
-   **Tailwind CSS**: Framework de estilos basado en utilidades.

## Ejemplos de Uso

### Uso de Componentes Compartidos

#### SearchWrapper
Utilizado para implementar búsqueda con debounce en listas.

```tsx
import { SearchWrapper } from '@/components/shared/SearchWrapper'

export default function MiPagina() {
  return (
    <SearchWrapper 
      placeholder="Buscar cliente..." 
      queryParam="q" 
    />
  )
}
```

### Definición de una Server Action

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/types/actions'

export async function miAccion(formData: FormData): Promise<ActionResponse<any>> {
  try {
    // Lógica de interacción con API
    revalidatePath('/ruta-a-actualizar')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Mensaje de error' }
  }
}
```

---

Para más información sobre el backend, consulta el [README del Back-End](../Back-End-SIGMA-LA/README.md).
