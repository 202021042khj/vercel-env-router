import pc from 'picocolors'

export const logger = {
  info(message: string): void {
    console.log(pc.blue('ℹ'), message)
  },

  success(message: string): void {
    console.log(pc.green('✓'), message)
  },

  warn(message: string): void {
    console.log(pc.yellow('⚠'), message)
  },

  error(message: string): void {
    console.error(pc.red('✖'), message)
  },

  section(title: string): void {
    console.log('\n' + pc.bold(pc.cyan(title)))
    console.log(pc.gray('─'.repeat(50)))
  },

  keyValue(key: string, value: string): void {
    console.log(`  ${pc.gray(key + ':')} ${pc.white(value)}`)
  },

  code(content: string): void {
    console.log(pc.gray(content))
  },
}
