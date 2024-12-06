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

function isGuardInBounds(pos: readonly [number, number], gridLength: number) {
  return pos[0] < gridLength && pos[0] >= 0 && pos[1] < gridLength && pos[1] >= 0;
}

function getGuardNextPosition(currentGuard: Guard, [currentRow, currentCol]: readonly [number, number]) {
  const [dRow, dCol] = GuardDirection[currentGuard];
  return [currentRow + dRow, currentCol + dCol] as const;
}

function getGuardPath(grid: string[][], initialGuardPosition: readonly [number, number]) {
  const spots = new Set<string>([]);

  let guardPosition = initialGuardPosition;

  if (!guardPosition) {
    throw new Error('No guard found!');
  }

  spots.add(guardPosition.join(','));

  while (true) {
    const currentGuard = grid[guardPosition[0]][guardPosition[1]] as Guard;
    const guardNextPosition = getGuardNextPosition(currentGuard, guardPosition);

    if (!isGuardInBounds(guardNextPosition, grid.length)) {
      break;
    }

    if (grid[guardNextPosition[0]][guardNextPosition[1]] !== wall) {
      grid[guardNextPosition[0]][guardNextPosition[1]] = currentGuard;
      grid[guardPosition[0]][guardPosition[1]] = 'X';
      spots.add(guardNextPosition.join(','));
      guardPosition = guardNextPosition;
    } else {
      grid[guardPosition[0]][guardPosition[1]] = GuardRotation[currentGuard];
    }
  }

  return [...spots].map((spot) => spot.split(',').map(Number));
}

async function solvePart1() {
  const grid = await readGrid(__dirname, { testInput: false });
  const initialGuardPosition = getGuardPosition(grid);

  if (!initialGuardPosition) {
    throw new Error('No guard found!');
  }

  const spots = getGuardPath(grid, initialGuardPosition);

  logger.logSolution({ part: 1, result: spots.length });
}

async function solvePart2() {
  const originalGrid = await readGrid(__dirname, { testInput: false });

  let loopCount = 0;
  const initialGuardPosition = getGuardPosition(originalGrid);

  if (!initialGuardPosition) {
    throw new Error('No guard found!');
  }

  const possibleObstaclePositions = getGuardPath(copy2DArray(originalGrid), initialGuardPosition);
  possibleObstaclePositions.shift();

  for (const [obstascleRow, obstacleCol] of possibleObstaclePositions) {
    const rotations = new Set<string>();
    const grid = copy2DArray(originalGrid);
    rotations.add(grid[initialGuardPosition[0]][initialGuardPosition[1]] + initialGuardPosition.join(''));
    grid[obstascleRow][obstacleCol] = wall;

    let guardPosition = initialGuardPosition;

    while (true) {
      const currentGuard = grid[guardPosition[0]][guardPosition[1]] as Guard;
      const guardNextPosition = getGuardNextPosition(currentGuard, guardPosition);

      if (!isGuardInBounds(guardNextPosition, grid.length)) {
        break;
      }

      if (grid[guardNextPosition[0]][guardNextPosition[1]] !== wall) {
        grid[guardNextPosition[0]][guardNextPosition[1]] = currentGuard;
        grid[guardPosition[0]][guardPosition[1]] = '.';
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

logger.timing(solvePart1);
logger.timing(solvePart2);
