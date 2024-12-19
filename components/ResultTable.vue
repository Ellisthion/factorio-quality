<template>
  <div class="result-table-component">
    <table>
      <thead>
        <tr>
          <!-- <th class="no-border"></th> -->
          <th :colspan="qualities.length + 1" class="text-center">
            Final Outputs
          </th>
        </tr>
        <tr>
          <!-- <th class="no-border"></th> -->
          
          <th v-for="qualityName of qualities" :key="qualityName" class="text-center">
            <ItemIcon :icon="qualityName" />
          </th>

          <th class="text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr>
          <td>
            Sample
          </td>
          <td v-for="(q, i) of qualities" :key="q">
            {{ formatValue(data[i] * sampleSize, 'outputs', 2) }}
          </td>
        </tr> -->
        <tr>
          <!-- <td>
            Percentage
          </td> -->
          <td v-for="(q, i) of qualities" :key="q">
            <span :class="{ 'text-muted': isNaN(data[i]) }">
              {{ formatValue(isNaN(data[i]) ? 0 : data[i], 'percentage', 2) }}
            </span>
          </td>

          <td>
            {{ formatValue(sum(data), 'percentage', 2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { qualities } from '~/calculator/constants';
import { formatValue, sum } from '~/calculator/utils';

const props = defineProps<{
  data: number[],
  sampleSize: number
}>();
</script>

<style lang="scss" scoped>
</style>

