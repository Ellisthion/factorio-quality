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

      result[i] += tuple[i] ?? 0;
    }
  }

  return result;
}

export function printTuple(array: number[]): string {
  return `[${array.join(', ')}]`;
}

export function formatValue(v: number, format: 'percentage' | 'outputs', precision?: number): string {
  switch (format) {
    case 'percentage': {
      if (precision) {
        if (v === 1 || v === 0) {
          return (v * 100) + '%';
        }

        return (v * 100).toFixed(precision) + '%';
      }

      const decimalPlaces = 3;
      const multiplier = Math.pow(10, decimalPlaces);
      return Math.round(v * 100 * multiplier) / multiplier + '%';
    }
    case 'outputs': {
      const decimalPlaces = precision ?? 3;
      const multiplier = Math.pow(10, decimalPlaces);
      return (Math.round(v * multiplier) / multiplier).toString();
    }
    default:
      throw new Error('Bad arg: ' + v);
  }
}