# Troubleshooting

Common issues and solutions.

## Configuration Errors

### "No environment configuration found for branch"

**Error:**
```
✖ No environment configuration found for branch: "feature/new-feature"
   Available branches: main, staging, dev
```

**Cause:** The current branch doesn't match any configured environment.

**Solution:**

1. Add a new environment for this branch:
```typescript
environments: {
  feature: {
    branch: 'feature/new-feature',
    apiUrl: 'https://api.dev.example.com',
  },
}
```

2. Or use a development environment for all feature branches by checking branch in apiUrl:
```typescript
development: {
  branch: 'dev',
  apiUrl: process.env.DEV_API_URL || 'https://api.dev.example.com',
}
```

Then set `DEV_API_URL` for all preview deployments.

### "Configuration validation failed"

**Error:**
```
✖ Configuration validation failed:
  - environments.production.apiUrl: Expected URL
```

**Cause:** Invalid URL format in configuration.

**Solution:** Ensure all `apiUrl` values are valid URLs:
```typescript
// ❌ Wrong
apiUrl: 'localhost:3000'

// ✅ Correct
apiUrl: 'http://localhost:3000'
```

### "Duplicate branches found"

**Error:**
```
✖ Duplicate branches found across environments:
  - Branch "main" used in: production, duplicate
```

**Cause:** Same branch used in multiple environments.

**Solution:** Each branch should map to only one environment:
```typescript
// ❌ Wrong
environments: {
  production: { branch: 'main', apiUrl: '...' },
  prod2: { branch: 'main', apiUrl: '...' },  // Duplicate!
}

// ✅ Correct
environments: {
  production: { branch: 'main', apiUrl: '...' },
  staging: { branch: 'staging', apiUrl: '...' },
}
```

## Build Errors

### "Config file not found"

**Error:**
```
✖ No config file found. Run "vercel-env-router init" to create one.
```

**Cause:** Missing configuration file.

**Solution:**
```bash
npx vercel-env-router init
```

### "Failed to load config"

**Error:**
```
✖ Failed to load config from vercel-env-router.config.ts
```

**Cause:** Syntax error or invalid export in config file.

**Solution:**

1. Ensure config file exports default:
```typescript
// ❌ Wrong
export const config = defineConfig({ ... })

// ✅ Correct
export default defineConfig({ ... })
```

2. Check for TypeScript syntax errors

## Vercel Deployment Issues

### API requests return 404

**Cause:** vercel.json not generated or incorrect rewrites.

**Solution:**

1. Check build logs for generation message:
```
[vercel-env-router] Generated: vercel.json
```

2. Verify rewrites in generated vercel.json:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.example.com/api/$1"
    }
  ]
}
```

3. Ensure your API calls use `/api/*` path:
```typescript
// ✅ Correct
fetch('/api/users')

// ❌ Wrong (bypasses rewrite)
fetch('https://api.example.com/api/users')
```

### Environment variables not working

**Cause:** Environment variables not set in Vercel.

**Solution:**

1. Go to Vercel Dashboard → Settings → Environment Variables

2. Set variables for each environment:
```
PROD_API_URL=https://api.prod.example.com (Production)
STAGING_API_URL=https://api.staging.example.com (Preview, Branch: staging)
DEV_API_URL=https://api.dev.example.com (Preview, Branch: dev)
```

3. Redeploy after setting variables

### Wrong API URL used

**Cause:** Environment variable fallback being used instead of Vercel env var.

**Solution:**

1. Check build logs:
```
[vercel-env-router] Environment:
  Branch: main
  API URL: https://api.example.com  ← Check this
```

2. Ensure env var is set in Vercel for the correct environment/branch

## Development Issues

### Vite plugin not working

**Cause:** Plugin not registered or wrong order.

**Solution:**

1. Ensure plugin is in plugins array:
```typescript
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default {
  plugins: [
    vercelEnvRouter(),  // Add this
    react(),
  ],
}
```

2. Enable verbose logging:
```typescript
vercelEnvRouter({ verbose: true })
```

### TypeScript errors in config file

**Cause:** Missing types or incorrect configuration.

**Solution:**

1. Import `defineConfig`:
```typescript
import { defineConfig } from '@vercel-env-router/core'
```

2. Use defineConfig wrapper:
```typescript
export default defineConfig({
  // Auto-completion works here
})
```

## Getting Help

If you're still experiencing issues:

1. Enable debug mode:
```bash
DEBUG=1 vercel-env-router generate
```

2. Check generated `vercel.json` manually

3. [Open an issue](https://github.com/yourusername/vercel-env-router/issues) with:
   - Configuration file
   - Build logs
   - Expected vs actual behavior
