# Vercel Environment Router

Automatic branch-specific `vercel.json` generation for Vercel deployments.

## Problem

When deploying to Vercel with multiple environments (production, staging, development), you need different backend API URLs for each branch. Manually managing `vercel.json` or writing custom build scripts for each project is tedious and error-prone.

## Solution

`vercel-env-router` automatically generates `vercel.json` based on the current git branch, using type-safe configuration with runtime validation.

## Features

- ✅ **Type-Safe Configuration**: TypeScript + Zod validation
- ✅ **Branch-Based Routing**: Automatic environment detection
- ✅ **CLI Tool**: Simple commands for any project
- ✅ **Vite Plugin**: Automatic generation during development
- ✅ **Zero Config**: Sensible defaults with customization options
- ✅ **Monorepo Support**: pnpm workspace compatible
- ✅ **Full Test Coverage**: Comprehensive test suite

## Quick Start

### Installation

```bash
pnpm add -D @vercel-env-router/cli @vercel-env-router/core
```

### Initialize

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

### Add to Build Script

```json
{
  "scripts": {
    "build": "vercel-env-router generate && vite build"
  }
}
```

### Deploy

```bash
# Set environment variables in Vercel Dashboard
PROD_API_URL=https://api.production.example.com
STAGING_API_URL=https://api.staging.example.com
DEV_API_URL=https://api.dev.example.com

# Deploy
vercel --prod
```

## How It Works

1. **Configuration**: Define environments and their backend URLs in `vercel-env-router.config.ts`
2. **Detection**: The tool detects the current branch from `VERCEL_GIT_COMMIT_REF` environment variable
3. **Generation**: Automatically generates `vercel.json` with correct rewrites for the current environment
4. **Deployment**: Vercel uses the generated `vercel.json` to proxy API requests

## Architecture

```
Browser (HTTPS) → https://your-app.vercel.app/api/users
                 ↓
        Vercel Edge Network (vercel.json rewrite)
                 ↓
      Backend (HTTP/HTTPS) → https://api.production.example.com/api/users
```

## Packages

- [`@vercel-env-router/core`](./packages/core) - Core library with type definitions and logic
- [`@vercel-env-router/cli`](./packages/cli) - Command-line interface
- [`@vercel-env-router/vite`](./packages/vite) - Vite plugin for automatic generation

## Examples

- [Basic Usage](./examples/basic) - Simple setup with three environments
- [Multi-Backend](./examples/multi-backend) - Advanced usage with multiple backend services
- [Migration Guide](./examples/migration) - Migrate from manual scripts

## CLI Commands

### `init`

Create a new configuration file:

```bash
vercel-env-router init
```

### `generate`

Generate `vercel.json` from configuration:

```bash
vercel-env-router generate
```

Options:
- `-c, --config <path>` - Path to config file
- `-o, --output <path>` - Output path for vercel.json
- `-b, --branch <name>` - Override branch name
- `--no-validate` - Skip validation

### `validate`

Validate configuration file:

```bash
vercel-env-router validate
```

Options:
- `-c, --config <path>` - Path to config file
- `--check-env-vars` - Check environment variable availability

## Vite Plugin

For automatic generation during development:

```typescript
// vite.config.ts
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default {
  plugins: [
    vercelEnvRouter({
      verbose: true,
    }),
  ],
}
```

## Configuration

### Basic Configuration

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
    },
  },
})
```

### Advanced Configuration

```typescript
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: {
      branch: 'main',
      apiUrl: 'https://api.production.example.com',
      // Environment-specific rewrites
      customRewrites: [
        {
          source: '/auth/(.*)',
          destination: 'https://auth.production.example.com/$1',
        },
      ],
      // Environment-specific headers
      customHeaders: [
        {
          source: '/api/(.*)',
          headers: [{ key: 'X-Environment', value: 'production' }],
        },
      ],
    },
  },
  // Global rewrites for all environments
  rewrites: [
    {
      source: '/(.*)',
      destination: '/',
    },
  ],
  // Global headers for all environments
  headers: [
    {
      source: '/assets/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
})
```

## Documentation

- [Getting Started Guide](./docs/guide.md)
- [API Reference](./docs/api.md)
- [Configuration Options](./docs/configuration.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/vercel-env-router.git
cd vercel-env-router

# Install dependencies
pnpm install

# Build packages
pnpm build

# Run tests
pnpm test
```

### Project Structure

```
vercel-env-router/
├── packages/
│   ├── core/              # Core library
│   ├── cli/               # CLI tool
│   └── vite-plugin/       # Vite plugin
├── examples/              # Example projects
├── docs/                  # Documentation
└── tests/                 # Integration tests
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Why vercel-env-router?

### Before

```javascript
// Manual script in each project
const fs = require('fs')
const backendUrl = process.env.API_URL || 'http://localhost:3000'
const config = {
  rewrites: [{ source: '/api/(.*)', destination: `${backendUrl}/api/$1` }],
}
fs.writeFileSync('vercel.json', JSON.stringify(config))
```

Problems:
- ❌ No type safety
- ❌ No validation
- ❌ Copy-paste across projects
- ❌ Hard to maintain

### After

```typescript
// Reusable, type-safe configuration
import { defineConfig } from '@vercel-env-router/core'

export default defineConfig({
  environments: {
    production: { branch: 'main', apiUrl: process.env.PROD_API_URL },
  },
})
```

Benefits:
- ✅ Full TypeScript support
- ✅ Runtime validation with Zod
- ✅ Reusable NPM package
- ✅ Easy to maintain

## Real-World Usage

This library was extracted from a real production project (DAYBEAU-ADMIN-FE) that needed branch-specific environment management for Vercel deployments.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) first.

## License

MIT © [Your Name]

## Development & Contributing

### Branch Strategy

This project follows the **GitHub Flow** branching model:

- `main`: Production-ready code, always deployable
- `feature/*`, `fix/*`, `chore/*`: Short-lived branches for specific changes

**Workflow**:
1. Create a feature branch from `main`
2. Make changes and commit
3. Create a changeset: `pnpm changeset`
4. Push and create a Pull Request
5. After PR is merged, Changesets Action creates a "Version Packages" PR
6. Merge the Version PR to automatically publish to npm

### Creating a Changeset

When making changes that should be released:

```bash
pnpm changeset
```

Select the packages that changed, the bump type (major/minor/patch), and write a summary.

### Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for automated versioning and publishing:

1. **Develop**: Create a feature branch and make changes
2. **Changeset**: Run `pnpm changeset` to document your changes
3. **PR**: Create a Pull Request to `main`
4. **Auto-version**: When PR is merged, Changesets creates/updates a "Version Packages" PR
5. **Publish**: Merge the Version PR to automatically publish to npm

### Local Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm format
```

## Links

- [Documentation](./docs/guide.md)
- [Examples](./examples)
- [Issues](https://github.com/202021042khj/vercel-env-router/issues)
- [Changelog](./CHANGELOG.md)
