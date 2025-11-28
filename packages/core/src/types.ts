/**
 * Vercel rewrite configuration
 */
export interface VercelRewrite {
  source: string
  destination: string
}

/**
 * Vercel header configuration
 */
export interface VercelHeader {
  source: string
  headers: Array<{
    key: string
    value: string
  }>
}

/**
 * Vercel redirect configuration
 */
export interface VercelRedirect {
  source: string
  destination: string
  permanent?: boolean
  statusCode?: number
}

/**
 * Complete Vercel configuration
 */
export interface VercelConfig {
  rewrites?: VercelRewrite[]
  headers?: VercelHeader[]
  redirects?: VercelRedirect[]
}

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  /** Git branch name for this environment */
  branch: string
  /** Base URL for API backend */
  apiUrl: string
  /** Custom rewrites specific to this environment */
  customRewrites?: VercelRewrite[]
  /** Custom headers specific to this environment */
  customHeaders?: VercelHeader[]
}

/**
 * Router configuration for all environments
 */
export interface RouterConfig {
  /** Environment configurations keyed by environment name */
  environments: Record<string, EnvironmentConfig>
  /** Global rewrites applied to all environments */
  rewrites?: VercelRewrite[]
  /** Global headers applied to all environments */
  headers?: VercelHeader[]
  /** Global redirects applied to all environments */
  redirects?: VercelRedirect[]
}

/**
 * Options for generating vercel.json
 */
export interface GenerateOptions {
  /** Current git branch */
  branch?: string
  /** Environment variables */
  env?: Record<string, string | undefined>
}
