import chalk from 'chalk';
import strip from 'strip-color';

type LogOptions = {
  part: number;
  result: number | string;
};

function withBorder(...lines: string[]) {
  const strippedLines = lines.map((line) => strip(line)).map((strippedLine) => strippedLine.length);
  const maxLineLength = Math.max(...strippedLines) + 4;
  const horizontalBorder = `+${'-'.repeat(maxLineLength)}+`;

  console.log(chalk.green(horizontalBorder));
  console.log(chalk.green(`|${' '.repeat(maxLineLength)}|`));
  for (let line of lines) {
    if (strip(line).length < maxLineLength) {
      line = `${line}${' '.repeat(maxLineLength - strip(line).length - 4)}`;
    }
    console.log(chalk.green(`|  ${line}  |`));
  }
  console.log(chalk.green(`| ${' '.repeat(maxLineLength - 2)} |`));
  console.log(chalk.green(horizontalBorder));
  console.log('');
}

async function withTiming(fn: () => Promise<void>) {
  console.time(chalk.blackBright(fn.name));
  await fn();
  console.timeEnd(chalk.blackBright(fn.name));
  console.log('');
  console.log('');
}

export const logger = {
  logSolution({ result, part }: LogOptions) {
    withBorder(chalk.green.underline(`Solution - part ${part}:`), chalk.green('Result:', chalk.bold(result)));
  },
  timing: withTiming,
} as const;
