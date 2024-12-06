import { copy2DArray, logger, readGrid } from '@/utils';

const wall = '#';

type Guard = '^' | '>' | 'v' | '<';

const GuardDirection: Record<Guard, readonly [number, number]> = {
  '^': [-1, 0],
  '>': [0, 1],
  '<': [0, -1],
  v: [1, 0],
};

const GuardRotation: Record<Guard, Guard> = {
  '^': '>',
  '>': 'v',
  '<': '^',
  v: '<',
};

function getGuardPosition(grid: string[][]) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (Object.keys(GuardDirection).includes(grid[row][col])) {
        return [row, col] as const;
      }
    }
  }
}

function getGuardNextPosition(currentGuard: Guard, currentPosition: readonly [number, number]) {
  const [currentRow, currentCol] = currentPosition;
  const [dRow, dCol] = GuardDirection[currentGuard];

  return [currentRow + dRow, currentCol + dCol] as const;
}

function getAllObstaclePositions(grid: string[][]) {
  const positions: (readonly [number, number])[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '.') {
        positions.push([row, col] as const);
      }
    }
  }

  return positions;
}

async function solvePart1() {
  const grid = await readGrid(__dirname, { testInput: false });
  const spots = new Set<string>([]);

  let guardPosition = getGuardPosition(grid);

  if (!guardPosition) {
    throw new Error('No guard found!');
  }

  spots.add(guardPosition.join(','));

  while (true) {
    try {
      const currentGuard = grid[guardPosition[0]][guardPosition[1]] as Guard;
      const guardNextPosition = getGuardNextPosition(currentGuard, guardPosition);

      if (grid[guardNextPosition[0]][guardNextPosition[1]] !== wall) {
        grid[guardNextPosition[0]][guardNextPosition[1]] = currentGuard;
        grid[guardPosition[0]][guardPosition[1]] = 'X';
        spots.add(guardNextPosition.join(','));
        guardPosition = guardNextPosition;
      } else {
        grid[guardPosition[0]][guardPosition[1]] = GuardRotation[currentGuard];
      }
    } catch {
      break;
    }
  }

  logger.logSolution({ part: 1, result: [...spots].length });
}

async function solvePart2() {
  const originalGrid = await readGrid(__dirname, { testInput: false });

  let loopCount = 0;
  const initialGuardPosition = getGuardPosition(originalGrid);
  const possibleObstaclePositions = getAllObstaclePositions(originalGrid);

  if (!initialGuardPosition) {
    throw new Error('No guard found!');
  }

  for (const [obstascleRow, obstacleCol] of possibleObstaclePositions) {
    const rotations = new Set<string>();
    const grid = copy2DArray(originalGrid);
    rotations.add(grid[initialGuardPosition[0]][initialGuardPosition[1]] + initialGuardPosition.join(''));
    grid[obstascleRow][obstacleCol] = wall;

    let guardPosition = initialGuardPosition;

    while (true) {
      const currentGuard = grid[guardPosition[0]][guardPosition[1]] as Guard;
      const guardNextPosition = getGuardNextPosition(currentGuard, guardPosition);

      if (
        guardNextPosition[0] >= grid.length ||
        guardNextPosition[0] < 0 ||
        guardNextPosition[1] >= grid[0].length ||
        guardNextPosition[1] < 0
      ) {
        break;
      }

      if (grid[guardNextPosition[0]][guardNextPosition[1]] !== wall) {
        grid[guardNextPosition[0]][guardNextPosition[1]] = currentGuard;
        guardPosition = guardNextPosition;
      } else {
        const nextRotation = GuardRotation[currentGuard];
        grid[guardPosition[0]][guardPosition[1]] = nextRotation;
        const nextRotationEntry = nextRotation + guardPosition.join('');

        if (rotations.has(nextRotationEntry)) {
          loopCount += 1;
          break;
        } else {
          rotations.add(nextRotationEntry);
        }
      }
    }
  }

  logger.logSolution({ part: 2, result: loopCount });
}

async function solve() {
  await solvePart1();
  console.time('part2()');
  await solvePart2();
  console.timeEnd('part2()');
}

solve();
