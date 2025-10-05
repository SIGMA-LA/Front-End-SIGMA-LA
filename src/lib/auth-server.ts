// src/lib/auth-server.ts
"use server"; // Marcamos que puede usarse en el servidor

import { cookies } from 'next/headers';

/**
 * Obtiene un token de acceso válido desde las cookies del servidor.
 * Si el token ha expirado, intenta renovarlo usando el refresh token.
 * Esta función es para ser usada EXCLUSIVAMENTE en Server Actions y Route Handlers.
 */
export async function getValidAccessToken(): Promise<string> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value; // <-- Ajusta el nombre de la cookie si es diferente

  if (accessToken) {
    return accessToken;
  }

  // Lógica de Refresh Token (si no hay accessToken)
  const refreshToken = (await cookieStore).get('refreshToken')?.value; // <-- Ajusta el nombre

  if (!refreshToken) {
    throw new Error('Sesión no encontrada. Por favor, inicie sesión de nuevo.');
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error("La URL de la API no está configurada.");

    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Aquí podrías manejar el caso de un refresh token inválido y forzar un logout.
      throw new Error('No se pudo renovar la sesión.');
    }

    const data = await response.json();
    const newAccessToken = data.token || data.accessToken;

    if (!newAccessToken) {
      throw new Error('La respuesta de refresh no contenía un nuevo token.');
    }

    // Opcional: Podrías guardar el nuevo token en las cookies aquí si es necesario.
    return newAccessToken;
  } catch (error) {
    console.error('Error renovando el token:', error);
    // Lanza un error que pueda ser capturado por la acción que lo llamó.
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
  }
}