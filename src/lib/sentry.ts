'use client'

import * as Sentry from '@sentry/nextjs'

// Inicialización manual definitiva (URL directa para evitar fallos de Next.js)
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: "https://466357e38250d09e3a4a063453b9b91b@o4511130248675328.ingest.us.sentry.io/4511130426081280",
    tracesSampleRate: 1.0,
    debug: false,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
