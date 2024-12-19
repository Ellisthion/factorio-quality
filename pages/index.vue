<template>
  <div class="index-page">
    <section>
      <div class="preamble">
        <h1>Factorio Quality Recycling</h1>
        <p>This simplified calculator assumes you will be doing:</p>
        <ul>
          <li>Craft an item</li>
          <li>Recycle it</li>
          <li>Loop until item is sufficient quality</li>
        </ul>
        <p>
          We're assuming the recycler has max quality modules.
          But for each tier of crafting the item itself,
          what split of quality and productivity modules is optimal?
        </p>
      </div>

      <h2>Config</h2>
    
      <ConfigSelector v-model="config" />
    </section>

    <section>
      <h2>Results</h2>

      <ResultSetup :data="permutationResults" :config="config" />
      <ResultTable :data="permutationResults[0].output" :sample-size="50" />
    </section>

    <!-- <button type="button" class="button" @click="runOptimiser()">
      Run Optimiser
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { Optimiser } from '~/calculator/optimiser';
import { PermutationCalculator, type PermutationResult } from '~/calculator/permutation-calculator';

// const runOptimiser = () => new Optimiser().run();

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

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(min-content, 1fr));
    column-gap: 2rem;
  }
}

.preamble {
  max-width: 30rem;
}
</style>

