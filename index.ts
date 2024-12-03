import { spawn } from 'node:child_process';

import chalk from 'chalk';
import { program } from 'commander';

program.requiredOption('-d, --day <number>', 'Which day you want to run?').option('-w, --watch');
program.parse();

const options = program.opts();

const child = spawn('npx', ['tsx', options.watch ? '--watch' : '', `./challenges/day${options.day}/challenge.ts`], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.error('Failed to start child process:', err);
});

child.on('exit', (_, signal) => {
  if (signal) {
    console.log(`Child process was killed with signal: ${signal}`);
  } else {
    console.log(chalk.bgGreen.bold(`${' '.repeat(10)}DONE${' '.repeat(10)}`));
  }
});
