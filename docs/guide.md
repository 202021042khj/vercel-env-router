# Getting Started Guide

This guide will walk you through setting up `vercel-env-router` in your Vercel project.

## Installation

Install the CLI and core packages:

```bash
pnpm add -D @vercel-env-router/cli @vercel-env-router/core
```

## Step 1: Initialize Configuration

Run the init command to create a configuration file:

```bash
npx vercel-env-router init
```

This creates `vercel-env-router.config.ts` in your project root with default environments:

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: process.env.PROD_API_URL || 'https://api.production.example.com',
    },
    staging: {
      branch: 'staging',
      apiUrl: process.env.STAGING_API_URL || 'https://api.staging.example.com',
    },
    development: {
      branch: 'dev',
      apiUrl: process.env.DEV_API_URL || 'http://localhost:3000',
    },
  },
})
```

## Step 2: Customize Configuration

Update the configuration to match your project:

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',  // Your production branch
      apiUrl: process.env.PROD_API_URL || 'https://api.yourcompany.com',
    },
    staging: {
      branch: 'staging',  // Your staging branch
      apiUrl: process.env.STAGING_API_URL || 'https://api-staging.yourcompany.com',
    },
    development: {
      branch: 'dev',  // Your development branch
      apiUrl: process.env.DEV_API_URL || 'http://localhost:8080',
    },
  },
})
```

## Step 3: Update Build Script

Add the generate command to your build script:

```json
{
  "scripts": {
    "build": "vercel-env-router generate && vite build"
  }
}
```

For Next.js:

```json
{
  "scripts": {
    "build": "vercel-env-router generate && next build"
  }
}
```

## Step 4: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

### Production Environment (main branch)

```
Name: PROD_API_URL
Value: https://api.yourcompany.com
Environment: Production
```

### Preview Environment (staging branch)

```
Name: STAGING_API_URL
Value: https://api-staging.yourcompany.com
Environment: Preview
Branch: staging
```

### Preview Environment (dev branch)

```
Name: DEV_API_URL
Value: https://api-dev.yourcompany.com
Environment: Preview
Branch: dev
```

## Step 5: Test Locally

Generate `vercel.json` locally to verify it works:

```bash
# Test with default branch detection
npx vercel-env-router generate

# Or override branch for testing
npx vercel-env-router generate --branch main
```

Check the generated `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.yourcompany.com/api/$1"
    }
  ]
}
```

## Step 6: Deploy to Vercel

Push your code to trigger a deployment:

```bash
git add .
git commit -m "Add vercel-env-router"
git push origin main
```

## Step 7: Verify Deployment

Check the build logs in Vercel Dashboard to verify the correct environment was detected:

```
[vercel-env-router] Environment:
  Branch: main
  Vercel Env: production
  API URL: https://api.yourcompany.com

✓ Generated: vercel.json
```

## Next Steps

- [Advanced Configuration](./configuration.md)
- [API Reference](./api.md)
- [Troubleshooting](./troubleshooting.md)
