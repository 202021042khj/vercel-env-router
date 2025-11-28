import { ValidationError } from '@vercel-env-router/core'
import { logger } from './logger.js'

export function handleError(error: unknown): never {
  if (error instanceof ValidationError) {
    logger.error('Configuration validation failed:')
    for (const err of error.errors) {
      console.error(`  • ${err.path}: ${err.message}`)
    }
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    if (error.stack && process.env.DEBUG) {
      console.error('\n' + error.stack)
    }
    process.exit(1)
  }

  logger.error('An unknown error occurred')
  console.error(error)
  process.exit(1)
}
