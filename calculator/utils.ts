export function sum(input: number[]): number {
  return input.reduce((partialSum, a) => partialSum + a, 0);
}

export function tupleSum(inputs: number[][]): number[] {
  const result: number[] = [];

  for (const tuple of inputs) {
    for (let i = 0; i < tuple.length; ++i) {
      if (result[i] == null) {
        result[i] = 0;
      }

      result[i] += tuple[i];
    }
  }

  return result;
}

export function printTuple(array: number[]): string {
  return `[${array.join(', ')}]`;
}