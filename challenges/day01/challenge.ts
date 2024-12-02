import { readLines, logger } from '@/utils';

async function solvePart1() {
  const lines = await readLines(__dirname);

  const leftList: number[] = [];
  const rightList: number[] = [];

  let result = 0;

  for (const line of lines) {
    const [left, right] = line.split('   ');
    leftList.push(parseInt(left, 10));
    rightList.push(parseInt(right, 10));
  }

  leftList.sort();
  rightList.sort();

  for (const idx in leftList) {
    const dist = Math.abs(leftList[idx] - rightList[idx]);
    result += dist;
  }

  logger.logSolution({ part: 1, result });
}

async function solvePart2() {
  const lines = await readLines(__dirname);

  const leftList: number[] = [];
  const rightList: number[] = [];

  const scores: Record<number, number> = {};
  let result = 0;

  for (const line of lines) {
    const [left, right] = line.split('   ');
    leftList.push(parseInt(left, 10));
    rightList.push(parseInt(right, 10));
  }

  for (const num of leftList) {
    if (scores[num]) {
      result += scores[num];
    } else {
      const count = rightList.filter((rightNum) => rightNum === num).length;
      const score = count * num;
      scores[num] = score;
      result += score;
    }
  }

  logger.logSolution({ part: 2, result });
}

solvePart1();
solvePart2();
