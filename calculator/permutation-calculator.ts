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
        output: cycleResult
      };
    })

    results.sort((a, b) => sum(b.output) - sum(a.output));

    return results;
  }

  private createAllModuleSetups(): number[][] {
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
  output: number[]
}