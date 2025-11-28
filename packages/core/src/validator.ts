import { RouterConfigSchema } from './config.js'
import type { RouterConfig } from './types.js'

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ path: string; message: string }>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validate router configuration
 */
export function validateConfig(config: unknown): RouterConfig {
  try {
    return RouterConfigSchema.parse(config)
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> }
      const errors = zodError.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))

      throw new ValidationError(
        'Configuration validation failed:\n' +
          errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n'),
        errors
      )
    }
    throw error
  }
}

/**
 * Check for duplicate branches across environments
 */
export function validateUniqueBranches(config: RouterConfig): void {
  const branchMap = new Map<string, string[]>()

  for (const [envName, envConfig] of Object.entries(config.environments)) {
    const existing = branchMap.get(envConfig.branch) || []
    existing.push(envName)
    branchMap.set(envConfig.branch, existing)
  }

  const duplicates = Array.from(branchMap.entries())
    .filter(([, envs]) => envs.length > 1)

  if (duplicates.length > 0) {
    const duplicateMessages = duplicates
      .map(([branch, envs]) => `  - Branch "${branch}" used in: ${envs.join(', ')}`)
      .join('\n')

    throw new ValidationError(
      'Duplicate branches found across environments:\n' + duplicateMessages,
      duplicates.map(([branch, envs]) => ({
        path: `environments.${envs[0]}.branch`,
        message: `Branch "${branch}" is used in multiple environments`,
      }))
    )
  }
}

/**
 * Validate environment variable availability
 */
export function validateEnvironmentVariables(
  config: RouterConfig,
  env: Record<string, string | undefined> = process.env
): void {
  const errors: Array<{ path: string; message: string }> = []

  for (const [envName, envConfig] of Object.entries(config.environments)) {
    // Check if apiUrl contains environment variables
    const envVarPattern = /\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)/g
    const matches = envConfig.apiUrl.matchAll(envVarPattern)

    for (const match of matches) {
      const varName = match[1] || match[2]
      if (varName && !env[varName]) {
        errors.push({
          path: `environments.${envName}.apiUrl`,
          message: `Environment variable "${varName}" is not defined`,
        })
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(
      'Missing required environment variables:\n' +
        errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n'),
      errors
    )
  }
}

/**
 * Comprehensive validation
 */
export function validate(
  config: unknown,
  options: {
    checkBranches?: boolean
    checkEnvVars?: boolean
    env?: Record<string, string | undefined>
  } = {}
): RouterConfig {
  const {
    checkBranches = true,
    checkEnvVars = false,
    env = process.env,
  } = options

  // Schema validation
  const validatedConfig = validateConfig(config)

  // Branch uniqueness check
  if (checkBranches) {
    validateUniqueBranches(validatedConfig)
  }

  // Environment variables check
  if (checkEnvVars) {
    validateEnvironmentVariables(validatedConfig, env)
  }

  return validatedConfig
}
