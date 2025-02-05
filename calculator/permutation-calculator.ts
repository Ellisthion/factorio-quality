import type { CalculatorConfig } from './calculator-config';
import { CycleCalculator } from './cycle-calculator';
import { sum } from './utils';

export class PermutationCalculator {
  constructor (private config: CalculatorConfig) {
  }

  public calculatePermutations(): PermutationResult[] {
    const moduleSetups = this.createAllModuleSetups();

    const results = moduleSetups.map<PermutationResult>(moduleSetup => {
      const cycleCalculator = new CycleCalculator(this.config, moduleSetup);
      const cycleResult = cycleCalculator.craftCycle(1);

      return {
        qualityModulesByTier: moduleSetup,
        output: cycleResult.outputs,
        iterations: cycleResult.iterations
      };
    });

    results.sort((a, b) => {
      const outputDiff = sum(b.output) - sum(a.output);
      const iterationsDiff = a.iterations - b.iterations;

      return Math.abs(outputDiff) > 0.0000001
        ? outputDiff
        : iterationsDiff;
    });

    return results;
  }

  // Only results where all the module configs are 'similar'
  public filterOnlyImportantPermutations(permutationResults: PermutationResult[]): PermutationResult[] {
    return permutationResults.filter((result, index) => {
      // Just in case best value is abnormal
      if (index === 0) {
        return true;
      }

      // Just in case we're being weird
      if (result.qualityModulesByTier.length === 1) {
        return true;
      }

      const valuesThatShouldBeEqual = result.qualityModulesByTier.slice(0, this.config.keepQuality);
      const valuesThatShouldBeZero = result.qualityModulesByTier.slice(this.config.keepQuality);

      const firstValue = result.qualityModulesByTier[0];
      return valuesThatShouldBeEqual.every(v => v === firstValue) &&
        valuesThatShouldBeZero.every(v => v === 0);
    });
  }

  private createAllModuleSetups(): number[][] {
    // Short circuit if prod modules aren't supported in this recipe
    if (!this.config.recipeCanUseProductivity) {
      return [new Array(this.config.maxQuality + 1).fill(this.config.moduleSlots)];
    }

    let results: number[][] = [[]];
    for (let quality = 0; quality <= this.config.maxQuality; ++quality) {
      const previousResults = results;
      results = [];

      for (const previousResult of previousResults) {
        for (let qualityModuleCount = 0; qualityModuleCount <= this.config.moduleSlots; ++qualityModuleCount) {
          const newEntry = [...previousResult.slice(), qualityModuleCount];
          results.push(newEntry);
        }
      }
    }

    return results;
  }
}

export type PermutationResult = {
  qualityModulesByTier: number[],
  output: number[],
  iterations: number
}