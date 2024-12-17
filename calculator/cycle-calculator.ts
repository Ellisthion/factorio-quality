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

  public craftCycle(count: number, quality = 0): number[] {
    const ingredients = new Array(this.config.maxQuality + 1).fill(0);
    ingredients[quality] = count;

    return this.craftCycleRecursive(ingredients);
  }

  private craftCycleRecursive(ingredients: number[]): number[] {
    const eachCrafted = ingredients.map((count, quality) => {
      const p = this.productivityModuleCountByTier[quality];
      const q = this.qualityModuleCountByTier[quality];
      const result = this.productionCalculator.craftSingle(count, quality as QualityTier, p, q);
      return result;
    });

    const allCrafted = tupleSum(eachCrafted);
  
    let toRecycle = new Array<number>(this.config.maxQuality + 1).fill(0);
    let toKeep = new Array<number>(this.config.maxQuality + 1).fill(0);
    for (let q = 0; q < 5; ++q) {
      if (q < this.config.keepQuality) {
        toRecycle[q] = allCrafted[q];
      } else {
        toKeep[q] = allCrafted[q];
      }
    }

    const areWeDone = sum(toRecycle) < this.config.epsilon;
    if (areWeDone) {
      return allCrafted;
    }

    const eachRecycled = toRecycle.map((count, quality) => {
      if (count === 0) {
        return new Array<number>(this.config.maxQuality + 1).fill(0);
      }
      const result = this.productionCalculator.recycleSingle(count, quality as QualityTier);
      return result;
    });

    const allRecycled = tupleSum(eachRecycled);

    const recursiveCraftResults = this.craftCycleRecursive(allRecycled);
    const combinedResults = tupleSum([toKeep, recursiveCraftResults]);
    
    return combinedResults;
  }
}