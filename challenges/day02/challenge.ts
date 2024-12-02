import { logger, readLines, removeFromArray } from '@/utils';

function checkReport(report: number[]) {
  let problematicIndex: number | null = null;

  for (const idx in report) {
    const index = parseInt(idx, 10);
    const level = report[index];
    const nextLevel = index < report.length - 1 ? report[index + 1] : null;
    const prevLevel = index > 0 ? report[index - 1] : null;

    if (!nextLevel || !prevLevel) {
      continue;
    }

    if (
      (nextLevel >= level && prevLevel >= level) ||
      (nextLevel <= level && prevLevel <= level) ||
      Math.abs(nextLevel - level) > 3 ||
      Math.abs(prevLevel - level) > 3
    ) {
      problematicIndex = index;
      break;
    }
  }

  return problematicIndex;
}

async function solvePart1() {
  const reports = await readLines(__dirname, { testInput: false });
  let result = 0;

  for (const report of reports) {
    const levels = report.split(' ').map((num) => parseInt(num, 10));

    const problematicIndex = checkReport(levels);
    result += problematicIndex === null ? 1 : 0;
  }

  logger.log({ part: 1, result });
}

async function solvePart2() {
  const reports = await readLines(__dirname, { testInput: false });
  let result = 0;

  for (const report of reports) {
    const levels = report.split(' ').map((num) => parseInt(num, 10));
    const problematicIndex = checkReport(levels);

    if (!problematicIndex) {
      result += 1;
      continue;
    }

    const previousProblematicIndex = checkReport(removeFromArray(levels, problematicIndex - 1));
    const nextProblematicIndex = checkReport(removeFromArray(levels, problematicIndex + 1));
    const currentProblematicIndex = checkReport(removeFromArray(levels, problematicIndex));

    if (previousProblematicIndex === null || nextProblematicIndex === null || currentProblematicIndex === null) {
      result += 1;
    }
  }

  logger.log({ part: 2, result });
}

solvePart1();
solvePart2();
