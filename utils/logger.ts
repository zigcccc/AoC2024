import chalk from 'chalk';

type LogOptions = {
  part: number;
  result: number | string;
};

export const logger = {
  logSolution({ result, part }: LogOptions) {
    console.log(chalk.green.underline(`\nSolution - part ${part}:`));
    console.log(chalk.green('Result:', chalk.bold(result), '\n'));
  },
} as const;
