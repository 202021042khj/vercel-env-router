# Migration Guide

This guide shows how to migrate from manual `vercel.json` management to `vercel-env-router`.

## Before: Manual Configuration

### Old Approach

You had to manually create and maintain `vercel.json` for each environment, often using build scripts.

#### Before: `scripts/generate-vercel-config.cjs`

```javascript
const fs = require('fs')
const path = require('path')

const backendUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000'
const branch = process.env.VERCEL_GIT_COMMIT_REF || 'dev'

console.log(`Generating vercel.json for branch: ${branch}`)

const vercelConfig = {
  rewrites: [
    {
      source: '/api/(.*)',
      destination: `${backendUrl}/api/$1`,
    },
  ],
}

fs.writeFileSync(path.join(__dirname, '..', 'vercel.json'), JSON.stringify(vercelConfig, null, 2))
```

#### Before: `package.json`

```json
{
  "scripts": {
    "build": "node scripts/generate-vercel-config.cjs && vite build"
  }
}
```

### Problems with Manual Approach

1. **No Type Safety**: Easy to make typos in URLs or config structure
2. **No Validation**: Errors only discovered at runtime
3. **Not Reusable**: Copy-paste same script across projects
4. **Hard to Maintain**: Changes require editing build scripts

## After: Using vercel-env-router

### Step 1: Install

```bash
pnpm add -D @vercel-env-router/cli @vercel-env-router/core
```

### Step 2: Create Config File

```bash
npx vercel-env-router init
```

This creates `vercel-env-router.config.ts`:

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

### Step 3: Update Build Script

Replace custom script with CLI:

```json
{
  "scripts": {
    "build": "vercel-env-router generate && vite build"
  }
}
```

### Step 4: Delete Old Files

```bash
rm scripts/generate-vercel-config.cjs
```

## Benefits After Migration

### ✅ Type Safety

TypeScript auto-completion and type checking:

```typescript
defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'invalid-url', // ❌ Type error!
    },
  },
})
```

### ✅ Runtime Validation

Zod validates configuration at runtime:

```bash
$ vercel-env-router validate

✖ Configuration validation failed:
  - environments.production.apiUrl: Expected URL
```

### ✅ Better Error Messages

```bash
$ vercel-env-router generate

✖ No environment configuration found for branch: "feature/new-feature"
   Available branches: main, staging, dev
```

### ✅ Reusable Across Projects

Install once, use everywhere. No copy-pasting build scripts.

### ✅ Easier Maintenance

Update configuration in one place, not scattered across build scripts.

## Migration Checklist

- [ ] Install `@vercel-env-router/cli` and `@vercel-env-router/core`
- [ ] Run `vercel-env-router init` to create config file
- [ ] Migrate environment-specific settings to config file
- [ ] Update `package.json` build script
- [ ] Test locally with different branch names
- [ ] Deploy to Vercel and verify
- [ ] Delete old build scripts
- [ ] Update documentation

## Comparison

| Feature        | Manual Script  | vercel-env-router |
| -------------- | -------------- | ----------------- |
| Type Safety    | ❌ No          | ✅ TypeScript     |
| Validation     | ❌ No          | ✅ Zod Runtime    |
| Error Messages | ❌ Poor        | ✅ Descriptive    |
| Reusability    | ❌ Copy-paste  | ✅ NPM Package    |
| Testing        | ❌ Hard        | ✅ Easy           |
| Maintenance    | ❌ Per-project | ✅ Centralized    |

## Real-World Example

This is based on the actual migration of the DAYBEAU-ADMIN-FE project, which used a similar manual approach and successfully migrated to `vercel-env-router`.
