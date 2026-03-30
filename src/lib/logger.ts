import * as Sentry from '@sentry/nextjs'

/**
 * Logger utility for conditional logging
 * Only logs in development environment
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
}

/**
 * Always log errors (production too) and send to Sentry
 */
export const logError = (error: unknown, context?: string) => {
  const errorMessage = error instanceof Error ? error.message : String(error)

  if (isDevelopment) {
    console.error(`[${context || 'Error'}]:`, error)
  } else {
    // In production, log sanitized errors
    console.error(`[${context || 'Error'}]:`, errorMessage)
  }

  // Always send to Sentry regardless of environment (or you can filter here)
  Sentry.captureException(error, {
    extra: { context },
  })
}
