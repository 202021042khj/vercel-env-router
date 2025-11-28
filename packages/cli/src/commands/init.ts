import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { logger } from '../utils/logger.js'
import { handleError } from '../utils/errors.js'
import { findConfigFile } from '../utils/config-loader.js'

const CONFIG_TEMPLATE = `import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: process.env.PROD_API_URL || 'https://api.production.example.com',
    },
    staging: {
      branch: 'staging',
      apiUrl: process.env.STAGING_API_URL || 'https://api.staging.example.com',
    },
    development: {
      branch: 'dev',
      apiUrl: process.env.DEV_API_URL || 'https://api.dev.example.com',
    },
  },
  rewrites: [
    // Add global rewrites here
  ],
  headers: [
    // Add global headers here
  ],
})
`

export interface InitOptions {
  force?: boolean
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  try {
    const cwd = process.cwd()
    const configPath = resolve(cwd, 'vercel-env-router.config.ts')

    // Check if config already exists
    const existingConfig = await findConfigFile(cwd)
    if (existingConfig && !options.force) {
      logger.warn(`Config file already exists: ${existingConfig}`)
      logger.info('Use --force to overwrite')
      return
    }

    // Write config file
    await writeFile(configPath, CONFIG_TEMPLATE, 'utf-8')

    logger.section('Configuration Created')
    logger.success(`Created config file: vercel-env-router.config.ts`)

    logger.section('Next Steps')
    logger.info('1. Update environment URLs in the config file')
    logger.info('2. Set up environment variables in Vercel:')
    logger.keyValue('   PROD_API_URL', 'Your production API URL')
    logger.keyValue('   STAGING_API_URL', 'Your staging API URL')
    logger.keyValue('   DEV_API_URL', 'Your development API URL')
    logger.info('3. Run: vercel-env-router generate')

  } catch (error) {
    handleError(error)
  }
}
