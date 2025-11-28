# Setup Guide for Development

This guide helps you set up the project for local development.

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Installation

### 1. Enable pnpm

```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

If you encounter permission issues, install pnpm globally:

```bash
npm install -g pnpm@8.15.0
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build All Packages

```bash
pnpm build
```

This will build:

- `@vercel-env-router/core`
- `@vercel-env-router/cli`
- `@vercel-env-router/vite`

### 4. Run Tests

```bash
pnpm test
```

With coverage:

```bash
pnpm test:coverage
```

### 5. Lint and Format

```bash
# Lint
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Development Workflow

### Working on Core Package

```bash
cd packages/core

# Watch mode
pnpm dev

# Run tests
pnpm test
```

### Working on CLI

```bash
cd packages/cli

# Build
pnpm build

# Test locally
node dist/index.js init
```

### Working on Vite Plugin

```bash
cd packages/vite-plugin

# Watch mode
pnpm dev
```

### Testing in Examples

```bash
cd examples/basic

# Install dependencies (links to local packages)
pnpm install

# Test CLI
pnpm vercel-env-router generate

# Test Vite plugin
pnpm dev
```

## Project Structure

```
vercel-env-router/
├── packages/
│   ├── core/              # Core library
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── cli/               # CLI tool
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── vite-plugin/       # Vite plugin
│       ├── src/
│       ├── tests/
│       └── package.json
├── examples/              # Example projects
│   ├── basic/
│   ├── multi-backend/
│   └── migration/
├── docs/                  # Documentation
│   ├── guide.md
│   ├── api.md
│   ├── configuration.md
│   └── troubleshooting.md
└── .github/
    └── workflows/
        └── ci.yml         # GitHub Actions CI
```

## Common Tasks

### Add New Dependency

For core package:

```bash
cd packages/core
pnpm add zod
```

For dev dependency:

```bash
pnpm add -D vitest
```

### Create New Test

```bash
# Create test file
touch packages/core/tests/new-feature.test.ts

# Run specific test
pnpm test new-feature
```

### Update Documentation

Edit files in `docs/` directory and verify in examples.

## Troubleshooting

### pnpm not found

```bash
# Re-enable corepack
corepack enable

# Or install globally
npm install -g pnpm@8.15.0
```

### Build errors

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Test failures

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Run specific test file
pnpm test generator.test.ts
```

## Next Steps

After setup:

1. Read [Contributing Guidelines](./CONTRIBUTING.md)
2. Check [Examples](./examples)
3. Review [API Documentation](./docs/api.md)
4. Run tests to ensure everything works
