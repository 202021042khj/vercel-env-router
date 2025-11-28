import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
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
            {
              key: 'X-Environment',
              value: 'production',
            },
          ],
        },
      ],
    },
    staging: {
      branch: 'staging',
      apiUrl: 'https://api.staging.example.com',
      customRewrites: [
        {
          source: '/auth/(.*)',
          destination: 'https://auth.staging.example.com/$1',
        },
        {
          source: '/cdn/(.*)',
          destination: 'https://cdn.staging.example.com/$1',
        },
      ],
      customHeaders: [
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'X-Environment',
              value: 'staging',
            },
          ],
        },
      ],
    },
  },
  headers: [
    {
      source: '/assets/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
})
