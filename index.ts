import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import chalk from 'chalk';
import { program } from 'commander';

program
  .option('-d, --day <number>', 'Which day you want to run?')
  .option('-w, --watch')
  .option('-a , --all', 'Solve all?')
  .action((options) => {
    if (!options.all && !options.day) {
      console.error('Error: Either --all or --day must be provided.');
      process.exit(1);
    }
  });

program.parse();

const options = program.opts();

async function runChallenge(path: string, watch?: boolean) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', watch ? '--watch' : '', path], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', (err) => {
      console.error('Failed to start child process:', err);
      reject(err);
    });

    child.on('exit', (_, signal) => {
      if (signal) {
        console.log(`Child process was killed with signal: ${signal}`);
        reject(new Error(`Child process was killed with signal: ${signal}`));
      } else {
        resolve({ ok: true });
      }
    });
  });
}

if (options.all) {
  readdir(resolve(__dirname, './challenges')).then(async (dirs) => {
    for (const dirname of dirs) {
      const challengePath = `./challenges/${dirname}/challenge.ts`;
      console.log(chalk.bgGreen.bold(`${' '.repeat(10)}${dirname}${' '.repeat(10)}`));
      await runChallenge(challengePath);
    }
    console.log(chalk.bgGreen.bold(`${' '.repeat(10)}DONE${' '.repeat(10)}`));
  });
} else {
  const challengePath = `./challenges/day${options.day}/challenge.ts`;
  runChallenge(challengePath, options.watch).then(() => {
    console.log(chalk.bgGreen.bold(`${' '.repeat(10)}DONE${' '.repeat(10)}`));
  });
}
