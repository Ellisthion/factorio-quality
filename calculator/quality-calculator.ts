import { productivityModuleValues, qualities, qualityModuleValues, type Quality } from './constants';
import { QualityItem, type QualityTuple } from './quality-item';

const baseProductivity = 0;
const moduleCount = 4;

const productivityModuleValue = getModuleValue('productivity', 'Legendary', 3);
const qualityModuleValue = getModuleValue('quality', 'Legendary', 3);
const qualityUnlockTier: Quality = 'Legendary';

export function doQualityCalculations(): QualityItem {
  const sampleCount = 10000;

  const items = QualityItem.create(sampleCount, 'Common');

  const output = craft(items, 0, 4);
  const percentages = output.multiply(1 / sampleCount);

  return percentages;
}

function craft(inputs: QualityItem, productivityModuleCount: number, qualityModuleCount: number): QualityItem {
  const effectiveProductivity = getEffectiveProductivity(productivityModuleCount);
  const effectiveQuality = getEffectiveQuality(qualityModuleCount);

  return craftAll(inputs, effectiveProductivity, effectiveQuality);
}

function recycle(inputs: QualityItem): QualityItem {
  const effectiveProductivity = 0.25;
  const effectiveQuality = getEffectiveQuality(4);

  return craftAll(inputs, effectiveProductivity, effectiveQuality);
}

function craftAll(inputs: QualityItem, effectiveProductivity: number, effectiveQuality: number): QualityItem {
  const allOutputs = inputs.getValues().map((count, qualityIndex) => {
    return craftSingleRecipe(count, qualityIndex, effectiveProductivity, effectiveQuality);
  });

  const combinedOutput = QualityItem.sum(allOutputs);
  return combinedOutput;
}

function craftSingleRecipe(count: number, qualityIndex: number, effectiveProductivity: number, effectiveQuality: number): QualityItem {
  const qualityUnlockTierIndex = qualities.indexOf(qualityUnlockTier);

  const baseOutputs = QualityItem.create(count, qualityIndex).getValues();

  for (let outputTierIndex = qualityIndex; outputTierIndex < qualityUnlockTierIndex; ++outputTierIndex) {
    const chance = outputTierIndex === qualityIndex ? effectiveQuality : 0.1;
    const inputs = baseOutputs[outputTierIndex];

    baseOutputs[outputTierIndex] = inputs * (1 - chance);
    baseOutputs[outputTierIndex + 1] = inputs * chance;
  }

  const outputs = new QualityItem(baseOutputs).multiply(effectiveProductivity);
  return outputs;
}

function getEffectiveProductivity(productivityModuleCount: number): number {
  return (100 + baseProductivity + productivityModuleCount * productivityModuleValue) / 100;
}

function getEffectiveQuality(qualityModuleCount: number): number {
  return (qualityModuleCount * qualityModuleValue) / 100;
}

function getModuleValue(kind: 'productivity' | 'quality', quality: Quality, tier: 1 | 2 | 3): number {
  const qualityIndex = qualities.indexOf(quality);

  switch (kind) {
    case 'productivity':
      return productivityModuleValues[tier - 1][qualityIndex];
    case 'quality':
      return qualityModuleValues[tier - 1][qualityIndex];
    default:
      throw new Error('Bad arg: ' + kind);
  }
}