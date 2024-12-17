import { qualityFromName, type ModuleTier, type QualityTier } from './constants';
import { ProductionCalculator } from './production-calculator';
import { sum, tupleSum } from './utils';

const defaultConfig: CalculatorConfig = {
  machineProductivity: 0,
  researchProductivity: 0,
  moduleSlots: 4,

  maxQuality: qualityFromName('Legendary'),
  keepQuality: qualityFromName('Legendary'),
  
  productivityModuleTier: 3,
  productivityModuleQuality: qualityFromName('Legendary'),

  qualityModuleTier: 3,
  qualityModuleQuality: qualityFromName('Legendary'),

  epsilon: 0.001 / 100
}

export class CycleCalculator {
  private readonly config: CalculatorConfig;
  private readonly productionCalculator: ProductionCalculator;
  private readonly qualityModuleCountByTier: number[];
  private readonly productivityModuleCountByTier: number[];

  constructor(config: Partial<CalculatorConfig>, qualityModuleCountByTier: number[]) {
    this.config = {
      ...defaultConfig,
      ...config
    }

    this.productionCalculator = new ProductionCalculator(this.config);

    this.qualityModuleCountByTier = qualityModuleCountByTier;
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

export type CalculatorConfig = {
  machineProductivity: number,
  researchProductivity: number,
  moduleSlots: number,

  maxQuality: number,
  keepQuality: number,
  
  productivityModuleTier: ModuleTier,
  productivityModuleQuality: QualityTier,

  qualityModuleTier: ModuleTier,
  qualityModuleQuality: QualityTier,

  epsilon: number
}