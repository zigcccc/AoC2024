import { exec, spawn } from 'node:child_process';
import { program } from 'commander';

program.requiredOption('-d, --day <number>', 'Which day you want to run?')
program.parse()

const options = program.opts();

// Spawn the child process
const child = spawn('npx', ['tsx', '--watch', `./challenges/day${options.day}/challenge.ts`], {
  stdio: 'inherit', // Inherit stdio to see output in the parent process
  shell: true, // Use shell to enable command resolution on all platforms
});

child.on('error', (err) => {
  console.error('Failed to start child process:', err);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`Child process was killed with signal: ${signal}`);
  } else {
    console.log(`Child process exited with code: ${code}`);
  }
});