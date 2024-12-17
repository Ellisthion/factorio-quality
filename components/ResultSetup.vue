<template>
  <div class="result-setup-component">
    <table>
      <thead>
        <tr>
          <th class="no-border"></th>
          <th :colspan="qualities.length" class="text-center">
            # of Quality Modules
          </th>
        </tr>
        <tr>
          <th>% of Best</th>
          
          <th v-for="qualityName of qualities" :key="qualityName" class="text-center">
            <ItemIcon :icon="qualityName" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(setup, i) of data" :key="i">
          <td>
            {{ `${formatValue(fractionOfBest[i], 'percentage', 1)}` }}
          </td>

          <td v-for="(qualityName, quality) of qualities" :key="qualityName">
            <div class="result-cell">
              <template v-if="quality <= config.maxQuality">
                <div class="module-count">
                  {{ setup.qualityModulesByTier[quality] }}
                </div>

                <div class="stats text-muted text-small">
                  <div class="stat stat-quality">
                    <span>Q:</span>
                    <span>{{ getStatQuality(setup.qualityModulesByTier[quality]) }}</span>
                  </div>

                  <div class="stat stat-productivity">
                    <span>P:</span>
                    <span>{{ getStatProductivity(config.moduleSlots - setup.qualityModulesByTier[quality]) }}</span>
                  </div>
                </div>
              </template>
              <span class="text-muted text-small text-center" v-else>N/A</span>
            </div>
          </td>
        </tr>

        <tr>
          <th class="no-border"></th>
          <th :colspan="qualities.length" class="text-center">
            <small>Fill other module slots with Productivity</small>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorConfig } from '~/calculator/calculator-config';
import { qualities } from '~/calculator/constants';
import { calculateProductivity, calculateQuality } from '~/calculator/module-calculator';
import type { PermutationResult } from '~/calculator/permutation-calculator';
import { sum } from '~/calculator/utils';
import { formatValue } from '~/calculator/utils';

const props = defineProps<{
  data: PermutationResult[],
  config: CalculatorConfig,
}>();

const sums = computed(() => props.data.map(o => sum(o.output)));
const fractionOfBest = computed(() => sums.value.map(s => s / sums.value[0]));

function getStatProductivity(productivityModuleCount: number): string {
  const p = calculateProductivity(productivityModuleCount, props.config);
  return formatValue(p - 1, 'percentage');
}

function getStatQuality(qualityModuleCount: number): string {
  const q = calculateQuality(qualityModuleCount, props.config);
  return formatValue(q, 'percentage');
}
</script>

<style lang="scss" scoped>
.result-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  .stats {
    .stat {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

