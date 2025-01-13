import { buildConfig, type CalculatorConfig } from './calculator-config';
import { qualities, type ModuleTier, type QualityTier } from './constants';
import { machines } from './machines';
import { calculateProductivity, calculateQuality } from './module-calculator';
import { PermutationCalculator } from './permutation-calculator';

export class Optimiser {
  public run(): void {
    const trialQualities = [0, 1, 2, 3, 4] as QualityTier[];
    const trialTiers = [1, 2, 3] as ModuleTier[];
    const researchProductivities = new Array(300 / 10 + 1).fill(0).map((o, i) => i * 10);

    const trialResults = [];

    console.log('starting trial');

    for (const machine of machines) {
      console.log('machine: ' + machine.name);
      for (const moduleQuality of trialQualities) {
        for (const moduleTier of trialTiers) {
          console.log(`modules: ${qualities[moduleQuality]} Tier ${moduleTier}`);

          for (const researchProductivity of researchProductivities) {
            if (machine.productivity + researchProductivity > 300) {
              continue;
            }

            const config = buildConfig({
              machineProductivity: machine.productivity,
              machineQuality: machine.quality,
              researchProductivity: researchProductivity,
              moduleSlots: machine.moduleSlots,

              productivityModuleTier: moduleTier,
              productivityModuleQuality: moduleQuality,
          
              qualityModuleTier: moduleTier,
              qualityModuleQuality: moduleQuality,
            });

            const trialResult = this.runTrial(machine.name, config);
            trialResults.push(trialResult)
          }
        }
      }
    }

    this.exportTrialResults(trialResults);
  }

  private runTrial(machineName: string, config: CalculatorConfig): TrialResult {
    const permutationCalculator = new PermutationCalculator(config);
    const results = permutationCalculator.calculatePermutations();
    const bestResultModuleCount = results[0].qualityModulesByTier[0];

    return {
      machineName: machineName,
      machineProductivity: config.machineProductivity,
      machineQuality: config.machineQuality,
      researchProductivity: config.researchProductivity,
      totalBaseProductivity: config.machineProductivity + config.researchProductivity,

      moduleTier: config.qualityModuleTier,
      moduleQuality: config.qualityModuleQuality + 1,

      moduleSlots: config.moduleSlots,
      qualityModuleCount: bestResultModuleCount,
      productivityModuleCount: config.moduleSlots - bestResultModuleCount,

      productivity: calculateProductivity(config.moduleSlots - bestResultModuleCount, config) - 1,
      quality: calculateQuality(bestResultModuleCount, config)
    }
  }

  private exportTrialResults(trialResults: TrialResult[]): void {
    const csv = this.convertToCSV(trialResults);
    console.log(csv);
  }

  // https://stackoverflow.com/a/58769574/908644
  private convertToCSV(arr: any[]): string {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
}

export type TrialResult = {
  machineName: string,
  machineProductivity: number,
  machineQuality: number,
  researchProductivity: number,
  totalBaseProductivity: number,

  moduleTier: number,
  moduleQuality: number,

  moduleSlots: number,
  qualityModuleCount: number,
  productivityModuleCount: number,

  productivity: number,
  quality: number 
}