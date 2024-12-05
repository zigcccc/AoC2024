import { logger, readLines } from '@/utils';

function getRulesAndUpdates(lines: string[]) {
  const rules = lines
    .filter((line) => line.includes('|'))
    .map((rawRule) => {
      const [a, b] = rawRule.split('|');
      return [parseInt(a, 10), parseInt(b, 10)] as const;
    });
  const updates = lines
    .filter((line) => line.includes(','))
    .map((update) => update.split(',').map((num) => parseInt(num, 10)));

  return { rules, updates } as const;
}

async function solvePart1() {
  const lines = await readLines(__dirname, { testInput: false });
  const { rules, updates } = getRulesAndUpdates(lines);
  let result = 0;

  for (const update of updates) {
    let updateValid = true;
    const relevantRules = rules.filter(([a, b]) => update.includes(a) && update.includes(b));

    for (const [bigger, smaller] of relevantRules) {
      if (update.indexOf(bigger) > update.indexOf(smaller)) {
        updateValid = false;
        break;
      }
    }

    if (updateValid) {
      result += update[Math.floor(update.length / 2)];
    }
  }

  logger.logSolution({ part: 1, result });
}

async function solvePart2() {
  const lines = await readLines(__dirname, { testInput: false });
  const { rules, updates } = getRulesAndUpdates(lines);
  let result = 0;

  for (const update of updates) {
    let updateValid = true;
    const relevantRules = rules.filter(([a, b]) => update.includes(a) && update.includes(b));

    for (const [bigger, smaller] of relevantRules) {
      if (update.indexOf(bigger) > update.indexOf(smaller)) {
        updateValid = false;
        break;
      }
    }

    if (!updateValid) {
      update.sort((a, b) => {
        const aScore = relevantRules
          .filter((rule) => rule.includes(a))
          .map((rule) => rule.indexOf(a))
          .reduce((score, value) => score + value, 0);
        const bScore = relevantRules
          .filter((rule) => rule.includes(b))
          .map((rule) => rule.indexOf(b))
          .reduce((score, value) => score + value, 0);

        return aScore > bScore ? 1 : -1;
      });

      result += update[Math.floor(update.length / 2)];
    }
  }

  logger.logSolution({ part: 2, result });
}

solvePart1();
solvePart2();
