<template>
  <div class="index-page">
    <ConfigSelector v-model="config" />
    <div>
      {{ permutationResults[0].qualityModulesByTier.join(', ') }}
    </div>

    <ResultTable :data="permutationResults[0].output" :sample-size="50" />
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { PermutationCalculator, type PermutationResult } from '~/calculator/permutation-calculator';

const config = ref<CalculatorConfig>(buildConfig({}));

const permutationResults = ref<PermutationResult[]>([{ output: [], qualityModulesByTier: [] }]);

watch(config, async () => {
    permutationResults.value = await doPermutationsAsync();
  },
  { immediate: true}
);

async function doPermutationsAsync(): Promise<PermutationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const permutationCalculator = new PermutationCalculator(config.value);

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
</style>

