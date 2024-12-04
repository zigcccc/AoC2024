import { readFile } from 'fs/promises';
import { resolve } from 'path';

type ReadLinesOptions = {
  testInput?: boolean;
};

export async function readLines(dir: string, { testInput }: ReadLinesOptions = { testInput: false }) {
  const filename = testInput ? './test_input.txt' : './input.txt';
  const data = await readFile(resolve(dir, filename));
  return data.toString().split('\n');
}

export async function readGrid(...args: Parameters<typeof readLines>) {
  const lines = await readLines(...args);
  return lines.map((line) => line.split(''));
}
