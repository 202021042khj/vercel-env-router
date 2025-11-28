import { describe, it, expect } from 'vitest'
import { validateConfig, validateUniqueBranches, ValidationError } from '../src/validator.js'
import type { RouterConfig } from '../src/types.js'

describe('validateConfig', () => {
  it('should validate correct config', () => {
    const config = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.example.com',
        },
      },
    }

    expect(() => validateConfig(config)).not.toThrow()
  })

  it('should throw ValidationError for missing environments', () => {
    const config = {
      environments: {},
    }

    expect(() => validateConfig(config)).toThrow(ValidationError)
  })

  it('should throw ValidationError for invalid URL', () => {
    const config = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'not-a-url',
        },
      },
    }

    expect(() => validateConfig(config)).toThrow(ValidationError)
  })

  it('should throw ValidationError for empty branch name', () => {
    const config = {
      environments: {
        production: {
          branch: '',
          apiUrl: 'https://api.example.com',
        },
      },
    }

    expect(() => validateConfig(config)).toThrow(ValidationError)
  })
})

describe('validateUniqueBranches', () => {
  it('should pass for unique branches', () => {
    const config: RouterConfig = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.production.example.com',
        },
        staging: {
          branch: 'staging',
          apiUrl: 'https://api.staging.example.com',
        },
      },
    }

    expect(() => validateUniqueBranches(config)).not.toThrow()
  })

  it('should throw ValidationError for duplicate branches', () => {
    const config: RouterConfig = {
      environments: {
        production: {
          branch: 'main',
          apiUrl: 'https://api.production.example.com',
        },
        duplicate: {
          branch: 'main',
          apiUrl: 'https://api.duplicate.example.com',
        },
      },
    }

    expect(() => validateUniqueBranches(config)).toThrow(ValidationError)
  })
})
