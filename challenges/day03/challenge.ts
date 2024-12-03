import { logger, readLines } from '@/utils';

function executeInstructions(program: string) {
  let result = 0;

  const isValidRegex = new RegExp(/mul\(\d{1,3},\d{1,3}\)/g);
  const digitRegex = new RegExp(/\d{1,3}/g);
  const validInstructions = program.match(isValidRegex);

  for (const instruction of validInstructions!) {
    const [a, b] = instruction.match(digitRegex)!.map((d) => parseInt(d, 10));
    result += a * b;
  }

  return result;
}

async function solvePart1() {
  const lines = await readLines(__dirname, { testInput: false });
  const program = lines.join();
  const result = executeInstructions(program);

  logger.logSolution({ part: 1, result });
}

async function solvePart2() {
  const lines = await readLines(__dirname, { testInput: false });
  const program = lines.join();

  const [first, ...restOfSegments] = program.split("don't()");
  let cleanedProgram = `${first}`;

  for (const segment of restOfSegments) {
    const [_invalid, ...valid] = segment.split('do()');
    cleanedProgram += `${valid.join()}`;
  }

  const result = executeInstructions(cleanedProgram);

  logger.logSolution({ part: 2, result });
}

solvePart1();
solvePart2();
