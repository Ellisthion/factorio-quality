import { getModuleValue, type QualityTier } from './constants';
import type { CalculatorConfig } from './cycle-calculator';

export class ProductionCalculator {
  constructor(private config: CalculatorConfig) {
  }

  public craftSingle(input: number, quality: QualityTier, productivityModules: number, qualityModules: number): number[] {
    const effectiveProductivity = this.getEffectiveProductivity(productivityModules);
    const effectiveQuality = this.getEffectiveQuality(qualityModules);

    return this.craftSingleRecipe(input, quality, effectiveProductivity, effectiveQuality);
  }

  public recycleSingle(input: number, quality: QualityTier): number[] {
    if (quality >= this.config.keepQuality) {
      throw new Error('Should not be trying to recycle item of quality: ' + quality);
    }

    const effectiveProductivity = 0.25;
    const effectiveQuality = this.getEffectiveQuality(4);

    return this.craftSingleRecipe(input, quality, effectiveProductivity, effectiveQuality);
  }

  private craftSingleRecipe(input: number, quality: QualityTier, effectiveProductivity: number, effectiveQuality: number): number[] {
    const baseOutputs = this.createItems(input, quality);

    for (let outputTierIndex = quality; outputTierIndex < this.config.maxQuality; ++outputTierIndex) {
      const chance = outputTierIndex === quality ? effectiveQuality : 0.1;
      const inputs = baseOutputs[outputTierIndex];

      baseOutputs[outputTierIndex] = inputs * (1 - chance);
      baseOutputs[outputTierIndex + 1] = inputs * chance;
    }

    const outputs = baseOutputs.map(v => v * effectiveProductivity);
    return outputs;
  }

  private getEffectiveProductivity(productivityModules: number): number {
    const productivityModuleValue = getModuleValue('productivity', this.config.productivityModuleQuality, this.config.productivityModuleTier);
    return (100 + this.config.machineProductivity + this.config.researchProductivity + productivityModules * productivityModuleValue) / 100;
  }
  
  private getEffectiveQuality(qualityModules: number): number {
    const qualityModuleValue = getModuleValue('quality', this.config.qualityModuleQuality, this.config.qualityModuleTier);
    return (qualityModules * qualityModuleValue) / 100;
  }

  private createItems(count: number, quality: QualityTier): number[] {
    const baseOutputs = new Array(this.config.maxQuality + 1).fill(0);
    baseOutputs[quality] = count;
    return baseOutputs;
  }
}
