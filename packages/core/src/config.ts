import { z } from 'zod'

/**
 * Zod schema for Vercel rewrite
 */
export const VercelRewriteSchema = z.object({
  source: z.string(),
  destination: z.string(),
})

/**
 * Zod schema for Vercel header
 */
export const VercelHeaderSchema = z.object({
  source: z.string(),
  headers: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
})

/**
 * Zod schema for Vercel redirect
 */
export const VercelRedirectSchema = z.object({
  source: z.string(),
  destination: z.string(),
  permanent: z.boolean().optional(),
  statusCode: z.number().optional(),
})

/**
 * Zod schema for environment configuration
 */
export const EnvironmentConfigSchema = z.object({
  branch: z.string().min(1, 'Branch name is required'),
  apiUrl: z.string().url('API URL must be a valid URL'),
  customRewrites: z.array(VercelRewriteSchema).optional(),
  customHeaders: z.array(VercelHeaderSchema).optional(),
})

/**
 * Zod schema for router configuration
 */
export const RouterConfigSchema = z.object({
  environments: z
    .record(z.string(), EnvironmentConfigSchema)
    .refine((envs) => Object.keys(envs).length > 0, {
      message: 'At least one environment must be defined',
    }),
  rewrites: z.array(VercelRewriteSchema).optional(),
  headers: z.array(VercelHeaderSchema).optional(),
  redirects: z.array(VercelRedirectSchema).optional(),
})

/**
 * Type-safe config definition helper
 */
export function defineConfig(config: z.input<typeof RouterConfigSchema>) {
  return RouterConfigSchema.parse(config)
}
