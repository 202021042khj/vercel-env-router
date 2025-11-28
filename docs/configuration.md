# Configuration Reference

Complete reference for `vercel-env-router.config.ts`.

## Basic Structure

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    /* ... */
  },
  rewrites: [
    /* ... */
  ],
  headers: [
    /* ... */
  ],
  redirects: [
    /* ... */
  ],
})
```

## `environments`

**Required.** Object defining environment-specific configurations.

```typescript
environments: {
  [environmentName: string]: {
    branch: string
    apiUrl: string
    customRewrites?: VercelRewrite[]
    customHeaders?: VercelHeader[]
  }
}
```

### `branch`

**Required.** Git branch name for this environment.

```typescript
branch: 'main'
```

### `apiUrl`

**Required.** Backend API base URL. Must be a valid URL.

```typescript
apiUrl: 'https://api.example.com'
// or with environment variable
apiUrl: process.env.API_URL
```

### `customRewrites`

Optional. Environment-specific rewrites.

```typescript
customRewrites: [
  {
    source: '/auth/(.*)',
    destination: 'https://auth.example.com/$1',
  },
]
```

### `customHeaders`

Optional. Environment-specific headers.

```typescript
customHeaders: [
  {
    source: '/api/(.*)',
    headers: [{ key: 'X-Environment', value: 'production' }],
  },
]
```

## `rewrites`

Optional. Global rewrites applied to all environments.

```typescript
rewrites: [
  {
    source: '/(.*)',
    destination: '/',
  },
]
```

## `headers`

Optional. Global headers applied to all environments.

```typescript
headers: [
  {
    source: '/assets/(.*)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
]
```

## `redirects`

Optional. Global redirects.

```typescript
redirects: [
  {
    source: '/old-path',
    destination: '/new-path',
    permanent: true,
  },
]
```

## Complete Example

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: process.env.PROD_API_URL || 'https://api.production.example.com',
      customRewrites: [
        {
          source: '/auth/(.*)',
          destination: 'https://auth.production.example.com/$1',
        },
        {
          source: '/cdn/(.*)',
          destination: 'https://cdn.production.example.com/$1',
        },
      ],
      customHeaders: [
        {
          source: '/api/(.*)',
          headers: [
            { key: 'X-Environment', value: 'production' },
            { key: 'X-API-Version', value: 'v1' },
          ],
        },
      ],
    },
    staging: {
      branch: 'staging',
      apiUrl: process.env.STAGING_API_URL || 'https://api.staging.example.com',
      customRewrites: [
        {
          source: '/auth/(.*)',
          destination: 'https://auth.staging.example.com/$1',
        },
      ],
      customHeaders: [
        {
          source: '/api/(.*)',
          headers: [{ key: 'X-Environment', value: 'staging' }],
        },
      ],
    },
    development: {
      branch: 'dev',
      apiUrl: process.env.DEV_API_URL || 'http://localhost:3000',
    },
  },
  rewrites: [
    {
      source: '/(.*)',
      destination: '/',
    },
  ],
  headers: [
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/(.*).html',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
    },
  ],
})
```

## Type Safety

The `defineConfig` helper provides full TypeScript support with auto-completion and type checking.

```typescript
// ✅ Valid
defineConfig({
  environments: {
    prod: {
      branch: 'main',
      apiUrl: 'https://api.example.com',
    },
  },
})

// ❌ Type error: invalid URL
defineConfig({
  environments: {
    prod: {
      branch: 'main',
      apiUrl: 'not-a-url', // Type error!
    },
  },
})

// ❌ Type error: missing required field
defineConfig({
  environments: {
    prod: {
      branch: 'main',
      // Missing apiUrl
    },
  },
})
```

## Environment Variables

You can reference environment variables in your configuration:

```typescript
export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: process.env.PROD_API_URL!, // From Vercel env vars
    },
  },
})
```

Make sure to set these in Vercel Dashboard → Settings → Environment Variables.
