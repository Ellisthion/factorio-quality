import type { CalculatorConfig } from './calculator-config';
import { getModuleValue } from './constants';

export function calculateProductivity(productivityModules: number, config: CalculatorConfig): number {
  const productivityModuleValue = getModuleValue('productivity', config.productivityModuleQuality, config.productivityModuleTier);
  return (100 + config.machineProductivity + config.researchProductivity + productivityModules * productivityModuleValue) / 100;
}

export function calculateQuality(qualityModules: number, config: CalculatorConfig): number {
  const qualityModuleValue = getModuleValue('quality', config.qualityModuleQuality, config.qualityModuleTier);
  return (qualityModules * qualityModuleValue) / 100;
}
