# API Reference

Complete API reference for `@vercel-env-router` packages.

## @vercel-env-router/core

### `defineConfig(config)`

Type-safe configuration helper.

```typescript
import { defineConfig } from '@vercel-env-router/core'

const config = defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.example.com',
    },
  },
})
```

**Parameters:**
- `config: RouterConfig` - Configuration object

**Returns:** `RouterConfig` - Validated configuration

### `generateVercelConfig(config, options)`

Generate Vercel configuration for current environment.

```typescript
import { generateVercelConfig } from '@vercel-env-router/core'

const vercelConfig = generateVercelConfig(config, {
  branch: 'main',
  env: process.env,
})
```

**Parameters:**
- `config: RouterConfig` - Router configuration
- `options: GenerateOptions` - Generation options
  - `branch?: string` - Override branch name
  - `env?: Record<string, string>` - Environment variables

**Returns:** `VercelConfig` - Generated Vercel configuration

**Throws:** `Error` if no matching environment found

### `validate(config, options)`

Validate configuration with runtime checks.

```typescript
import { validate } from '@vercel-env-router/core'

const validConfig = validate(config, {
  checkBranches: true,
  checkEnvVars: false,
})
```

**Parameters:**
- `config: unknown` - Configuration to validate
- `options` - Validation options
  - `checkBranches?: boolean` - Check branch uniqueness (default: true)
  - `checkEnvVars?: boolean` - Check environment variables (default: false)
  - `env?: Record<string, string>` - Environment variables to check

**Returns:** `RouterConfig` - Validated configuration

**Throws:** `ValidationError` if validation fails

### Types

#### `RouterConfig`

```typescript
interface RouterConfig {
  environments: Record<string, EnvironmentConfig>
  rewrites?: VercelRewrite[]
  headers?: VercelHeader[]
  redirects?: VercelRedirect[]
}
```

#### `EnvironmentConfig`

```typescript
interface EnvironmentConfig {
  branch: string
  apiUrl: string
  customRewrites?: VercelRewrite[]
  customHeaders?: VercelHeader[]
}
```

#### `VercelConfig`

```typescript
interface VercelConfig {
  rewrites?: VercelRewrite[]
  headers?: VercelHeader[]
  redirects?: VercelRedirect[]
}
```

## @vercel-env-router/cli

### Commands

#### `init`

Create configuration file.

```bash
vercel-env-router init [options]
```

**Options:**
- `-f, --force` - Overwrite existing file

#### `generate`

Generate vercel.json.

```bash
vercel-env-router generate [options]
```

**Options:**
- `-c, --config <path>` - Config file path
- `-o, --output <path>` - Output path (default: vercel.json)
- `-b, --branch <name>` - Override branch
- `--no-validate` - Skip validation

#### `validate`

Validate configuration.

```bash
vercel-env-router validate [options]
```

**Options:**
- `-c, --config <path>` - Config file path
- `--no-check-branches` - Skip branch uniqueness check
- `--check-env-vars` - Check environment variables

## @vercel-env-router/vite

### `vercelEnvRouter(options)`

Vite plugin for automatic generation.

```typescript
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default {
  plugins: [
    vercelEnvRouter({
      configPath: './vercel-env-router.config.ts',
      outputPath: 'vercel.json',
      verbose: true,
    }),
  ],
}
```

**Options:**
- `configPath?: string` - Config file path (default: auto-detect)
- `outputPath?: string` - Output path (default: 'vercel.json')
- `branch?: string` - Override branch name
- `verbose?: boolean` - Enable verbose logging (default: false)

**Returns:** Vite `Plugin`
