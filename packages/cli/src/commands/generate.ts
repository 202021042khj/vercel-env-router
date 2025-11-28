import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { generateVercelConfig, getEnvironmentInfo, validate } from '@vercel-env-router/core'
import { logger } from '../utils/logger.js'
import { handleError } from '../utils/errors.js'
import { loadConfig } from '../utils/config-loader.js'

export interface GenerateOptions {
  config?: string
  output?: string
  branch?: string
  validate?: boolean
}

export async function generateCommand(options: GenerateOptions = {}): Promise<void> {
  try {
    const cwd = process.cwd()

    logger.section('Vercel Environment Router')

    // Load config
    logger.info('Loading configuration...')
    const config = await loadConfig(options.config, cwd)

    // Validate if requested
    if (options.validate !== false) {
      logger.info('Validating configuration...')
      validate(config, {
        checkBranches: true,
        checkEnvVars: false,
      })
    }

    // Get environment info
    const envInfo = getEnvironmentInfo(config, {
      branch: options.branch,
      env: process.env,
    })

    // Log environment info
    logger.section('Environment Info')
    logger.keyValue('Branch', envInfo.branch)
    logger.keyValue('Vercel Env', envInfo.vercelEnv)
    if (envInfo.environment) {
      logger.keyValue('API URL', envInfo.environment.apiUrl)
    } else {
      logger.warn(`No environment found for branch: ${envInfo.branch}`)
    }

    // Generate vercel.json
    logger.info('\nGenerating vercel.json...')
    const vercelConfig = generateVercelConfig(config, {
      branch: options.branch,
      env: process.env,
    })

    // Write to file
    const outputPath = resolve(cwd, options.output || 'vercel.json')
    await writeFile(outputPath, JSON.stringify(vercelConfig, null, 2), 'utf-8')

    logger.section('Success')
    logger.success(`Generated: ${outputPath}`)
    logger.info(`Rewrites: ${vercelConfig.rewrites?.length || 0}`)
    logger.info(`Headers: ${vercelConfig.headers?.length || 0}`)
    logger.info(`Redirects: ${vercelConfig.redirects?.length || 0}`)

    // Show sample rewrite
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      const firstRewrite = vercelConfig.rewrites[0]
      if (firstRewrite) {
        logger.section('Sample Rewrite')
        logger.keyValue('Source', firstRewrite.source)
        logger.keyValue('Destination', firstRewrite.destination)
      }
    }
  } catch (error) {
    handleError(error)
  }
}
