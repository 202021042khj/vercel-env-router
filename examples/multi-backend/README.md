# Multi-Backend Example

This example demonstrates advanced usage with multiple backend services per environment.

## Features

- Multiple backend services (API, Auth, CDN)
- Environment-specific headers
- Global headers for all environments
- Custom rewrites per environment

## Configuration Highlights

### Environment-Specific Backends

Each environment can route to different backend services:

```typescript
environments: {
  production: {
    branch: 'main',
    apiUrl: 'https://api.production.example.com',
    customRewrites: [
      // Route /auth/* to separate auth service
      {
        source: '/auth/(.*)',
        destination: 'https://auth.production.example.com/$1',
      },
      // Route /cdn/* to CDN
      {
        source: '/cdn/(.*)',
        destination: 'https://cdn.production.example.com/$1',
      },
    ],
  },
}
```

### Custom Headers

Add environment-specific headers:

```typescript
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
]
```

### Global Headers

Headers applied to all environments:

```typescript
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
]
```

## Generated vercel.json

For production branch:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.production.example.com/api/$1"
    },
    {
      "source": "/auth/(.*)",
      "destination": "https://auth.production.example.com/$1"
    },
    {
      "source": "/cdn/(.*)",
      "destination": "https://cdn.production.example.com/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Environment",
          "value": "production"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
