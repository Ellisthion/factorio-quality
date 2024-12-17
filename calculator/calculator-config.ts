import { qualityFromName, type ModuleTier, type QualityTier } from './constants';

export function buildConfig(config: Partial<CalculatorConfig>): CalculatorConfig {
  return {
    ...defaultConfig,
    ...config
  }
}

export const defaultConfig: CalculatorConfig = {
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