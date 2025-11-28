import { describe, it, expect } from 'vitest'
import {
  generateVercelConfig,
  findEnvironmentByBranch,
  getEnvironmentInfo,
} from '../src/generator.js'
import type { RouterConfig } from '../src/types.js'

const testConfig: RouterConfig = {
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
    },
    staging: {
      branch: 'staging',
      apiUrl: 'https://api.staging.example.com',
    },
    development: {
      branch: 'dev',
      apiUrl: 'http://localhost:3000',
    },
  },
}

describe('findEnvironmentByBranch', () => {
  it('should find environment by exact branch match', () => {
    const env = findEnvironmentByBranch(testConfig.environments, 'main')
    expect(env).toBeDefined()
    expect(env?.apiUrl).toBe('https://api.production.example.com')
  })

  it('should find environment by environment name', () => {
    const env = findEnvironmentByBranch(testConfig.environments, 'production')
    expect(env).toBeDefined()
    expect(env?.apiUrl).toBe('https://api.production.example.com')
  })

  it('should return null for unknown branch', () => {
    const env = findEnvironmentByBranch(testConfig.environments, 'unknown')
    expect(env).toBeNull()
  })
})

describe('generateVercelConfig', () => {
  it('should generate config for production branch', () => {
    const config = generateVercelConfig(testConfig, { branch: 'main' })

    expect(config.rewrites).toBeDefined()
    expect(config.rewrites).toHaveLength(1)
    expect(config.rewrites?.[0]).toEqual({
      source: '/api/(.*)',
      destination: 'https://api.production.example.com/api/$1',
    })
  })

  it('should generate config for staging branch', () => {
    const config = generateVercelConfig(testConfig, { branch: 'staging' })

    expect(config.rewrites?.[0]?.destination).toBe('https://api.staging.example.com/api/$1')
  })

  it('should generate config for development branch', () => {
    const config = generateVercelConfig(testConfig, { branch: 'dev' })

    expect(config.rewrites?.[0]?.destination).toBe('http://localhost:3000/api/$1')
  })

  it('should throw error for unknown branch', () => {
    expect(() => {
      generateVercelConfig(testConfig, { branch: 'unknown' })
    }).toThrow(/No environment configuration found/)
  })

  it('should include custom rewrites from environment', () => {
    const configWithCustomRewrites: RouterConfig = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.example.com',
          customRewrites: [
            {
              source: '/custom/(.*)',
              destination: 'https://custom.example.com/$1',
            },
          ],
        },
      },
    }

    const result = generateVercelConfig(configWithCustomRewrites, { branch: 'main' })

    expect(result.rewrites).toHaveLength(2)
    expect(result.rewrites?.[1]).toEqual({
      source: '/custom/(.*)',
      destination: 'https://custom.example.com/$1',
    })
  })

  it('should include global rewrites', () => {
    const configWithGlobalRewrites: RouterConfig = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.example.com',
        },
      },
      rewrites: [
        {
          source: '/global/(.*)',
          destination: '/new/$1',
        },
      ],
    }

    const result = generateVercelConfig(configWithGlobalRewrites, { branch: 'main' })

    expect(result.rewrites).toHaveLength(2)
    expect(result.rewrites?.[1]).toEqual({
      source: '/global/(.*)',
      destination: '/new/$1',
    })
  })

  it('should include headers', () => {
    const configWithHeaders: RouterConfig = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.example.com',
          customHeaders: [
            {
              source: '/api/(.*)',
              headers: [{ key: 'X-Environment', value: 'production' }],
            },
          ],
        },
      },
      headers: [
        {
          source: '/assets/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
        },
      ],
    }

    const result = generateVercelConfig(configWithHeaders, { branch: 'main' })

    expect(result.headers).toHaveLength(2)
  })

  it('should use VERCEL_GIT_COMMIT_REF from env when branch not provided', () => {
    const config = generateVercelConfig(testConfig, {
      env: { VERCEL_GIT_COMMIT_REF: 'main' },
    })

    expect(config.rewrites?.[0]?.destination).toBe('https://api.production.example.com/api/$1')
  })
})

describe('getEnvironmentInfo', () => {
  it('should return environment info for known branch', () => {
    const info = getEnvironmentInfo(testConfig, { branch: 'main' })

    expect(info.branch).toBe('main')
    expect(info.environment).toBeDefined()
    expect(info.environment?.apiUrl).toBe('https://api.production.example.com')
  })

  it('should return null environment for unknown branch', () => {
    const info = getEnvironmentInfo(testConfig, { branch: 'unknown' })

    expect(info.branch).toBe('unknown')
    expect(info.environment).toBeNull()
  })

  it('should detect vercel environment from env', () => {
    const info = getEnvironmentInfo(testConfig, {
      branch: 'main',
      env: { VERCEL_ENV: 'production' },
    })

    expect(info.vercelEnv).toBe('production')
  })
})
