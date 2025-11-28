import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { access, constants } from 'node:fs/promises'
import type { RouterConfig } from '@vercel-env-router/core'

const CONFIG_FILES = [
  'vercel-env-router.config.ts',
  'vercel-env-router.config.js',
  'vercel-env-router.config.mjs',
]

export async function findConfigFile(cwd: string = process.cwd()): Promise<string | null> {
  for (const filename of CONFIG_FILES) {
    const filepath = resolve(cwd, filename)
    try {
      await access(filepath, constants.R_OK)
      return filepath
    } catch {
      // File doesn't exist, continue
    }
  }
  return null
}

export async function loadConfig(
  configPath?: string,
  cwd: string = process.cwd()
): Promise<RouterConfig> {
  let filepath: string | null = null

  if (configPath) {
    filepath = resolve(cwd, configPath)
    try {
      await access(filepath, constants.R_OK)
    } catch {
      throw new Error(`Config file not found: ${filepath}`)
    }
  } else {
    filepath = await findConfigFile(cwd)
    if (!filepath) {
      throw new Error(
        `No config file found. Run "vercel-env-router init" to create one.\n` +
          `Looked for: ${CONFIG_FILES.join(', ')}`
      )
    }
  }

  try {
    const fileUrl = pathToFileURL(filepath).href
    const module = await import(fileUrl)
    const config = module.default || module

    if (!config || typeof config !== 'object') {
      throw new Error('Config file must export a default config object')
    }

    return config as RouterConfig
  } catch (error) {
    if (error instanceof Error && error.message.includes('Config file must export')) {
      throw error
    }
    throw new Error(
      `Failed to load config from ${filepath}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
