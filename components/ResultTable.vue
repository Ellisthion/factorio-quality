<template>
  <div class="result-table-component">
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="quality of qualities" :key="quality">{{ quality }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Result
          </td>
          <td v-for="(q, i) of qualities" :key="q">
            {{ formatPercentage(data.getQualityValue(i)) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { qualities } from '~/calculator/constants';
import type { QualityItem } from '~/calculator/quality-item';

defineProps<{
  data: QualityItem
}>();

function formatPercentage(v: number): string {
  const decimalPlaces = 4;
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(v * 100 * multiplier) / multiplier + '%';
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

th, td {
  padding: 0.25rem;
  
  border: 1px solid black;
  text-align: right;
}
</style>

