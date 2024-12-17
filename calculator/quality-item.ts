import { qualities, type Quality } from './constants';

// Immutable
export class QualityItem {
  private readonly values: QualityTuple = [0, 0, 0, 0, 0];

  constructor(values?: QualityTuple) {
    if (values) {
      this.values = values;
    }
  }

  public static create(count: number, quality: number | Quality): QualityItem {
    const qualityIndex = typeof quality === 'string' ? qualities.indexOf(quality) : quality;

    const tuple: QualityTuple = [0, 0, 0, 0, 0];    
    tuple[qualityIndex] = count;

    return new QualityItem(tuple);
  }

  public static sum(qualityItems: QualityItem[]): QualityItem {
    const tuple: QualityTuple = [0, 0, 0, 0, 0];

    for (const item of qualityItems) {
      tuple[0] += item.getQualityValue(0);
      tuple[1] += item.getQualityValue(1);
      tuple[2] += item.getQualityValue(2);
      tuple[3] += item.getQualityValue(3);
      tuple[4] += item.getQualityValue(4);
    }

    return new QualityItem(tuple);
  }

  public clone(): QualityItem {
    return new QualityItem(this.values.slice() as QualityTuple);
  }

  public getQualityValue(quality: number | Quality): number {
    const qualityIndex = typeof quality === 'string' ? qualities.indexOf(quality) : quality;
    return this.values[qualityIndex];
  }

  public getValues(): QualityTuple {
    return this.values.slice() as QualityTuple;
  }

  public multiply(scalar: number): QualityItem {
    return new QualityItem([
       this.values[0] * scalar,
       this.values[1] * scalar,
       this.values[2] * scalar,
       this.values[3] * scalar,
       this.values[4] * scalar
    ]);
  }
}

export type QualityTuple = [number, number, number, number, number];
