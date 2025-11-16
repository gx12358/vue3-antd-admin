import type { CAC } from 'cac'

import { execaCommand } from '@gx/node-utils'

interface LintCommandOptions {
  /**
   * Format lint problem.
   */
  format?: boolean;
}

async function runLint({ format }: LintCommandOptions) {
  // process.env.FORCE_COLOR = '3';

  if (format) {
    await execaCommand(`eslint . --cache --fix`, {
      stdio: 'inherit',
    })
    return
  }
  await Promise.all([
    execaCommand(`eslint . --cache`, {
      stdio: 'inherit',
    }),
  ])
}

function defineLintCommand(cac: CAC) {
  cac
    .command('lint')
    .usage('Batch execute project lint check.')
    .option('--format', 'Format lint problem.')
    .action(runLint)
}

export { defineLintCommand }
