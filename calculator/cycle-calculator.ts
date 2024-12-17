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

    const areWeDone = sum(toRecycle) < this.config.epsilon;
    if (areWeDone) {
      return allCrafted;
    }

    const eachRecycled = toRecycle.map((count, quality) => {
      if (count === 0) {
        return [];
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