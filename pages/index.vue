<template>
  <div class="index-page">
    <ConfigSelector v-model="config" />

    <ResultSetup :data="permutationResults" :config="config" />
    <ResultTable :data="permutationResults[0].output" :sample-size="50" />
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { PermutationCalculator, type PermutationResult } from '~/calculator/permutation-calculator';

const config = ref<CalculatorConfig>(buildConfig({}));

const permutationResults = ref<PermutationResult[]>([{ output: [], qualityModulesByTier: [], iterations: 0 }]);

watch(config, async () => {
    permutationResults.value = await doPermutationsAsync();
  },
  { immediate: true}
);

async function doPermutationsAsync(): Promise<PermutationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const configSnapshot = { ...config.value };
      const permutationCalculator = new PermutationCalculator(configSnapshot);

      const startTime = performance.now();
      const rawResults = permutationCalculator.calculatePermutations();
      const endTime = performance.now();
      console.log(`Permutations took ${endTime - startTime} milliseconds`);

      const interestingResults = permutationCalculator.filterOnlyImportantPermutations(rawResults);
      resolve(interestingResults);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>

