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
            {{ setup.qualityModulesByTier[quality] }}
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
import { qualities } from '~/calculator/constants';
import type { PermutationResult } from '~/calculator/permutation-calculator';
import { sum } from '~/calculator/utils';
import { formatValue } from '~/calculator/utils';

const props = defineProps<{
  data: PermutationResult[],
  moduleSlots: number
}>();

const sums = computed(() => props.data.map(o => sum(o.output)));
const fractionOfBest = computed(() => sums.value.map(s => s / sums.value[0]));
</script>

<style lang="scss" scoped>
</style>

