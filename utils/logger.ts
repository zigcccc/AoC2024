type LogOptions = {
  part: number;
  result: number | string;
};

export const logger = {
  log({ result, part }: LogOptions) {
    console.log(`Result for part ${part}: ${result}`);
  },
} as const;
