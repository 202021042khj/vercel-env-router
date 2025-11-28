import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { generateCommand } from './commands/generate.js'
import { validateCommand } from './commands/validate.js'

const program = new Command()

program
  .name('vercel-env-router')
  .description('Generate branch-specific vercel.json configurations')
  .version('0.1.0')

program
  .command('init')
  .description('Create a new configuration file')
  .option('-f, --force', 'Overwrite existing config file')
  .action(initCommand)

program
  .command('generate')
  .description('Generate vercel.json from config')
  .option('-c, --config <path>', 'Path to config file')
  .option('-o, --output <path>', 'Output path for vercel.json', 'vercel.json')
  .option('-b, --branch <name>', 'Override branch name')
  .option('--no-validate', 'Skip validation')
  .action(generateCommand)

program
  .command('validate')
  .description('Validate configuration file')
  .option('-c, --config <path>', 'Path to config file')
  .option('--no-check-branches', 'Skip branch uniqueness check')
  .option('--check-env-vars', 'Check environment variable availability')
  .action(validateCommand)

program.parse()
