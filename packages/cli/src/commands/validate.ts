import { validate } from '@vercel-env-router/core'
import { logger } from '../utils/logger.js'
import { handleError } from '../utils/errors.js'
import { loadConfig } from '../utils/config-loader.js'

export interface ValidateOptions {
  config?: string
  checkBranches?: boolean
  checkEnvVars?: boolean
}

export async function validateCommand(options: ValidateOptions = {}): Promise<void> {
  try {
    const cwd = process.cwd()

    logger.section('Validating Configuration')

    // Load config
    logger.info('Loading configuration...')
    const config = await loadConfig(options.config, cwd)

    // Validate
    logger.info('Running validation checks...')
    validate(config, {
      checkBranches: options.checkBranches !== false,
      checkEnvVars: options.checkEnvVars || false,
      env: process.env,
    })

    // Show summary
    logger.section('Validation Summary')
    const envCount = Object.keys(config.environments).length
    logger.success(`${envCount} environment(s) configured`)

    for (const [name, env] of Object.entries(config.environments)) {
      logger.keyValue(`  ${name}`, `${env.branch} → ${env.apiUrl}`)
    }

    logger.success('\nAll checks passed!')

  } catch (error) {
    handleError(error)
  }
}
