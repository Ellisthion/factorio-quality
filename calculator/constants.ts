export const qualities = ['Normal', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as const;
export type Quality = typeof qualities[number];

export const productivityModuleValues = [
  [4, 5, 6, 7, 10],
  [6, 7, 9, 11, 15],
  [10, 13, 16, 19, 25]
];

export const qualityModuleValues = [
  [1, 1.3, 1.6, 1.9, 2.5],
  [2, 2.6, 3.2, 3.8, 5],
  [2.5, 3.2, 4, 4.7, 6.2]
];

export type ModuleTier = 1 | 2 | 3;
export type QualityTier = 0 | 1 | 2 | 3 | 4;

export function qualityFromName(qualityName: Quality): QualityTier {
  return qualities.indexOf(qualityName) as QualityTier;
}

export function getModuleValue(kind: 'productivity' | 'quality', quality: QualityTier, tier: ModuleTier): number {
  switch (kind) {
    case 'productivity':
      return productivityModuleValues[tier - 1][quality];
    case 'quality':
      return qualityModuleValues[tier - 1][quality];
    default:
      throw new Error('Bad arg: ' + kind);
  }
}