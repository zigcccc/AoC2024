import { readFile } from 'fs/promises';
import { resolve } from 'path';

async function solvePart1() {
  const data = await readFile(resolve(__dirname, './input.txt'));
  const lines = data.toString().split('\n');

  const leftList: number[] = [];
  const rightList: number[] = [];

  let result = 0;

  for (const line of lines) {
    const [left, right] = line.split('   ');
    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
  }

  leftList.sort();
  rightList.sort();

  for (const idx in leftList) {
    const dist = Math.abs(leftList[idx] - rightList[idx]);
    result += dist;
  }

  console.log(result);
}

async function solvePart2() {
  const data = await readFile(resolve(__dirname, './input.txt'));
  const lines = data.toString().split('\n');

  const leftList: number[] = [];
  const rightList: number[] = [];

  const scores: Record<number, number> = {};
  let result = 0;

  for (const line of lines) {
    const [left, right] = line.split('   ');
    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
  }

  for (const num of leftList) {
    if (scores[num]) {
      result += scores[num]
    } else {
      const count = rightList.filter((rightNum) => rightNum === num).length;
      const score = count * num;
      scores[num] = score;
      result += score;
    }
  }

  console.log(result)
}

solvePart2();