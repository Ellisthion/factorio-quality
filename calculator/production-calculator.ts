import type { CalculatorConfig } from './calculator-config';
import { type QualityTier } from './constants';
import { calculateProductivity, calculateQuality } from './module-calculator';

export class ProductionCalculator {
  constructor(private config: CalculatorConfig) {
  }

  public craftSingle(input: number, quality: QualityTier, productivityModules: number, qualityModules: number): number[] {
    const effectiveProductivity = calculateProductivity(productivityModules, this.config);
    const effectiveQuality = calculateQuality(qualityModules, this.config);

    return this.craftSingleRecipe(input, quality, effectiveProductivity, effectiveQuality);
  }

  public recycleSingle(input: number, quality: QualityTier): number[] {
    if (quality >= this.config.keepQuality) {
      throw new Error('Should not be trying to recycle item of quality: ' + quality);
    }

    const effectiveProductivity = 0.25;
    const effectiveQuality = calculateQuality(4, this.config);

    return this.craftSingleRecipe(input, quality, effectiveProductivity, effectiveQuality);
  }

  private craftSingleRecipe(input: number, quality: QualityTier, effectiveProductivity: number, effectiveQuality: number): number[] {
    const qualityMatrix = this.getQualityMatrix(quality, effectiveQuality);

    let results = [];
    for (let i = 0; i < qualityMatrix.length; ++i) {
      results[i] = qualityMatrix[i] * input * effectiveProductivity;
    }

    return results;
  }

  private getQualityMatrix(quality: QualityTier, effectiveQuality: number): number[] {
    const outputs: number[] = [];
    outputs[quality] = 1;

    for (let outputTierIndex = 0; outputTierIndex < this.config.maxQuality; ++outputTierIndex) {
      if (outputTierIndex < quality) {
        outputs[outputTierIndex] = 0;
        continue;
      }

      const chance = outputTierIndex === quality ? effectiveQuality : 0.1;
      const inputs = outputs[outputTierIndex];

      outputs[outputTierIndex] = inputs * (1 - chance);
      outputs[outputTierIndex + 1] = inputs * chance;
    }

    return outputs;
  }
}
