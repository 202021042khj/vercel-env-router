# Basic Example

This example demonstrates the basic usage of `vercel-env-router`.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Generate `vercel.json`:
```bash
pnpm vercel-env-router generate
```

3. Run development server:
```bash
pnpm dev
```

## How It Works

### Configuration

The `vercel-env-router.config.ts` file defines three environments:

- **production**: Uses `main` branch → Production API
- **staging**: Uses `staging` branch → Staging API
- **development**: Uses `dev` branch → Local API (localhost:3000)

### Automatic Generation

#### Option 1: CLI (Recommended for Vercel)

Add to `package.json` build script:

```json
{
  "scripts": {
    "build": "vercel-env-router generate && vite build"
  }
}
```

#### Option 2: Vite Plugin (For Development)

The Vite plugin automatically generates `vercel.json` during development:

```ts
// vite.config.ts
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default {
  plugins: [vercelEnvRouter()]
}
```

## Deployment

### Vercel Setup

1. Set environment variables in Vercel Dashboard:

```bash
# Production (main branch)
PROD_API_URL=https://api.production.example.com

# Staging (staging branch)
STAGING_API_URL=https://api.staging.example.com

# Development (dev branch)
DEV_API_URL=https://api.dev.example.com
```

2. Deploy:

```bash
vercel --prod  # For production
vercel         # For preview
```

The build script will automatically generate the correct `vercel.json` based on the current branch.

## Generated vercel.json

### For `main` branch (Production):

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.production.example.com/api/$1"
    }
  ]
}
```

### For `dev` branch (Development):

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "http://localhost:3000/api/$1"
    }
  ]
}
```
