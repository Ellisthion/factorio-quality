import type { CalculatorConfig } from './calculator-config';
import { type QualityTier } from './constants';
import { ProductionCalculator } from './production-calculator';
import { sum, tupleSum } from './utils';

export class CycleCalculator {
  private readonly productionCalculator: ProductionCalculator;
  private readonly productivityModuleCountByTier: number[];

  constructor(private config: CalculatorConfig, private qualityModuleCountByTier: number[]) {
    this.productionCalculator = new ProductionCalculator(this.config);

    this.productivityModuleCountByTier = qualityModuleCountByTier.map(c => this.config.moduleSlots - c);
  }

  public craftCycle(count: number, quality = 0): CycleResult {
    const ingredients = new Array(this.config.maxQuality + 1).fill(0);
    ingredients[quality] = count;

    return this.craftCycleLoop(ingredients);
  }

  private craftCycleLoop(ingredients: number[]): CycleResult {
    let stopFlag = false;
    let savedOutputs = new Array<number>(this.config.maxQuality + 1);

    const maxIterations = 100;
    let iteration = 0;

    while (!stopFlag && iteration++ < maxIterations) {
      let eachCrafted: number[][] = [];
      for (let quality = 0; quality < ingredients.length; ++quality) {
        const p = this.productivityModuleCountByTier[quality];
        const q = this.qualityModuleCountByTier[quality];
        eachCrafted[quality] = this.productionCalculator.craftSingle(ingredients[quality], quality as QualityTier, p, q);
      }

      const allCrafted = tupleSum(eachCrafted);
    
      let toRecycle = new Array<number>(this.config.maxQuality + 1);
      let toKeep = new Array<number>(this.config.maxQuality + 1);
      for (let q = 0; q <= this.config.maxQuality; ++q) {
        if (q < this.config.keepQuality) {
          toKeep[q] = 0;
          toRecycle[q] = allCrafted[q];
        } else {
          toKeep[q] = allCrafted[q];
          toRecycle[q] = 0;
        }
      }

      stopFlag = sum(toRecycle) < this.config.epsilon;
      if (stopFlag) {
        savedOutputs = tupleSum([savedOutputs, allCrafted]);
        break;
      }

      const eachRecycled = toRecycle.map((count, quality) => {
        if (count === 0) {
          return [];
        }
        const result = this.productionCalculator.recycleSingle(count, quality as QualityTier);
        return result;
      });

      savedOutputs = tupleSum([savedOutputs, toKeep]);

      ingredients = tupleSum(eachRecycled);
    }

    return {
      outputs: savedOutputs,
      iterations: iteration
    };
  }
}

export type CycleResult = {
  outputs: number[],
  iterations: number
}