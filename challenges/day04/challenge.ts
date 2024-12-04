import { logger, readGrid } from '@/utils';

const directions = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
] as const;

function isInvalidCharacter(grid: string[][], char: string, row: number, col: number) {
  try {
    return grid[row][col] !== char;
  } catch {
    return true;
  }
}

async function solvePart1() {
  const grid = await readGrid(__dirname, { testInput: false });
  const word = 'XMAS';
  let result = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      for (const dir of directions) {
        let isTargetWord = true;

        for (let k = 0; k < word.length; k++) {
          if (isInvalidCharacter(grid, word[k], row + k * dir[0], col + k * dir[1])) {
            isTargetWord = false;
            break;
          }
        }

        if (isTargetWord) {
          result += 1;
        }
      }
    }
  }

  logger.logSolution({ part: 1, result });
}

async function solvePart2() {
  const grid = await readGrid(__dirname, { testInput: false });
  let result = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 'A') {
        try {
          const ltr = new Set([grid[row - 1][col - 1], grid[row + 1][col + 1]]);
          const rtl = new Set([grid[row - 1][col + 1], grid[row + 1][col - 1]]);

          if (ltr.has('S') && ltr.has('M') && rtl.has('S') && rtl.has('M')) {
            result += 1;
          }
        } catch {
          break;
        }
      }
    }
  }

  logger.logSolution({ part: 2, result });
}

solvePart1();
solvePart2();
