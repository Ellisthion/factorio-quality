import type { CalculatorConfig } from './calculator-config';
import { getModuleValue } from './constants';

const maxProductivity = 4;

export function calculateProductivity(productivityModules: number, config: CalculatorConfig): number {
  const productivityModuleValue = getModuleValue('productivity', config.productivityModuleQuality, config.productivityModuleTier);
  const result = (100 + config.machineProductivity + config.researchProductivity + productivityModules * productivityModuleValue) / 100;
  if (result > maxProductivity) {
    return maxProductivity;
  }

  return result;
}

export function calculateQuality(qualityModules: number, config: CalculatorConfig): number {
  const qualityModuleValue = getModuleValue('quality', config.qualityModuleQuality, config.qualityModuleTier);
  const result = (config.machineQuality + qualityModules * qualityModuleValue) / 100;
  return result;
}
