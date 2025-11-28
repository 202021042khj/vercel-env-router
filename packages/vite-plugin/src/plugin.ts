import { writeFile, access, constants } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Plugin } from 'vite'
import {
  generateVercelConfig,
  getEnvironmentInfo,
  type RouterConfig,
} from '@vercel-env-router/core'

export interface VercelEnvRouterOptions {
  /**
   * Path to config file
   * @default 'vercel-env-router.config.ts'
   */
  configPath?: string

  /**
   * Output path for vercel.json
   * @default 'vercel.json'
   */
  outputPath?: string

  /**
   * Override branch name
   */
  branch?: string

  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean
}

const CONFIG_FILES = [
  'vercel-env-router.config.ts',
  'vercel-env-router.config.js',
  'vercel-env-router.config.mjs',
]

async function findConfigFile(cwd: string): Promise<string | null> {
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

async function loadConfig(configPath: string): Promise<RouterConfig> {
  try {
    const fileUrl = pathToFileURL(configPath).href
    const module = await import(fileUrl)
    return module.default || module
  } catch (error) {
    throw new Error(
      `Failed to load config from ${configPath}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export function vercelEnvRouter(options: VercelEnvRouterOptions = {}): Plugin {
  const {
    configPath: userConfigPath,
    outputPath = 'vercel.json',
    branch,
    verbose = false,
  } = options

  let root: string

  return {
    name: 'vercel-env-router',

    configResolved(config) {
      root = config.root
    },

    async buildStart() {
      try {
        // Find config file
        let configPath = userConfigPath
        if (!configPath) {
          const found = await findConfigFile(root)
          if (!found) {
            if (verbose) {
              console.warn('[vercel-env-router] No config file found, skipping')
            }
            return
          }
          configPath = found
        } else {
          configPath = resolve(root, configPath)
        }

        // Load config
        const config = await loadConfig(configPath)

        // Get environment info
        const envInfo = getEnvironmentInfo(config, {
          branch,
          env: process.env,
        })

        if (verbose) {
          console.log('[vercel-env-router] Environment:', {
            branch: envInfo.branch,
            vercelEnv: envInfo.vercelEnv,
            apiUrl: envInfo.environment?.apiUrl,
          })
        }

        // Generate vercel.json
        const vercelConfig = generateVercelConfig(config, {
          branch,
          env: process.env,
        })

        // Write to file
        const output = resolve(root, outputPath)
        await writeFile(output, JSON.stringify(vercelConfig, null, 2), 'utf-8')

        if (verbose) {
          console.log(`[vercel-env-router] Generated: ${outputPath}`)
        }
      } catch (error) {
        console.error('[vercel-env-router] Error:', error)
        throw error
      }
    },
  }
}
