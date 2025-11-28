# Contributing to vercel-env-router

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:
```bash
pnpm install
pnpm build
pnpm test
```

## Code Style

We use:
- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for formatting

Run before committing:
```bash
pnpm lint:fix
pnpm format
pnpm typecheck
```

## Testing

### Writing Tests

- Place tests in `tests/` directory next to source code
- Use descriptive test names
- Aim for 80%+ code coverage

Example:
```typescript
import { describe, it, expect } from 'vitest'
import { generateVercelConfig } from '../src/generator'

describe('generateVercelConfig', () => {
  it('should generate config for production branch', () => {
    const config = generateVercelConfig(/* ... */)
    expect(config.rewrites).toBeDefined()
  })
})
```

### Running Tests

```bash
# All tests
pnpm test

# With coverage
pnpm test:coverage

# Watch mode
pnpm test --watch

# Specific file
pnpm test generator.test.ts
```

## Pull Request Process

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/vercel-env-router.git
   cd vercel-env-router
   ```

2. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

4. **Verify**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `test:` Tests
   - `refactor:` Code refactoring
   - `chore:` Maintenance

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure

### Core Package (`packages/core`)

The core library containing:
- Type definitions
- Configuration validation (Zod schemas)
- vercel.json generation logic

### CLI Package (`packages/cli`)

Command-line interface:
- `init` - Create config file
- `generate` - Generate vercel.json
- `validate` - Validate config

### Vite Plugin (`packages/vite-plugin`)

Vite integration for automatic generation.

## Adding New Features

1. **Plan First**
   - Open an issue to discuss the feature
   - Get feedback from maintainers

2. **Implement**
   - Add to core package if it's core logic
   - Add to CLI if it's a new command
   - Add to Vite plugin if it's Vite-specific

3. **Document**
   - Update README.md
   - Update docs/api.md
   - Add example if applicable

4. **Test**
   - Add unit tests
   - Add integration tests
   - Update existing tests if needed

## Documentation

- **README.md** - Project overview and quick start
- **docs/guide.md** - Getting started guide
- **docs/api.md** - API reference
- **docs/configuration.md** - Configuration options
- **docs/troubleshooting.md** - Common issues

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage

## Code Review

PRs require:
- ✅ All tests passing
- ✅ No linting errors
- ✅ Type checking passes
- ✅ Code coverage maintained
- ✅ Documentation updated

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
