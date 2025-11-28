import type { RouterConfig, VercelConfig, GenerateOptions, EnvironmentConfig } from './types.js'

/**
 * Find environment configuration by branch name
 */
export function findEnvironmentByBranch(
  environments: Record<string, EnvironmentConfig>,
  branch: string
): EnvironmentConfig | null {
  // Direct match
  for (const [, config] of Object.entries(environments)) {
    if (config.branch === branch) {
      return config
    }
  }

  // Fallback to environment name match
  if (environments[branch]) {
    return environments[branch]
  }

  return null
}

/**
 * Generate Vercel configuration based on current branch and environment
 */
export function generateVercelConfig(
  config: RouterConfig,
  options: GenerateOptions = {}
): VercelConfig {
  const branch =
    options.branch ||
    options.env?.VERCEL_GIT_COMMIT_REF ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    'unknown'

  // Find matching environment
  const environment = findEnvironmentByBranch(config.environments, branch)

  if (!environment) {
    const availableBranches = Object.values(config.environments)
      .map((env) => env.branch)
      .join(', ')
    throw new Error(
      `No environment configuration found for branch: "${branch}"\n` +
        `Available branches: ${availableBranches}`
    )
  }

  // Generate vercel.json
  const vercelConfig: VercelConfig = {}

  // Rewrites
  const rewrites = [
    // Default API rewrite
    {
      source: '/api/(.*)',
      destination: `${environment.apiUrl}/api/$1`,
    },
    // Environment-specific rewrites
    ...(environment.customRewrites || []),
    // Global rewrites
    ...(config.rewrites || []),
  ]

  if (rewrites.length > 0) {
    vercelConfig.rewrites = rewrites
  }

  // Headers
  const headers = [...(environment.customHeaders || []), ...(config.headers || [])]

  if (headers.length > 0) {
    vercelConfig.headers = headers
  }

  // Redirects
  if (config.redirects && config.redirects.length > 0) {
    vercelConfig.redirects = config.redirects
  }

  return vercelConfig
}

/**
 * Get current environment info for logging
 */
export function getEnvironmentInfo(
  config: RouterConfig,
  options: GenerateOptions = {}
): {
  branch: string
  environment: EnvironmentConfig | null
  vercelEnv: string
} {
  const branch =
    options.branch ||
    options.env?.VERCEL_GIT_COMMIT_REF ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    'unknown'

  const vercelEnv = options.env?.VERCEL_ENV || process.env.VERCEL_ENV || 'development'

  const environment = findEnvironmentByBranch(config.environments, branch)

  return {
    branch,
    environment,
    vercelEnv,
  }
}
